import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../Context/AuthContext';
import { Link } from 'react-router';
import FoodManage from './FoodManage';
import Loading from '../Loading/Loading';

const ManageFood = () => {
    const [myFoods,setMyFoods]=useState([])
    const [incomingRequests, setIncomingRequests] = useState([])

    const {user,myPostedFoods, myRequest}=useContext(AuthContext);

    useEffect(()=>{
        if(user?.email){
            myPostedFoods(user?.email).then(data=>setMyFoods(data))
            // Fetch the requests made *to* this donor
            myRequest(user?.email, 'donor').then(data => setIncomingRequests(data))
        }
    },[user,myPostedFoods, myRequest])

    

    return (
        <div className='w-full secondary py-32 min-h-screen'>
            <title>ManageFood</title>

            <div className="text-color text-center">
          <h1 className="text-3xl font-bold mb-3">Manage My Foods
            
            
          </h1>
          <p className="text-sm font-bold">
            
            View, Update, or delete the foods you've dhared.
          </p>
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