import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const UserVerification = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchUsers = () => {
        setLoading(true);
        // Using existing /users endpoint. Let's assume it fetches all users.
        axios.get(`${import.meta.env.VITE_API_URL}/users`)
            .then(res => {
                // Filter only pending users
                const pendingUsers = res.data.filter(u => u.status === 'pending');
                setUsers(pendingUsers);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleVerify = (id, newStatus) => {
        axios.patch(`${import.meta.env.VITE_API_URL}/admin/users/${id}/verify`, { status: newStatus })
            .then(() => {
                toast.success(`User successfully ${newStatus}!`);
                fetchUsers(); // Refresh the list
            })
            .catch(err => {
                toast.error(err.response?.data?.message || 'Error updating user status');
            });
    };

    return (
        <div className="bg-white p-6 rounded shadow-sm border border-gray-100">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Pending User Verifications</h1>

            {loading ? (
                <span className="loading loading-spinner text-success block mx-auto"></span>
            ) : (
                <div className="overflow-x-auto">
                    <table className="table w-full">
                        <thead>
                            <tr className="bg-gray-50 uppercase text-xs text-gray-600">
                                <th>Name / Org</th>
                                <th>Role</th>
                                <th>Email</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((u) => (
                                <tr key={u._id} className="hover">
                                    <td className="font-semibold">
                                        {u.role === 'donor' ? (u.businessName || u.name) : (u.orgName || u.name)}
                                    </td>
                                    <td>
                                        <span className={`badge ${u.role === 'donor' ? 'badge-info' : 'badge-accent'} text-white`}>
                                            {u.role}
                                        </span>
                                    </td>
                                    <td>{u.email}</td>
                                    <td>
                                        <button 
                                            className="btn btn-sm btn-outline btn-primary"
                                            onClick={() => {
                                                document.getElementById('verification_modal_' + u._id).showModal();
                                            }}
                                        >
                                            Review Documents
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {users.length === 0 && (
                                <tr>
                                    <td colSpan="4" className="text-center py-8 text-gray-500 font-medium">
                                        No pending users to verify.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Verification Details Modals */}
            {users.map(u => (
                <dialog key={`modal-${u._id}`} id={`verification_modal_${u._id}`} className="modal modal-bottom sm:modal-middle">
                    <div className="modal-box w-11/12 max-w-4xl">
                        <h3 className="font-bold text-xl border-b pb-3 mb-4">Review Verification Details</h3>
                        <div className="space-y-6">
                            
                            {/* Profile Header */}
                            <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-lg border border-gray-100">
                                <div className="avatar">
                                    <div className="w-16 h-16 rounded-full border border-gray-200">
                                        <img src={u.photoUrl || 'https://i.ibb.co/C0k71yB/default-avatar.png'} alt="user" />
                                    </div>
                                </div>
                                <div>
                                    <h4 className="font-bold text-2xl text-gray-800">
                                        {u.name} <span className="text-sm font-normal text-gray-500">({u.email})</span>
                                    </h4>
                                    <p className="text-sm font-semibold text-orange-500 uppercase tracking-widest mt-1">{u.role}</p>
                                </div>
                            </div>

                            {/* Dynamically display fields based on role */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                
                                {/* Donor Details */}
                                {u.role === 'donor' && (
                                    <>
                                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 space-y-2 text-sm">
                                            <h5 className="font-bold text-gray-700 uppercase mb-3 border-b pb-1">Business Identity</h5>
                                            <p><span className="font-semibold text-gray-500 w-32 inline-block">Business Name:</span> {u.businessName || 'N/A'}</p>
                                            <p><span className="font-semibold text-gray-500 w-32 inline-block">Owner Name:</span> {u.ownerName || 'N/A'}</p>
                                            <p><span className="font-semibold text-gray-500 w-32 inline-block">Reg No (FSSAI):</span> {u.businessRegNo || 'N/A'}</p>
                                            <p><span className="font-semibold text-gray-500 w-32 inline-block">Food Type:</span> {u.foodType || 'N/A'}</p>
                                        </div>
                                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 space-y-2 text-sm">
                                            <h5 className="font-bold text-gray-700 uppercase mb-3 border-b pb-1">Contact & Address</h5>
                                            <p><span className="font-semibold text-gray-500 w-24 inline-block">Phone:</span> {u.phone || 'N/A'}</p>
                                            <p><span className="font-semibold text-gray-500 w-24 inline-block">Hours:</span> {u.operatingHours || 'N/A'}</p>
                                            <p className="flex"><span className="font-semibold text-gray-500 w-24 shrink-0">Address:</span> <span>{u.address || 'N/A'}</span></p>
                                        </div>
                                    </>
                                )}

                                {/* Recipient Details */}
                                {u.role === 'recipient' && (
                                    <>
                                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 space-y-2 text-sm">
                                            <h5 className="font-bold text-gray-700 uppercase mb-3 border-b pb-1">Organization Info</h5>
                                            <p><span className="font-semibold text-gray-500 w-32 inline-block">Org Name:</span> {u.orgName || 'N/A'}</p>
                                            <p><span className="font-semibold text-gray-500 w-32 inline-block">Type:</span> {u.recipientType || 'N/A'}</p>
                                            <p><span className="font-semibold text-gray-500 w-32 inline-block">Est. People:</span> {u.estimatedPeople || 'N/A'}</p>
                                            <p><span className="font-semibold text-gray-500 w-32 inline-block">Contact Person:</span> {u.contactPerson || 'N/A'}</p>
                                        </div>
                                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 space-y-2 text-sm">
                                            <h5 className="font-bold text-gray-700 uppercase mb-3 border-b pb-1">Contact & Address</h5>
                                            <p><span className="font-semibold text-gray-500 w-24 inline-block">Phone:</span> {u.phone || 'N/A'}</p>
                                            <p className="flex"><span className="font-semibold text-gray-500 w-24 shrink-0">Pickup Addr:</span> <span>{u.pickupAddress || 'N/A'}</span></p>
                                        </div>
                                    </>
                                )}
                            </div>

                            {/* Document Links */}
                            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                                <h5 className="font-bold text-blue-800 uppercase mb-3 border-b border-blue-200 pb-1">Provided Documents</h5>
                                <div className="grid grid-cols-2 gap-4 text-sm mt-2">
                                    {u.role === 'donor' && (
                                        <>
                                            {u.fssaiCertUrl ? <a href={u.fssaiCertUrl} target="_blank" className="text-blue-600 underline hover:text-blue-800">📄 FSSAI Certificate</a> : <span className="text-gray-400">Missing FSSAI Cert</span>}
                                            {u.idProofUrl ? <a href={u.idProofUrl} target="_blank" className="text-blue-600 underline hover:text-blue-800">📄 ID Proof</a> : <span className="text-gray-400">Missing ID Proof</span>}
                                            {u.gstCertUrl && <a href={u.gstCertUrl} target="_blank" className="text-blue-600 underline hover:text-blue-800">📄 GST Certificate</a>}
                                            {u.addressProofUrl && <a href={u.addressProofUrl} target="_blank" className="text-blue-600 underline hover:text-blue-800">📄 Address Proof</a>}
                                        </>
                                    )}
                                    {u.role === 'recipient' && (
                                        <>
                                            {u.idProofUrl ? <a href={u.idProofUrl} target="_blank" className="text-blue-600 underline hover:text-blue-800">📄 ID Proof</a> : <span className="text-gray-400">Missing ID Proof</span>}
                                            {u.addressProofUrl ? <a href={u.addressProofUrl} target="_blank" className="text-blue-600 underline hover:text-blue-800">📄 Address Proof</a> : <span className="text-gray-400">Missing Address Proof</span>}
                                            {u.ngoRegCertUrl && <a href={u.ngoRegCertUrl} target="_blank" className="text-blue-600 underline hover:text-blue-800">📄 NGO Reg Cert</a>}
                                            {u.authLetterUrl && <a href={u.authLetterUrl} target="_blank" className="text-blue-600 underline hover:text-blue-800">📄 Auth Letter</a>}
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex justify-end gap-3 mt-8 pt-4 border-t">
                                <button className="btn btn-ghost" onClick={() => {
                                    document.getElementById('verification_modal_' + u._id).close();
                                }}>Cancel</button>
                                <button className="btn btn-error text-white" onClick={() => handleVerify(u._id, 'rejected')}>Reject User</button>
                                <button className="btn btn-success text-white" onClick={() => handleVerify(u._id, 'approved')}>Approve User</button>
                            </div>
                        </div>
                    </div>
                    <form method="dialog" className="modal-backdrop">
                        <button>close</button>
                    </form>
                </dialog>
            ))}
        </div>
    );
};

export default UserVerification;
