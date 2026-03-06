import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../Context/AuthContext";
import { Link } from "react-router";
import RequestTable from "./RequestTable";

const MyFoodRequest = () => {
  const [requestFood, setRequestFood] = useState([]);
  const { user, myRequest } = useContext(AuthContext);

  useEffect(() => {
    if (user?.email) {
      myRequest(user?.email).then((data) => setRequestFood(data));
    }
  }, [user, myRequest, setRequestFood]);

  
  if (requestFood.length === 0) {
    return (
      <div className="min-h-screen w-full secondary flex items-center justify-center text-center">
        <div className="w-90 h-90">
          <p className="font-bold">You haven't request any food </p>
          <p className="font-medium">For request</p>{" "}
          <Link className="btn" to={"/availablefoods"}>
            Go To Availablefood
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen secondary py-32">
      <title>My Foods Request</title>
      <div className="responsive">
        <div className="text-color text-center">
          <h1 className="text-3xl font-bold mb-3">My Requested Foods
            
          </h1>
          <p className="text-sm font-bold">
            
            Here you can view all the foods you have requested. Track their status and stay updated.
          </p>
        </div>

        <div className="mt-10">

            <div className="overflow-x-auto">
  <table className="table bg-white ">
    {/* head */}
    <thead>
      <tr className="bg-emerald-50 text-emerald-900 shadow-sm">
        <th className="rounded-tl-lg">Index</th>
        <th>Donor Name</th>
        <th>Food Name</th>
        <th>Pickup Location</th>
        <th>Expiry Date</th>
        <th className="rounded-tr-lg">Request Date</th>
      </tr>
    </thead>
    <tbody>
      {/* row 1 */}
      {
        requestFood.map((request,index)=><RequestTable key={request._id || index} index={index} request={request} requestFood={requestFood} setRequestFood={setRequestFood}></RequestTable>)
      }
      
    </tbody>
  </table>
</div>

        </div>
      </div>
    </div>
  );
};

export default MyFoodRequest;
