import React, { useEffect, useState } from 'react';
import { FaArrowRight, FaStar } from 'react-icons/fa';
import axios from 'axios';
import { Link } from 'react-router';

const AvailableFood = ({allfood}) => {
    const [donorTrust, setDonorTrust] = useState(null);

    useEffect(() => {
        if (allfood.email) {
            axios.get(`http://localhost:5000/users/${allfood.email}`)
                .then(res => {
                    if (res.data && res.data.trustScore) {
                        setDonorTrust(res.data.trustScore);
                    }
                })
                .catch(err => console.error("Failed to fetch donor trust score", err));
        }
    }, [allfood.email]);

    return (
       <div className="card bg-base-100  shadow-sm overflow-hidden border border-gray-100">
  <figure className="relative">
    <img
      src={allfood.foodImage}
      alt="Food" 
      className='w-full h-100 object-cover'/>
    {donorTrust && donorTrust.totalReviews > 0 && (
      <div className="absolute top-2 right-2 bg-white px-2 py-1 rounded-full shadow-md text-xs font-bold text-gray-700 flex items-center gap-1">
          <FaStar className="text-orange-400" />
          {donorTrust.overall.toFixed(1)} ({donorTrust.totalReviews})
      </div>
    )}
  </figure>
  <div className="card-body p-4">
    <h2 className="card-title text-lg">{allfood.foodName}</h2>
    
    <div className='text-start text-sm text-gray-500 mb-2'>
        <p><span className="font-semibold text-gray-700">Donor:</span> {allfood.donnerName}</p>
        <p className="line-clamp-2"><span className="font-semibold text-gray-700">Notes:</span> {allfood.notes}</p>
    </div>
    
    <div className="card-actions justify-end mt-auto">
      <Link className="text-green-700 font-semibold flex items-center justify-center gap-1 hover:text-green-800 transition-colors" to={`/details/${allfood._id}`}>View Details <span><FaArrowRight /></span></Link>
    </div>
  </div>
</div>
    );
};

export default AvailableFood;