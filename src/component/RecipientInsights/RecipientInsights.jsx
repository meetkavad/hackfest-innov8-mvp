import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../Context/AuthContext';
import { FaChartLine, FaMapMarkedAlt, FaCalendarCheck } from 'react-icons/fa';
import axios from 'axios';

const RecipientInsights = () => {
  const { user } = useContext(AuthContext);
  const [insightData, setInsightData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInsights = async () => {
      if (user?.email && user?.role === 'recipient') {
        try {
          const res = await axios.get(`${import.meta.env.VITE_API_URL}/insights/recipient/${user.email}`);
          setInsightData(res.data);
        } catch (error) {
          console.error("Failed to fetch recipient insights", error);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchInsights();
  }, [user]);

  if (!user || user.role !== 'recipient') return null;

  if (loading) {
    return (
      <div className="w-full h-32 flex items-center justify-center bg-gray-50 bg-opacity-50 rounded-2xl mb-8 animate-pulse">
        <span className="loading loading-spinner text-emerald-500"></span>
      </div>
    );
  }

  if (!insightData) {
      return null;
  }

  return (
    <div className="w-full bg-white bg-opacity-60 backdrop-blur-md rounded-2xl shadow-lg border border-gray-100 p-6 mb-10 overflow-hidden relative">
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-emerald-100 rounded-full blur-3xl opacity-50 z-0"></div>
      
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-6 border-b border-gray-200 pb-4">
          <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600 shadow-sm">
            <FaChartLine size={20} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800">Local Area Insights</h2>
            <p className="text-xs text-gray-500 font-medium">AI-Predicted Available Foods within {insightData.radiusInKm}km</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Metric 1 */}
          <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl p-5 text-white shadow-md transform hover:-translate-y-1 transition-transform duration-300 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-white opacity-10 rounded-full -mr-8 -mt-8"></div>
            <p className="text-emerald-100 text-sm font-semibold mb-1 uppercase tracking-wider">Expected This Week</p>
            <div className="flex items-end gap-2">
              <span className="text-4xl font-extrabold">{insightData.expectedWeeklyVolume}</span>
              <span className="text-emerald-100 font-medium pb-1.5 opacity-80">items</span>
            </div>
            <p className="text-xs text-emerald-100 mt-2 opacity-90"><span className="font-bold">{insightData.totalPastMonth} items</span> generated locally last month.</p>
          </div>

          {/* Metric 2 */}
          <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className="flex items-center gap-2 mb-3">
               <FaCalendarCheck className="text-orange-500" />
               <p className="text-gray-500 text-sm font-bold uppercase tracking-wider">Peak Availability</p>
            </div>
            <span className="text-2xl font-bold text-gray-800 block">{insightData.peakDayName}s</span>
            <p className="text-xs text-gray-500 mt-2">Plan your pickup routes effectively by concentrating on peak days.</p>
          </div>

          {/* Metric 3 */}
          <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300">
             <div className="flex items-center gap-2 mb-3">
               <FaMapMarkedAlt className="text-blue-500" />
               <p className="text-gray-500 text-sm font-bold uppercase tracking-wider">Top Contributors</p>
            </div>
            {insightData.topDonorNames && insightData.topDonorNames.length > 0 ? (
                <ul className="text-sm text-gray-700 font-medium space-y-1.5">
                    {insightData.topDonorNames.map((name, idx) => (
                        <li key={idx} className="flex flex-row items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                            {name}
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-sm text-gray-400 italic">Not enough historical data.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipientInsights;
