import React, { useEffect, useState } from 'react';
import axios from 'axios';
// Use basic react icons or just standard icons
import { BiDonateHeart } from "react-icons/bi";
import { MdFastfood } from "react-icons/md";
import { FaUserPlus } from "react-icons/fa";
import { BsPeopleFill } from "react-icons/bs";

const Impacts = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get('http://localhost:5000/admin/stats')
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

                {/* Meals Saved */}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="p-4 bg-green-100 text-green-600 rounded-full text-2xl">
                        <MdFastfood />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 font-semibold">Meals Delivered</p>
                        <h3 className="text-3xl font-bold">{stats?.totalMealsSaved || 0}</h3>
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
        </div>
    );
};

export default Impacts;
