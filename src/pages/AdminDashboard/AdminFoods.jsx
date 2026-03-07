import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminFoods = () => {
    const [foods, setFoods] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch all foods or just available depending on requirement.
        // For admin, it's often useful to see all foods but filterable.
        // Here we just fetch available as per plan.
        axios.get(`${import.meta.env.VITE_API_URL}/foods?status=available`)
            .then(res => {
                setFoods(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString();
    };

    return (
        <div className="bg-white p-6 rounded shadow-sm border border-gray-100">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Available Foods</h1>

            {loading ? (
                <span className="loading loading-spinner text-success block mx-auto"></span>
            ) : (
                <div className="overflow-x-auto">
                    <table className="table w-full">
                        <thead>
                            <tr className="bg-gray-50 uppercase text-xs text-gray-600">
                                <th>#</th>
                                <th>Food Image</th>
                                <th>Food Name</th>
                                <th>Quantity</th>
                                <th>Expiration Date</th>
                                <th>Donor</th>
                            </tr>
                        </thead>
                        <tbody>
                            {foods.map((food, i) => (
                                <tr key={food._id} className="hover">
                                    <th>{i + 1}</th>
                                    <td>
                                        <div className="avatar">
                                            <div className="w-12 h-12 rounded">
                                                <img src={food.foodImage || 'https://via.placeholder.com/150'} alt={food.foodName} />
                                            </div>
                                        </div>
                                    </td>
                                    <td className="font-semibold">{food.foodName}</td>
                                    <td>{food.foodQuantity}</td>
                                    <td>{formatDate(food.expiredDate)}</td>
                                    <td>{food.donatorEmail}</td>
                                </tr>
                            ))}
                            {foods.length === 0 && (
                                <tr>
                                    <td colSpan="6" className="text-center py-4">No available foods found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default AdminFoods;
