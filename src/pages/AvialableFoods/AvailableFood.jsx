import React, { useEffect, useState } from 'react';
import { FaArrowRight, FaStar } from 'react-icons/fa';
import axios from 'axios';
import { Link } from 'react-router';

const AvailableFood = ({allfood}) => {
    const [donorTrust, setDonorTrust] = useState(null);
    const [donorBadges, setDonorBadges] = useState([]);

    useEffect(() => {
        if (allfood.email) {
            axios.get(`${import.meta.env.VITE_API_URL}/users/${allfood.email}`)
                .then(res => {
                    if (res.data) {
                        if (res.data.trustScore) {
                            setDonorTrust(res.data.trustScore);
                        }
                        if (res.data.badges) {
                            setDonorBadges(res.data.badges);
                        }
                    }
                })
                .catch(err => console.error("Failed to fetch donor trust score", err));
        }
    }, [allfood.email]);

    // Calculate freshness tag
    const getFreshnessTag = () => {
        if (!allfood.expiredDate) return null;
        
        const today = new Date();
        // Reset hours for accurate day-level comparison
        today.setHours(0, 0, 0, 0); 
        
        const expDate = new Date(allfood.expiredDate);
        expDate.setHours(0, 0, 0, 0);

        const diffTime = expDate.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays > 3) {
            return { label: "Fresh", color: "bg-emerald-500 text-white" };
        } else if (diffDays > 0 && diffDays <= 3) {
            return { label: "Expiring Soon", color: "bg-amber-400 text-amber-950" };
        } else if (diffDays === 0) {
            return { label: "Expires Today", color: "bg-red-500 text-white animate-pulse" };
        } else {
            return { label: "Expired", color: "bg-gray-500 text-white" };
        }
    };

    const freshness = getFreshnessTag();

    return (
       <div className="card bg-white rounded-2xl shadow-elegant hover-lift overflow-hidden border border-gray-100 transition-all">
  <figure className="relative h-48 sm:h-56">
    <img
      src={allfood.foodImage}
      alt="Food" 
      className='w-full h-full object-cover'/>
    
    {/* Freshness Badge */}
    {freshness && (
        <div className={`absolute top-2 left-2 px-3 py-1 rounded-full shadow-lg text-xs font-bold ${freshness.color}`}>
            {freshness.label}
        </div>
    )}

    {/* Donor Trust Rating */}
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
        <p><span className="font-semibold text-emerald-700">Donor:</span> <span className="text-gray-700">{allfood.donnerName || allfood.email?.split('@')[0] || "Generous Donor"}</span></p>
        <p><span className="font-semibold text-emerald-700">Quantity:</span> <span className="text-gray-700">{allfood.quantity || allfood.foodQuantity} People</span></p>
        <p className="line-clamp-2"><span className="font-semibold text-emerald-700">Notes:</span> <span className="text-gray-700">{allfood.notes}</span></p>
        
        {/* Donor Badges Display */}
        {donorBadges && donorBadges.length > 0 && (
            <div className="pt-2 flex flex-wrap gap-1">
                {donorBadges.map((badge, idx) => (
                    <span key={idx} className="text-[10px] px-2 py-0.5 bg-yellow-100 text-yellow-800 font-bold rounded border border-yellow-200 flex items-center gap-1" title={badge}>
                        <FaStar className="text-[10px]" /> {badge.length > 20 ? badge.substring(0,20)+'...' : badge}
                    </span>
                ))}
            </div>
        )}
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