import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AllRequests = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState('');
    const [filterTime, setFilterTime] = useState('');
    const [selectedRequest, setSelectedRequest] = useState(null);

    useEffect(() => {
        axios.get('http://localhost:5000/admin/requests')
            .then(res => {
                let data = res.data;
                
                // Status Filter
                if (filterStatus) {
                    data = data.filter(r => r.status === filterStatus);
                }
                
                // Time Filter
                if (filterTime) {
                    const now = new Date();
                    data = data.filter(r => {
                        const dateString = r.createdAt || r.requestDate;
                        if (!dateString) return false;
                        const reqDate = new Date(dateString);
                        
                        if (filterTime === 'today') {
                            return reqDate.toDateString() === now.toDateString();
                        } else if (filterTime === 'week') {
                            const lastWeek = new Date(now);
                            lastWeek.setDate(lastWeek.getDate() - 7);
                            return reqDate >= lastWeek;
                        } else if (filterTime === 'month') {
                            const lastMonth = new Date(now);
                            lastMonth.setMonth(lastMonth.getMonth() - 1);
                            return reqDate >= lastMonth;
                        }
                        return true;
                    });
                }

                setRequests(data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, [filterStatus, filterTime]);

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString();
    };

    return (
        <div className="bg-white p-6 rounded shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">All Requests</h1>
                <div className="flex gap-4">
                    <select 
                        className="select select-bordered select-sm max-w-xs"
                        value={filterTime}
                        onChange={(e) => setFilterTime(e.target.value)}
                    >
                        <option value="">All Time</option>
                        <option value="today">Today</option>
                        <option value="week">Past 7 Days</option>
                        <option value="month">Past 30 Days</option>
                    </select>
                    <select 
                        className="select select-bordered select-sm max-w-xs"
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                    >
                        <option value="">All Statuses</option>
                        <option value="pending">Pending</option>
                        <option value="accepted">Accepted</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                    </select>
                </div>
            </div>

            {loading ? (
                <span className="loading loading-spinner text-success block mx-auto"></span>
            ) : (
                <div className="overflow-x-auto">
                    <table className="table w-full">
                        <thead>
                            <tr className="bg-gray-50 uppercase text-xs text-gray-600">
                                <th>#</th>
                                <th>Requester</th>
                                <th>Donor</th>
                                <th>Request Date</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {requests.map((r, i) => (
                                <tr 
                                    key={r._id} 
                                    className="hover cursor-pointer"
                                    onClick={() => {
                                        setSelectedRequest(r);
                                        document.getElementById('request_modal').showModal();
                                    }}
                                >
                                    <th>{i + 1}</th>
                                    <td>
                                        <div className="flex flex-col">
                                            <span className="font-semibold">{r.requesterName || r.requesterEmail}</span>
                                            <span className="text-xs text-gray-500">{r.requesterEmail}</span>
                                        </div>
                                    </td>
                                    <td>{r.donnerEmail}</td>
                                    <td>{formatDate(r.createdAt || r.requestDate)}</td>
                                    <td>
                                        <span className={`badge ${
                                            r.status === 'delivered' ? 'badge-success text-white' : 
                                            r.status === 'accepted' ? 'badge-info text-white' : 
                                            r.status === 'pending' ? 'badge-warning text-white' : 'badge-error text-white'
                                        }`}>
                                            {r.status || 'pending'}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                            {requests.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="text-center py-4">No requests found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Request Details Modal */}
            <dialog id="request_modal" className="modal modal-bottom sm:modal-middle">
                <div className="modal-box">
                    <h3 className="font-bold text-lg border-b pb-2 mb-4">Request Details</h3>
                    {selectedRequest && (
                        <div className="space-y-4">
                            <div className="flex items-center gap-4 bg-gray-50 p-3 rounded-lg border border-gray-100">
                                <img 
                                    src={selectedRequest.foodImage || 'https://via.placeholder.com/150'} 
                                    alt={selectedRequest.foodName} 
                                    className="w-20 h-20 object-cover rounded shadow-sm"
                                />
                                <div className="flex flex-col gap-1">
                                    <h4 className="font-bold text-xl text-gray-800">{selectedRequest.foodName || 'Unknown Food'}</h4>
                                    <div>
                                        <span className={`badge ${
                                                selectedRequest.status === 'delivered' ? 'badge-success text-white' : 
                                                selectedRequest.status === 'accepted' ? 'badge-info text-white' : 
                                                selectedRequest.status === 'pending' ? 'badge-warning text-white' : 'badge-error text-white'
                                            }`}>
                                            {selectedRequest.status || 'pending'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                                    <p className="text-xs text-green-600 uppercase font-bold tracking-wider mb-2">Requester</p>
                                    <p className="text-sm font-semibold text-gray-800">{selectedRequest.requesterName || selectedRequest.requesterEmail.split('@')[0]}</p>
                                    <p className="text-xs text-gray-500 break-all">{selectedRequest.requesterEmail}</p>
                                </div>
                                
                                <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                                    <p className="text-xs text-orange-500 uppercase font-bold tracking-wider mb-2">Donor</p>
                                    <p className="text-sm font-semibold text-gray-800">{selectedRequest.donnerName || selectedRequest.donnerEmail.split('@')[0]}</p>
                                    <p className="text-xs text-gray-500 break-all">{selectedRequest.donnerEmail}</p>
                                </div>
                            </div>

                            <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                                <p className="text-xs text-blue-500 uppercase font-bold tracking-wider mb-2">Request Info</p>
                                <div className="space-y-1">
                                    <p className="text-sm flex justify-between"><span className="font-semibold text-gray-600">Date:</span> <span>{formatDate(selectedRequest.createdAt || selectedRequest.requestDate)}</span></p>
                                    <div className="divider m-0 h-1"></div>
                                    <p className="text-sm font-semibold text-gray-600">Notes:</p>
                                    <p className="text-sm text-gray-700 italic bg-white p-2 rounded border border-gray-200">{selectedRequest.requestNotes || 'No additional notes provided.'}</p>
                                </div>
                            </div>
                        </div>
                    )}
                    <div className="modal-action">
                        <form method="dialog">
                            <button className="btn btn-outline" onClick={() => setSelectedRequest(null)}>Close</button>
                        </form>
                    </div>
                </div>
            </dialog>
        </div>
    );
};

export default AllRequests;
