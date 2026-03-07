import React, { useEffect, useState } from 'react';
import axios from 'axios';
import CountUp from 'react-countup';
import { MdFastfood } from "react-icons/md";
import { FaUserPlus } from "react-icons/fa";
import { BsPeopleFill } from "react-icons/bs";

const ImpactMetrics = () => {
    const [stats, setStats] = useState(null);

    useEffect(() => {
        axios.get(`${import.meta.env.VITE_API_URL}/admin/stats`)
            .then(res => setStats(res.data))
            .catch(err => console.error("Error fetching stats:", err));
    }, []);

    // Helper to render the count up wrapper
    const renderCounter = (endValue) => {
        return (
            <div className="h-12 flex items-end">
                <h3 className="text-4xl md:text-5xl font-extrabold text-gray-800">
                    <CountUp 
                        start={0} 
                        end={endValue} 
                        duration={2.5} 
                        separator="," 
                        useEasing={true}
                        enableScrollSpy={true}
                        scrollSpyOnce={true}
                    />+
                </h3>
            </div>
        );
    };

    return (
        <section className="py-16 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">Our Growing Impact</h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Every meal shared is a step towards a hunger-free community. See what we've achieved together.
                    </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    
                    {/* Total People Fed Card */}
                    <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-shadow duration-300 border border-gray-100 flex items-center justify-center gap-6">
                        <div className="p-5 bg-green-100 text-green-600 rounded-full text-4xl shadow-inner">
                            <MdFastfood />
                        </div>
                        <div className="flex flex-col">
                            <p className="text-lg text-gray-500 font-semibold mb-1">Total People Fed</p>
                            {renderCounter(stats?.totalPeopleFed || 0)}
                        </div>
                    </div>

                    {/* Total Donors Card */}
                    <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-shadow duration-300 border border-gray-100 flex items-center justify-center gap-6">
                        <div className="p-5 bg-blue-100 text-blue-600 rounded-full text-4xl shadow-inner">
                            <FaUserPlus />
                        </div>
                        <div className="flex flex-col">
                            <p className="text-lg text-gray-500 font-semibold mb-1">Total Donors</p>
                            {renderCounter(stats?.totalDonors || 0)}
                        </div>
                    </div>

                    {/* Total Recipients Card */}
                    <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-shadow duration-300 border border-gray-100 flex items-center justify-center gap-6">
                        <div className="p-5 bg-purple-100 text-purple-600 rounded-full text-4xl shadow-inner">
                            <BsPeopleFill />
                        </div>
                        <div className="flex flex-col">
                            <p className="text-lg text-gray-500 font-semibold mb-1">Total Recipients</p>
                            {renderCounter(stats?.totalRecipients || 0)}
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default ImpactMetrics;
