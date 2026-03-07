import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BarChart, Bar, LineChart, Line, ComposedChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
// Use basic react icons or just standard icons
import { BiDonateHeart } from "react-icons/bi";
import { MdFastfood } from "react-icons/md";
import { FaUserPlus } from "react-icons/fa";
import { BsPeopleFill } from "react-icons/bs";

const Impacts = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get(`${import.meta.env.VITE_API_URL}/admin/stats`)
            .then(res => {
                setStats(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    if (loading) return <span className="loading loading-spinner text-success block mx-auto mt-20"></span>;

    return (
        <div>
            <h1 className="text-2xl font-bold mb-6 text-gray-800">Platform Impacts Dashboard</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                
                {/* Total Donations */}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="p-4 bg-orange-100 text-orange-600 rounded-full text-2xl">
                        <BiDonateHeart />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 font-semibold">Total Foods Posted</p>
                        <h3 className="text-3xl font-bold">{stats?.totalDonations || 0}</h3>
                    </div>
                </div>

                {/* Meals Saved / People Fed */}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="p-4 bg-green-100 text-green-600 rounded-full text-2xl">
                        <MdFastfood />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 font-semibold">Total People Fed</p>
                        <h3 className="text-3xl font-bold">{stats?.totalPeopleFed || 0}</h3>
                    </div>
                </div>

                {/* Total Donors */}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="p-4 bg-blue-100 text-blue-600 rounded-full text-2xl">
                        <FaUserPlus />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 font-semibold">Total Donors</p>
                        <h3 className="text-3xl font-bold">{stats?.totalDonors || 0}</h3>
                    </div>
                </div>

                {/* Total Recipients */}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="p-4 bg-purple-100 text-purple-600 rounded-full text-2xl">
                        <BsPeopleFill />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 font-semibold">Total Recipients</p>
                        <h3 className="text-3xl font-bold">{stats?.totalRecipients || 0}</h3>
                    </div>
                </div>

            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
                
                {/* Users Distribution Chart */}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                    <h3 className="text-lg font-bold mb-4 text-gray-700">Users Distribution</h3>
                    <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie 
                                    data={[
                                        { name: 'Donors', value: stats?.totalDonors || 0 },
                                        { name: 'Recipients', value: stats?.totalRecipients || 0 }
                                    ]} 
                                    cx="50%" 
                                    cy="50%" 
                                    innerRadius={60}
                                    outerRadius={90} 
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    <Cell fill="#3b82f6" /> {/* Blue for Donors */}
                                    <Cell fill="#a855f7" /> {/* Purple for Recipients */}
                                </Pie>
                                <Tooltip formatter={(value) => [value, 'Users']} />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Foods By Status Chart */}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                    <h3 className="text-lg font-bold mb-4 text-gray-700">Foods by Status</h3>
                    <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={stats?.foodsByStatus?.map(t => ({ name: t._id, count: t.count })) || []}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="name" tick={{fill: '#6b7280', fontSize: 12}} />
                                <YAxis tick={{fill: '#6b7280', fontSize: 12}} />
                                <Tooltip 
                                    cursor={{fill: '#f3f4f6'}}
                                    contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'}}
                                />
                                <Bar dataKey="count" fill="#f97316" radius={[4, 4, 0, 0]} barSize={40} name="Total Foods">
                                    {
                                        (stats?.foodsByStatus || []).map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={
                                                entry._id === 'available' ? '#22c55e' : 
                                                entry._id === 'unavailable' ? '#ef4444' : '#f97316'
                                            } />
                                        ))
                                    }
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Requests By Status Chart */}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 lg:col-span-2">
                    <h3 className="text-lg font-bold mb-4 text-gray-700">Requests by Status</h3>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={stats?.requestsByStatus?.map(t => ({ name: t._id, count: t.count })) || []} layout="horizontal">
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="name" tick={{fill: '#6b7280', fontSize: 12}} />
                                <YAxis tick={{fill: '#6b7280', fontSize: 12}} />
                                <Tooltip 
                                    cursor={{fill: '#f3f4f6'}}
                                    contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'}}
                                />
                                <Bar dataKey="count" radius={[4, 4, 0, 0]} barSize={60} name="Total Requests">
                                     {
                                        (stats?.requestsByStatus || []).map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={
                                                entry._id === 'delivered' ? '#22c55e' : 
                                                entry._id === 'accepted' ? '#3b82f6' : 
                                                entry._id === 'canceled' ? '#f59e0b' : 
                                                entry._id === 'rejected' ? '#ef4444' : '#6366f1' // default for requested/pending
                                            } />
                                        ))
                                    }
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* People Fed By Month Chart */}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 lg:col-span-2">
                    <h3 className="text-lg font-bold mb-4 text-gray-700">People Fed Over Time (Month-wise)</h3>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <ComposedChart data={stats?.peopleFedByMonth || []}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="month" tick={{fill: '#6b7280', fontSize: 12}} />
                                <YAxis tick={{fill: '#6b7280', fontSize: 12}} />
                                <Tooltip 
                                    cursor={{fill: '#f3f4f6'}}
                                    contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'}}
                                />
                                <Bar dataKey="peopleFed" fill="#047857" radius={[4, 4, 0, 0]} barSize={50} name="People Fed (Monthly)" />
                                <Line 
                                    type="monotone" 
                                    dataKey="peopleFed" 
                                    stroke="#34d399" 
                                    strokeWidth={3}
                                    dot={{ fill: '#34d399', strokeWidth: 2, r: 6 }}
                                    activeDot={{ r: 8 }}
                                    name="Trend" 
                                />
                            </ComposedChart>
                        </ResponsiveContainer>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Impacts;
