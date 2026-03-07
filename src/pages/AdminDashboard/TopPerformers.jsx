import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaMedal, FaAward, FaGift } from 'react-icons/fa';

const TopPerformers = () => {
    const [performers, setPerformers] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchTopPerformers = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/admin/top-performers`);
            setPerformers(response.data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching top performers:", error);
            toast.error("Failed to load Top Performers");
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTopPerformers();
    }, []);

    const handleAwardBadge = async (email, currentBadges) => {
        const badgeName = window.prompt("Enter the badge name to award (e.g., 'Donor of the Month - March 2026'):");
        if (!badgeName) return;

        if (currentBadges && currentBadges.includes(badgeName)) {
            toast.warning("User already has this badge.");
            return;
        }

        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/admin/award-badge`, {
                email,
                badge: badgeName
            });
            if (response.data.message) {
                toast.success(`Badge "${badgeName}" awarded to ${email}!`);
                fetchTopPerformers(); // Refresh the list
            }
        } catch (error) {
            console.error("Error awarding badge:", error);
            toast.error("Failed to award badge.");
        }
    };

    if (loading) {
        return <div className="flex justify-center items-center h-64"><span className="loading loading-spinner loading-lg text-emerald-500"></span></div>;
    }

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-emerald-50 bg-opacity-50">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                        <FaMedal className="text-yellow-500" />
                        Top Performing Donors
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">Recognize and reward donors with the highest contribution.</p>
                </div>
            </div>

            <div className="overflow-x-auto p-4">
                <table className="table w-full">
                    <thead>
                        <tr className="bg-gray-50 text-gray-600 border-b border-gray-200">
                            <th className="rounded-l-lg">Rank</th>
                            <th>Donor Info</th>
                            <th>Donations (<FaGift className="inline text-emerald-500"/>)</th>
                            <th>Current Badges</th>
                            <th className="rounded-r-lg">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {performers.map((performer, index) => (
                            <tr key={index} className="hover:bg-gray-50 border-b border-gray-100 transition-colors">
                                <td className="font-bold text-lg text-gray-500">
                                    {index === 0 ? <span className="text-yellow-500 text-2xl">🥇</span> : 
                                     index === 1 ? <span className="text-gray-400 text-2xl">🥈</span> : 
                                     index === 2 ? <span className="text-yellow-700 text-2xl">🥉</span> : 
                                     `#${index + 1}`}
                                </td>
                                <td>
                                    <div className="flex items-center space-x-3">
                                        <div className="avatar">
                                            <div className="mask mask-squircle w-12 h-12 bg-emerald-100 flex items-center justify-center">
                                                {performer.photoUrl ? (
                                                    <img src={performer.photoUrl} alt="Avatar" />
                                                ) : (
                                                    <span className="text-xl font-bold text-emerald-700">
                                                        {(performer.businessName || performer.name || performer.email).charAt(0).toUpperCase()}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <div>
                                            <div className="font-bold text-gray-800">{performer.businessName || performer.name || 'Anonymous Donor'}</div>
                                            <div className="text-sm opacity-60">{performer.email}</div>
                                            {performer.trustScore && performer.trustScore.totalReviews > 0 && (
                                                <div className="text-xs font-semibold text-orange-500 mt-1 flex items-center gap-1">
                                                    ⭐ {performer.trustScore.overall.toFixed(1)} Trust Score
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <div className="badge badge-lg bg-emerald-100 text-emerald-800 border-emerald-200 font-bold px-4 py-3">
                                        {performer.totalFoodsDonated} items
                                    </div>
                                </td>
                                <td>
                                    <div className="flex flex-wrap gap-1 max-w-xs">
                                        {performer.badges && performer.badges.length > 0 ? (
                                            performer.badges.map((b, i) => (
                                                <span key={i} className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-bold rounded-full border border-yellow-200 flex items-center gap-1">
                                                    <FaAward /> {b}
                                                </span>
                                            ))
                                        ) : (
                                            <span className="text-gray-400 text-xs italic">No badges yet</span>
                                        )}
                                    </div>
                                </td>
                                <td>
                                    <button 
                                        onClick={() => handleAwardBadge(performer.email, performer.badges)}
                                        className="btn btn-sm btn-outline btn-warning border-dashed hover:border-solid gap-1 whitespace-nowrap"
                                    >
                                        <FaMedal className="text-base"/> Award Badge
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {performers.length === 0 && (
                            <tr>
                                <td colSpan="5" className="text-center py-10 text-gray-500 text-lg">
                                    No donors found yet. Wait for donations to start!
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default TopPerformers;
