import React, { useState, useEffect, useContext } from "react";
import { FaSearch } from "react-icons/fa";
import { useLoaderData, useNavigate } from "react-router";
import AvailableFood from "./AvailableFood";
import RecipientInsights from "../../component/RecipientInsights/RecipientInsights";
import { AuthContext } from "../../Context/AuthContext";
import axios from "axios";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icon missing in standard leaflet webpack setup
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Helper function to calculate distance using Haversine formula
const getDistanceFromLatLonInKm = (lat1, lon1, lat2, lon2) => {
  if (!lat1 || !lon1 || !lat2 || !lon2) return null;
  const R = 6371; // Radius of the earth in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in km
  return d;
};

const AvialableFoods = () => {
  const featuredFoods = useLoaderData();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  
  const [allFoods, setAllFoods] = useState(featuredFoods);
  const [userLocation, setUserLocation] = useState(null);
  
  // States for categorically grouped foods
  const [within1km, setWithin1km] = useState([]);
  const [within5km, setWithin5km] = useState([]);
  const [within10km, setWithin10km] = useState([]);
  const [others, setOthers] = useState([]);

  // Fetch logged in user's coordinates to calculate distances
  useEffect(() => {
    if (user && user.email) {
      axios.get(`${import.meta.env.VITE_API_URL}/users/${user.email}`)
        .then(res => {
          if (res.data && res.data.location && res.data.location.coordinates) {
             // GeoJSON stores coordinates as [longitude, latitude]
             setUserLocation({
                 lat: res.data.location.coordinates[1],
                 lng: res.data.location.coordinates[0]
             });
          }
        })
        .catch(err => console.error("Could not fetch user location for distance mapping", err));
    }
  }, [user]);

  // Group foods into categories whenever the list or location changes
  useEffect(() => {
     let temp1km = [];
     let temp5km = [];
     let temp10km = [];
     let tempOthers = [];

     allFoods.forEach(food => {
         let placed = false;
         
         if (userLocation && food.coordinates && food.coordinates.length === 2) {
             const foodLat = food.coordinates[1];
             const foodLng = food.coordinates[0];
             const dist = getDistanceFromLatLonInKm(userLocation.lat, userLocation.lng, foodLat, foodLng);
             
             if (dist !== null) {
                 // Attach distance to the food object for rendering
                 food.calculatedDistance = dist;

                 if (dist <= 1) {
                     temp1km.push(food);
                     placed = true;
                 } else if (dist <= 5) {
                     temp5km.push(food);
                     placed = true;
                 } else if (dist <= 10) {
                     temp10km.push(food);
                     placed = true;
                 }
             }
         }
         
         if (!placed) {
             tempOthers.push(food);
         }
     });

     // Sort the categorical arrays by: 
     // 1. Array buckets (already done, 1km, 5km, etc.)
     // 2. Expiration Date within those buckets (freshest / furthest in the future first)
     const sortByDate = (a, b) => {
         const dateA = new Date(a.expiredDate || a.createdAt).getTime();
         const dateB = new Date(b.expiredDate || b.createdAt).getTime();
         return dateB - dateA; // Descending (furthest future date first)
     };
     
     setWithin1km(temp1km.sort(sortByDate));
     setWithin5km(temp5km.sort(sortByDate));
     setWithin10km(temp10km.sort(sortByDate));
     setOthers(tempOthers.sort(sortByDate));

  }, [allFoods, userLocation]);

  const handleSearch = (e) => {
    e.preventDefault();
    const search = e.target.search.value;
    
    // Reset based on initial loaded data
    const searchResult = featuredFoods.filter(food => 
        food.foodName.toLowerCase().includes(search.toLocaleLowerCase()) ||
        food.donnerName?.toLowerCase().includes(search.toLocaleLowerCase())
    );
    setAllFoods(searchResult);
  };

  const mapCenter = userLocation ? [userLocation.lat, userLocation.lng] : [19.0760, 72.8777]; // default Mumbai

  return (
    <div className="py-24 md:py-32 w-full bg-slate-50 min-h-screen">
      <title>ShareBite | Available Foods</title>

      <div className="text-gray-800 text-center responsive">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight text-emerald-900">Available Foods</h1>
        <p className="text-base md:text-lg font-medium text-gray-500 max-w-2xl mx-auto mb-12">
          Browse all the shared meals that are up for grabs. Claim your portion
          before it's gone - help reduce food waste and support your community!
        </p>

        <RecipientInsights />

        <div className="w-full">
          <form onSubmit={handleSearch} className="flex items-stretch justify-center mb-10 mx-auto max-w-xl shadow-elegant rounded-full overflow-hidden bg-white hover-lift">
            <input 
              className="bg-transparent p-4 w-full outline-none text-gray-700 placeholder-gray-400" 
              type="search" 
              name='search' 
              placeholder="Search foods or donors..."
            />
            <button className="px-6 bg-emerald-500 hover:bg-emerald-600 text-white transition-colors flex items-center justify-center">
              <FaSearch size={18} />
            </button>
          </form>

          {/* Interactive Map Section */}
          <div className="w-full h-96 md:h-[500px] rounded-3xl overflow-hidden shadow-elegant mb-16 border-4 border-white relative z-[1]">
             <MapContainer 
                center={mapCenter} 
                zoom={11} 
                scrollWheelZoom={true} 
                className="h-full w-full z-0 relative z-[1]"
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                
                {/* User's own location marker */}
                {userLocation && (
                  <Marker position={[userLocation.lat, userLocation.lng]}>
                    <Popup><b>Your Location</b></Popup>
                  </Marker>
                )}

                {/* Food markers */}
                {allFoods.map((food) => {
                  if (food.coordinates && food.coordinates.length === 2) {
                    return (
                      <Marker 
                        key={`marker-${food._id}`} 
                        position={[food.coordinates[1], food.coordinates[0]]}
                        eventHandlers={{
                          click: () => {
                            navigate(`/details/${food._id}`);
                          },
                        }}
                      />
                    )
                  }
                  return null;
                })}
              </MapContainer>
          </div>

          <div className="text-left space-y-12">
              
              {userLocation && (<>
                  {within1km.length > 0 && (
                      <section>
                          <h2 className="text-2xl font-bold mb-6 text-emerald-800 flex items-center gap-2">
                            <span className="w-8 h-1 bg-emerald-500 rounded-full inline-block"></span>
                            Within 1 km
                          </h2>
                          <div className={`grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4`}>
                              {within1km.map(food => <AvailableFood key={food._id} allfood={food} />)}
                          </div>
                      </section>
                  )}

                  {within5km.length > 0 && (
                      <section>
                          <h2 className="text-2xl font-bold mb-6 text-emerald-600 flex items-center gap-2">
                            <span className="w-8 h-1 bg-emerald-400 rounded-full inline-block"></span>
                            Within 5 km
                          </h2>
                          <div className={`grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4`}>
                              {within5km.map(food => <AvailableFood key={food._id} allfood={food} />)}
                          </div>
                      </section>
                  )}

                  {within10km.length > 0 && (
                      <section>
                          <h2 className="text-2xl font-bold mb-6 text-amber-500 flex items-center gap-2">
                            <span className="w-8 h-1 bg-amber-400 rounded-full inline-block"></span>
                            Within 10 km
                          </h2>
                          <div className={`grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4`}>
                              {within10km.map(food => <AvailableFood key={food._id} allfood={food} />)}
                          </div>
                      </section>
                  )}
              </>)}

              {/* Catch-all for others (no location calc available or distance > 10km) */}
              {others.length > 0 && (
                  <section>
                      <h2 className="text-2xl font-bold mb-6 text-slate-700 flex items-center gap-2">
                          <span className="w-8 h-1 bg-slate-400 rounded-full inline-block"></span>
                          {userLocation ? "More than 10 km" : "All Available Foods"}
                      </h2>
                      <div className={`grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4`}>
                          {others.map(food => <AvailableFood key={food._id} allfood={food} />)}
                      </div>
                  </section>
              )}

              {allFoods.length === 0 && (
                  <div className="text-center py-10">
                      <p className="text-xl font-bold text-gray-500">No foods found matching your search.</p>
                  </div>
              )}

          </div>

        </div>
      </div>
    </div>
  );
};

export default AvialableFoods;
