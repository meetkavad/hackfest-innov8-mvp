import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { AuthContext } from '../../Context/AuthContext';
import { Link } from 'react-router';
import FoodManage from './FoodManage';
import Loading from '../Loading/Loading';
import { FaAward } from 'react-icons/fa';

const ManageFood = () => {
    const [myFoods,setMyFoods]=useState([])
    const [incomingRequests, setIncomingRequests] = useState([])
    const [donorInfo, setDonorInfo] = useState(null)

    const {user,myPostedFoods, myRequest}=useContext(AuthContext);

    useEffect(()=>{
        if(user?.email){
            myPostedFoods(user?.email).then(data=>setMyFoods(data))
            // Fetch the requests made *to* this donor
            myRequest(user?.email, 'donor').then(data => setIncomingRequests(data))
            
            // Fetch donor profile to get badges
            axios.get(`${import.meta.env.VITE_API_URL}/users/${user?.email}`)
                .then(res => setDonorInfo(res.data))
                .catch(err => console.error("Failed to fetch donor info for badges", err));
        }
    },[user,myPostedFoods, myRequest])

    

    return (
        <div className='w-full secondary py-32 min-h-screen'>
            <title>ManageFood</title>

            <div className="text-color text-center mb-8">
              <h1 className="text-3xl font-bold mb-3">Manage My Foods</h1>
              <p className="text-sm font-bold mb-4">
                  View, Update, or delete the foods you've shared.
              </p>
              
              {/* Donor Badges Section */}
              {donorInfo && donorInfo.badges && donorInfo.badges.length > 0 && (
                  <div className="max-w-xl mx-auto bg-yellow-50 border border-yellow-200 rounded-xl p-4 shadow-sm animate-fade-in">
                      <h3 className="text-yellow-800 font-bold mb-2 flex items-center justify-center gap-2">
                          <FaAward className="text-xl" /> Congratulations! You have earned awards.
                      </h3>
                      <div className="flex flex-wrap justify-center gap-2">
                          {donorInfo.badges.map((badge, index) => (
                              <span key={index} className="px-3 py-1 bg-yellow-400 text-yellow-900 font-bold text-sm rounded-full shadow-sm flex items-center gap-1">
                                  <FaAward /> {badge}
                              </span>
                          ))}
                      </div>
                  </div>
              )}
            </div>

            <div className='responsive'>
                {
                    myFoods.length==0
                    ?
                    (
                       <div className=" w-full  flex items-center mt-10 justify-center text-center">
                               <div className="w-90 h-90">
                                 <p className="font-bold">You haven't added any food yet</p>
                                 <p className="font-medium">For add</p>{" "}
                                 <Link className="btn" to={"/addfood"}>
                                   Go To Add Food
                                 </Link>
                               </div>
                             </div>
                    )
                    :
                    (
                      <div className='mt-10'>
                        <div className="overflow-x-auto">
  <table className="table">
    {/* head */}
    <thead>
      <tr>
        <th>Index</th>
        <th>Food Name</th>
        <th>Food image(url)</th>
        <th>Expired Date</th>
        <th>Status</th>
        <th>Update or Delete</th>
      </tr>
    </thead>
    <tbody>
      {/* row 1 */}
      {
        myFoods.map((food,index)=><FoodManage key={index} index={index} myFoods={myFoods} setMyFoods={setMyFoods} food={food} incomingRequests={incomingRequests.filter(req => req.foodId === food._id)} setIncomingRequests={setIncomingRequests}></FoodManage>)
      }
      
    </tbody>
  </table>
</div>
                            
                      </div>
                    )
                }

            </div>
        </div>
    );
};

export default ManageFood;