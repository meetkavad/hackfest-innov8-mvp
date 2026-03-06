import React from 'react';
import { NavLink, Outlet } from 'react-router';

const AdminLayout = () => {
    return (
        <div className="flex flex-col md:flex-row min-h-screen bg-gray-50 pt-20">
            {/* Sidebar */}
            <aside className="w-full md:w-64 bg-white shadow-md flex flex-col">
                <div className="p-6 border-b flex flex-col items-center justify-center bg-gray-900 text-white gap-3 rounded-b-xl mx-2">
                    <img 
                      src="https://img.freepik.com/free-vector/business-user-cog_78370-7040.jpg?semt=ais_rp_progressive&w=740&q=80" 
                      alt="Admin Settings" 
                      className="w-16 h-16 rounded-full border-2 border-orange-300 object-cover"
                    />
                    <h2 className="text-xl font-bold tracking-wide">Admin Panel</h2>
                </div>
                <nav className="p-4 space-y-2">
                    <NavLink 
                        to="/admin/impacts" 
                        className={({isActive}) => `block px-4 py-2 rounded ${isActive ? 'bg-green-100 text-green-700 font-semibold' : 'text-gray-600 hover:bg-gray-100'}`}
                    >
                        Impacts
                    </NavLink>
                    <NavLink 
                        to="/admin/users" 
                        className={({isActive}) => `block px-4 py-2 rounded ${isActive ? 'bg-green-100 text-green-700 font-semibold' : 'text-gray-600 hover:bg-gray-100'}`}
                    >
                        Users
                    </NavLink>
                    <NavLink 
                        to="/admin/verification" 
                        className={({isActive}) => `block px-4 py-2 rounded ${isActive ? 'bg-orange-100 text-orange-700 font-semibold' : 'text-gray-600 hover:bg-gray-100'}`}
                    >
                        Verify Registrations
                    </NavLink>
                    <NavLink 
                        to="/admin/requests" 
                        className={({isActive}) => `block px-4 py-2 rounded ${isActive ? 'bg-green-100 text-green-700 font-semibold' : 'text-gray-600 hover:bg-gray-100'}`}
                    >
                        All Requests
                    </NavLink>
                    <NavLink 
                        to="/admin/foods" 
                        className={({isActive}) => `block px-4 py-2 rounded ${isActive ? 'bg-green-100 text-green-700 font-semibold' : 'text-gray-600 hover:bg-gray-100'}`}
                    >
                        Available Foods
                    </NavLink>
                    <NavLink 
                        to="/admin/poor-performers" 
                        className={({isActive}) => `block px-4 py-2 rounded ${isActive ? 'bg-red-100 text-red-700 font-bold' : 'text-red-500 font-semibold hover:bg-red-50'}`}
                    >
                        Poor Performers
                    </NavLink>
                    <NavLink 
                        to="/admin/add-admin" 
                        className={({isActive}) => `block px-4 py-2 rounded ${isActive ? 'bg-green-100 text-green-700 font-semibold' : 'text-gray-600 hover:bg-gray-100'}`}
                    >
                        Add Admin
                    </NavLink>
                </nav>
            </aside>

            {/* Main Content Arena */}
            <main className="flex-1 p-6 overflow-x-hidden">
                <Outlet />
            </main>
        </div>
    );
};

export default AdminLayout;
