import React, { useContext } from "react";
import { AuthContext } from "../../Context/AuthContext";
import axios from "axios";
import { toast } from "react-toastify";
import MapPicker from "../../component/MapPicker/MapPicker";
import { useState, useEffect, useRef } from "react";

const AddFood = () => {
  const { user } = useContext(AuthContext);
  
  // Try to load initial user info to get coordinates if they have them
  const [dbUser, setDbUser] = useState(null);
  const [location, setLocation] = useState(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [notifyRecipients, setNotifyRecipients] = useState(true);
  const [notifyRange, setNotifyRange] = useState(5);
  
  // Geolocation Search States
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searching, setSearching] = useState(false);
  const skipSearch = useRef(false);

  useEffect(() => {
    if (skipSearch.current) {
        skipSearch.current = false;
        return;
    }

    if (!searchQuery.trim()) {
        setSuggestions([]);
        return;
    }

    const delayDebounceFn = setTimeout(async () => {
      setSearching(true);
      try {
        const response = await axios.get(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}`);
        setSuggestions(response.data);
        if (response.data.length > 0) {
            setShowSuggestions(true);
        }
      } catch (error) {
        console.error("Failed to search location", error);
      } finally {
        setSearching(false);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  useEffect(() => {
    if (user?.email) {
      axios.get(`http://localhost:5000/users/${user.email}`)
        .then(res => {
          setDbUser(res.data);
          if (res.data?.address) {
             setSearchQuery(res.data.address);
          }
          if (res.data?.location?.coordinates) {
              const coords = res.data.location.coordinates;
              // Ensure we don't set invalid coordinates
              if (coords.length === 2 && !isNaN(coords[0]) && !isNaN(coords[1])) {
                 setLocation({ lng: coords[0], lat: coords[1] });
              }
          }
        })
        .catch(err => console.error("Could not fetch user info", err))
        .finally(() => setIsLoadingUser(false));
    } else {
       setIsLoadingUser(false);
    }
  }, [user]);

  const handleFormData=e=>{
    e.preventDefault()
    const form=e.target
    const formData=new FormData(form)
    const data=Object.fromEntries(formData.entries())
    data.donnerName=user?.name || user?.displayName
    data.donnerimage=user?.photoUrl || user?.photoURL
    data.email=user?.email
    data.status="available"
    const {quantity, ...newData}=data
    newData.quantity=parseInt(quantity)
    
    if (location) {
        newData.coordinates = [location.lng, location.lat];
    } else {
        return toast.error("Please pin the pickup location on the map.");
    }
    
    newData.location = searchQuery; // Override location with our controlled input
    newData.notifyRecipients = notifyRecipients;
    newData.notifyRange = notifyRange;

    axios.post('http://localhost:5000/foods',newData).then(res=>{
        if(res.data.insertedId){
            toast.success('Foods Added Successfully!')
            form.reset()
            setSearchQuery("");
            setSuggestions([]);
        }
    })

    

    
  }
  return (
    <div className="w-full  secondary py-32">
      <title>ShareBite || add food</title>
      <div className="text-center text-color">
        <h1 className="text-3xl font-bold mb-3">Share Your Surplus Food</h1>
        <p>
          Help reduce food waste and feed someone in need by sharing your extra
          food. Fill out the form below to add a food item.
        </p>
      </div>

      <div className="responsive">
        <form onSubmit={handleFormData} className="mt-10">
          <fieldset className="fieldset bg-white border-none rounded-box md:w-1/2 space-y-1 md:mx-auto w-full border p-4">
            

            <label className="font-bold">Food Name</label>
            <input
              type="text"
              className="input w-full border border-cyan-400 focus:outline-none "
              placeholder="Food Name"
              required
              name='foodName'
            />

            <label className="font-bold">Food Image</label>
            <input
              type="url"
              className="input w-full border border-cyan-400 focus:outline-none "
              placeholder="Food image (url)"
              required
              name='foodImage'
            />

            <label className="font-bold">Food Quantity</label>
            <input
              type="number"
              className="input w-full border border-cyan-400 focus:outline-none"
              placeholder="Quantity"
              required
              name='quantity'
            />

            <div className="relative">
                <label className="font-bold block mb-1">Pickup Location Description</label>
                <div className="flex gap-2 relative items-center">
                    <input
                      type="text"
                      className="input w-full border border-cyan-400 focus:outline-none pr-10"
                      placeholder="Type address to search..."
                      required
                      name='location'
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onFocus={() => { if(suggestions.length > 0) setShowSuggestions(true); }}
                    />
                    {searching && <span className="absolute right-3 loading loading-spinner text-cyan-500 h-5 w-5"></span>}
                </div>
                
                {/* Suggestions Dropdown */}
                {showSuggestions && suggestions.length > 0 && (
                    <ul className="absolute w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto" style={{ zIndex: 40 }}>
                        <li className="p-2 border-b bg-gray-50 text-xs font-bold text-gray-500 uppercase flex justify-between">
                            <span>Select a location</span>
                            <button type="button" onClick={() => setShowSuggestions(false)} className="hover:text-red-500">Close</button>
                        </li>
                        {suggestions.map((sug, i) => (
                            <li 
                                key={i} 
                                className="p-3 border-b hover:bg-cyan-50 cursor-pointer text-sm text-gray-700"
                                onClick={() => {
                                    skipSearch.current = true;
                                    setSearchQuery(sug.display_name);
                                    setLocation({ lat: parseFloat(sug.lat), lng: parseFloat(sug.lon) });
                                    setShowSuggestions(false);
                                }}
                            >
                                {sug.display_name}
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            <label className="font-bold">Pin Pickup Location on map</label>
            {!isLoadingUser ? (
                <MapPicker 
                  defaultLocation={location} 
                  onLocationSelect={(loc) => setLocation(loc)} 
                />
            ) : (
                <div className="h-64 flex items-center justify-center bg-gray-100 rounded-lg text-gray-500 font-bold">Loading your default map...</div>
            )}
            
            <div className="flex flex-col gap-2 bg-gray-50 p-3 rounded-xl border border-gray-200 mt-2 mb-2">
                <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                        type="checkbox" 
                        checked={notifyRecipients}
                        onChange={(e) => setNotifyRecipients(e.target.checked)}
                        className="checkbox checkbox-primary checkbox-sm" 
                    />
                    <span className="font-bold text-sm">Notify nearby recipients</span>
                </label>
                
                {notifyRecipients && (
                    <div className="flex items-center gap-2 mt-1">
                        <span className="text-sm">Range (km):</span>
                        <input 
                            type="number" 
                            min="1" 
                            max="50" 
                            value={notifyRange}
                            onChange={(e) => setNotifyRange(Number(e.target.value))}
                            className="input input-sm border border-gray-300 w-24" 
                        />
                    </div>
                )}
            </div>

            <label className="font-bold">Expiry Date</label>
            <input
              type="date"
              className="input w-full border border-cyan-400 focus:outline-none"
              
              required
              name='expiredDate'
            />
            <label className="font-bold">Aditional Notes</label>
            <textarea
              type="date"
              className="input w-full border border-cyan-400 focus:outline-none  py-2"
              placeholder="Aditional Notes"
              
              required
              name='notes'
            />


            <input type="submit"  className="primary btn mt-5 text-white font-bold hover:bg-green-300"/>

            
          </fieldset>
        </form>
      </div>
    </div>
  );
};

export default AddFood;
