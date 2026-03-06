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
       <div className="card bg-white rounded-2xl shadow-elegant hover-lift overflow-hidden border border-gray-100 transition-all">
  <figure className="relative h-48 sm:h-56">
    <img
      src={allfood.foodImage}
      alt="Food" 
      className='w-full h-full object-cover'/>
    {donorTrust && donorTrust.totalReviews > 0 && (
      <div className="absolute top-2 right-2 bg-white px-2 py-1 rounded-full shadow-md text-xs font-bold text-gray-700 flex items-center gap-1">
          <FaStar className="text-orange-400" />
          {donorTrust.overall.toFixed(1)} ({donorTrust.totalReviews})
      </div>
    )}
  </figure>
  <div className="card-body p-5">
    <h2 className="card-title text-xl font-bold text-gray-800 tracking-tight">{allfood.foodName}</h2>
    
    <div className='text-start text-sm text-gray-500 mb-4 mt-2 space-y-1 bg-gray-50 p-3 rounded-xl border border-gray-100'>
        <p><span className="font-semibold text-emerald-700">Donor:</span> <span className="text-gray-700">{allfood.donnerName}</span></p>
        <p className="line-clamp-2"><span className="font-semibold text-emerald-700">Notes:</span> <span className="text-gray-700">{allfood.notes}</span></p>
    </div>
    
    <div className="card-actions justify-end mt-auto pt-2 border-t border-gray-100">
      <Link className="text-emerald-600 font-bold flex items-center justify-center gap-2 hover:text-emerald-800 transition-colors group" to={`/details/${allfood._id}`}>
        View Details 
        <span className="transform group-hover:translate-x-1 transition-transform"><FaArrowRight /></span>
      </Link>
    </div>
  </div>
</div>
    );
};

export default AvailableFood;