import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import moment from 'moment';

const PoorPerformers = () => {
    const [donors, setDonors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [processingId, setProcessingId] = useState(null);

    useEffect(() => {
        fetchPoorPerformers();
    }, []);

    const fetchPoorPerformers = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/admin/poor-performers`);
            const data = await response.json();
            if (response.ok) {
                setDonors(data);
            } else {
                toast.error(data.message || 'Failed to fetch poor performers');
            }
        } catch (error) {
            console.error(error);
            toast.error('Network error fetching poor performers');
        } finally {
            setLoading(false);
        }
    };

    const handleBlockDonor = async (donorId) => {
        if (!window.confirm("Are you sure you want to block this donor? They will not be able to log in or use the platform.")) {
            return;
        }

        setProcessingId(donorId);
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/admin/users/${donorId}/verify`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ status: 'rejected' })
            });

            const data = await response.json();

            if (response.ok) {
                toast.success('Donor successfully blocked.');
                setDonors(donors.map(d => d._id === donorId ? { ...d, status: 'rejected' } : d));
            } else {
                toast.error(data.message || 'Failed to block donor');
            }
        } catch (error) {
            console.error(error);
            toast.error('Network error while blocking donor');
        } finally {
            setProcessingId(null);
        }
    };

    if (loading) {
        return <div className="flex justify-center items-center py-20"><span className="loading loading-spinner loading-lg text-error"></span></div>;
    }

    return (
        <div className="bg-white rounded-xl shadow-sm border border-red-100 overflow-hidden">
            <div className="p-6 border-b border-red-100 bg-red-50 flex justify-between items-center">
                <div>
                    <h2 className="text-xl font-bold text-red-900">Poor Performers Tracker</h2>
                    <p className="text-sm text-red-700 mt-1">
                        Donors with an overall trust rating below <span className="font-bold">1.5</span> (minimum 5 reviews).
                    </p>
                </div>
                <div className="badge bg-red-600 text-white font-bold p-3">
                    {donors.length} Identified
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="table w-full">
                    <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
                        <tr>
                            <th>Donor Profile</th>
                            <th>Contact</th>
                            <th className="text-center">Reviews</th>
                            <th className="text-center">Poor Rating</th>
                            <th>Status Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {donors.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="text-center py-10 text-gray-500 font-medium">
                                    Great news! No donors currently meet the poor performance criteria.
                                </td>
                            </tr>
                        ) : (
                            donors.map(donor => (
                                <tr key={donor._id} className="hover:bg-red-50/50 transition-colors">
                                    <td>
                                        <div className="flex items-center gap-3">
                                            <div className="avatar">
                                                <div className="mask mask-squircle w-12 h-12">
                                                    <img src={donor.photoUrl || "https://img.freepik.com/free-vector/businessman-character-avatar-isolated_24877-60111.jpg"} alt={donor.name} />
                                                </div>
                                            </div>
                                            <div>
                                                <div className="font-bold text-gray-800">{donor.name || donor.businessName || donor.orgName}</div>
                                                <div className="text-xs text-gray-500 opacity-70">Joined {moment(donor.createdAt).format('MMM D, YYYY')}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="text-sm">{donor.email}</div>
                                        <div className="text-xs text-gray-500">{donor.phone || "No phone"}</div>
                                    </td>
                                    <td className="text-center font-bold text-gray-700">
                                        {donor.trustScore?.totalReviews || 0}
                                    </td>
                                    <td className="text-center">
                                        <div className="badge bg-red-100 text-red-800 border-red-200 gap-1 p-3 font-black text-lg shadow-inner">
                                            {donor.trustScore?.overall?.toFixed(1) || "0.0"} <span>★</span>
                                        </div>
                                    </td>
                                    <td>
                                        {donor.status === 'rejected' ? (
                                            <span className="badge badge-error gap-2 text-white p-3 shadow-sm font-bold opacity-80 cursor-not-allowed">
                                                Blocked 🚫
                                            </span>
                                        ) : (
                                            <button 
                                                onClick={() => handleBlockDonor(donor._id)}
                                                disabled={processingId === donor._id}
                                                className="btn btn-sm bg-red-600 hover:bg-red-700 border-none text-white shadow-sm"
                                            >
                                                {processingId === donor._id ? 'Blocking...' : 'Block Donor'}
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default PoorPerformers;
