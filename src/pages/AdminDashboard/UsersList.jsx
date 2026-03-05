import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const UsersList = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterRole, setFilterRole] = useState('');

    const fetchUsers = () => {
        const query = filterRole ? `?role=${filterRole}` : '';
        axios.get(`http://localhost:5000/users${query}`)
            .then(res => {
                setUsers(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchUsers();
    }, [filterRole]);

    const handleDeleteUser = (userId, reason) => {
        if (!reason) {
            toast.error("Please provide a reason for deletion.");
            return;
        }
        
        axios.delete(`http://localhost:5000/admin/users/${userId}`, { data: { reason } })
            .then(() => {
                toast.success('User deleted successfully and email sent!');
                document.getElementById('user_details_modal_' + userId).close();
                document.getElementById('delete_modal_' + userId).close();
                fetchUsers();
            })
            .catch(err => {
                toast.error(err.response?.data?.message || 'Error deleting user');
            });
    };

    return (
        <div className="bg-white p-6 rounded shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Platform Users</h1>
                <select 
                    className="select select-bordered select-sm max-w-xs"
                    value={filterRole}
                    onChange={(e) => setFilterRole(e.target.value)}
                >
                    <option value="">All Roles</option>
                    <option value="donor">Donors</option>
                    <option value="recipient">Recipients</option>
                    <option value="admin">Admins</option>
                </select>
            </div>

            {loading ? (
                <span className="loading loading-spinner text-success block mx-auto"></span>
            ) : (
                <div className="overflow-x-auto">
                    <table className="table w-full">
                        <thead>
                            <tr className="bg-gray-50 uppercase text-xs text-gray-600">
                                <th>#</th>
                                <th>Profile</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Role</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((u, i) => (
                                <tr 
                                    key={u._id} 
                                    className="hover cursor-pointer"
                                    onClick={() => {
                                        document.getElementById('user_details_modal_' + u._id).showModal();
                                    }}
                                >
                                    <th>{i + 1}</th>
                                    <td>
                                        <div className="avatar">
                                            <div className="w-10 rounded-full">
                                                <img src={u.photoUrl || 'https://i.ibb.co/C0k71yB/default-avatar.png'} alt={u.name} />
                                            </div>
                                        </div>
                                    </td>
                                    <td className="font-semibold">
                                        {u.role === 'donor' ? (u.businessName || u.name) : u.role === 'recipient' ? (u.orgName || u.name) : u.name}
                                    </td>
                                    <td>{u.email}</td>
                                    <td>
                                        <span className={`badge ${u.role === 'admin' ? 'badge-primary' : u.role === 'donor' ? 'badge-info' : 'badge-accent'}`}>
                                            {u.role}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                            {users.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="text-center py-4">No users found for this role.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
            {/* User Details Modals */}
            {users.map((u) => (
                <dialog key={`modal-${u._id}`} id={`user_details_modal_${u._id}`} className="modal modal-bottom sm:modal-middle">
                    <div className="modal-box w-11/12 max-w-2xl">
                        <h3 className="font-bold text-xl border-b pb-3 mb-4">User Details</h3>
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
                                        {u.role === 'donor' ? (u.businessName || u.name) : u.role === 'recipient' ? (u.orgName || u.name) : u.name}
                                    </h4>
                                    <p className="text-sm text-gray-500">{u.email}</p>
                                    <span className={`badge badge-sm mt-2 ${u.role === 'admin' ? 'badge-primary' : u.role === 'donor' ? 'badge-info text-white' : 'badge-accent text-white'}`}>
                                        {u.role}
                                    </span>
                                </div>
                            </div>

                            {/* Dynamically display fields based on role */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                
                                {/* Donor Details */}
                                {u.role === 'donor' && (
                                    <>
                                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 space-y-2 text-sm">
                                            <h5 className="font-bold text-gray-700 uppercase mb-3 border-b pb-1">Business Info</h5>
                                            <p><span className="font-semibold text-gray-500 w-28 inline-block">Owner Name:</span> {u.ownerName || 'N/A'}</p>
                                            <p><span className="font-semibold text-gray-500 w-28 inline-block">Reg No:</span> {u.businessRegNo || 'N/A'}</p>
                                            <p><span className="font-semibold text-gray-500 w-28 inline-block">Food Type:</span> {u.foodType || 'N/A'}</p>
                                        </div>
                                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 space-y-2 text-sm">
                                            <h5 className="font-bold text-gray-700 uppercase mb-3 border-b pb-1">Contact</h5>
                                            <p><span className="font-semibold text-gray-500 w-20 inline-block">Phone:</span> {u.phone || 'N/A'}</p>
                                            <p><span className="font-semibold text-gray-500 w-20 inline-block">Hours:</span> {u.operatingHours || 'N/A'}</p>
                                            <p className="flex"><span className="font-semibold text-gray-500 w-20 shrink-0">Address:</span> <span>{u.address || 'N/A'}</span></p>
                                        </div>
                                    </>
                                )}

                                {/* Recipient Details */}
                                {u.role === 'recipient' && (
                                    <>
                                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 space-y-2 text-sm">
                                            <h5 className="font-bold text-gray-700 uppercase mb-3 border-b pb-1">Organization Info</h5>
                                            <p><span className="font-semibold text-gray-500 w-32 inline-block">Type:</span> {u.recipientType || 'N/A'}</p>
                                            <p><span className="font-semibold text-gray-500 w-32 inline-block">Est. People:</span> {u.estimatedPeople || 'N/A'}</p>
                                            <p><span className="font-semibold text-gray-500 w-32 inline-block">Contact Person:</span> {u.contactPerson || 'N/A'}</p>
                                        </div>
                                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 space-y-2 text-sm">
                                            <h5 className="font-bold text-gray-700 uppercase mb-3 border-b pb-1">Contact</h5>
                                            <p><span className="font-semibold text-gray-500 w-24 inline-block">Phone:</span> {u.phone || 'N/A'}</p>
                                            <p className="flex"><span className="font-semibold text-gray-500 w-24 shrink-0">Address:</span> <span>{u.pickupAddress || 'N/A'}</span></p>
                                        </div>
                                    </>
                                )}
                                
                                {/* Status and Dates */}
                                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 space-y-2 text-sm md:col-span-2">
                                    <h5 className="font-bold text-blue-800 uppercase mb-3 border-b border-blue-200 pb-1">Account Status</h5>
                                    <div className="flex gap-4">
                                        <p><span className="font-semibold text-blue-700">Status:</span> <span className="uppercase font-bold">{u.status || 'Active'}</span></p>
                                        {u.createdAt && <p><span className="font-semibold text-blue-700">Joined:</span> {new Date(u.createdAt).toLocaleDateString()}</p>}
                                    </div>
                                </div>
                            </div>
                            
                            {/* Document Links */}
                            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 mt-6">
                                <h5 className="font-bold text-blue-800 uppercase mb-3 border-b border-blue-200 pb-1">Provided Documents</h5>
                                <div className="grid grid-cols-2 gap-4 text-sm mt-2">
                                    {u.role === 'donor' && (
                                        <>
                                            {u.fssaiCertUrl ? <a href={u.fssaiCertUrl} target="_blank" rel="noreferrer" className="text-blue-600 underline hover:text-blue-800">📄 FSSAI Certificate</a> : <span className="text-gray-400">Missing FSSAI Cert</span>}
                                            {u.idProofUrl ? <a href={u.idProofUrl} target="_blank" rel="noreferrer" className="text-blue-600 underline hover:text-blue-800">📄 ID Proof</a> : <span className="text-gray-400">Missing ID Proof</span>}
                                            {u.gstCertUrl && <a href={u.gstCertUrl} target="_blank" rel="noreferrer" className="text-blue-600 underline hover:text-blue-800">📄 GST Certificate</a>}
                                            {u.addressProofUrl && <a href={u.addressProofUrl} target="_blank" rel="noreferrer" className="text-blue-600 underline hover:text-blue-800">📄 Address Proof</a>}
                                        </>
                                    )}
                                    {u.role === 'recipient' && (
                                        <>
                                            {u.idProofUrl ? <a href={u.idProofUrl} target="_blank" rel="noreferrer" className="text-blue-600 underline hover:text-blue-800">📄 ID Proof</a> : <span className="text-gray-400">Missing ID Proof</span>}
                                            {u.addressProofUrl ? <a href={u.addressProofUrl} target="_blank" rel="noreferrer" className="text-blue-600 underline hover:text-blue-800">📄 Address Proof</a> : <span className="text-gray-400">Missing Address Proof</span>}
                                            {u.ngoRegCertUrl && <a href={u.ngoRegCertUrl} target="_blank" rel="noreferrer" className="text-blue-600 underline hover:text-blue-800">📄 NGO Reg Cert</a>}
                                            {u.authLetterUrl && <a href={u.authLetterUrl} target="_blank" rel="noreferrer" className="text-blue-600 underline hover:text-blue-800">📄 Auth Letter</a>}
                                        </>
                                    )}
                                </div>
                            </div>
                            
                            <div className="flex justify-between items-center mt-8 pt-4 border-t">
                                <button className="btn btn-error text-white" onClick={(e) => {
                                    e.preventDefault();
                                    document.getElementById('delete_modal_' + u._id).showModal();
                                }}>Delete User</button>
                                <form method="dialog">
                                    <button className="btn btn-outline">Close</button>
                                </form>
                            </div>
                        </div>
                    </div>
                    <form method="dialog" className="modal-backdrop">
                        <button>close</button>
                    </form>
                </dialog>
            ))}

            {/* Delete Confirmation Modals */}
            {users.map((u) => (
                <dialog key={`delete-modal-${u._id}`} id={`delete_modal_${u._id}`} className="modal modal-bottom sm:modal-middle">
                    <div className="modal-box">
                        <h3 className="font-bold text-lg text-error">Delete User</h3>
                        <p className="py-4">Are you sure you want to delete <strong>{u.name}</strong>? This action cannot be undone.</p>
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text text-gray-700 font-semibold">Reason for deletion (will be emailed to user)</span>
                            </label>
                            <textarea id={`delete_reason_${u._id}`} className="textarea textarea-bordered h-24" placeholder="Enter reason here..."></textarea>
                        </div>
                        <div className="modal-action">
                            <form method="dialog" className="flex gap-2 w-full justify-end">
                                <button className="btn btn-ghost">Cancel</button>
                                <button 
                                    className="btn btn-error text-white"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        const reason = document.getElementById(`delete_reason_${u._id}`).value;
                                        handleDeleteUser(u._id, reason);
                                    }}
                                >
                                    Confirm Delete
                                </button>
                            </form>
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

export default UsersList;
