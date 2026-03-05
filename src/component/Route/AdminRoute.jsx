import React, { useContext } from 'react';
import { Navigate } from 'react-router';
import { AuthContext } from '../../Context/AuthContext';

const AdminRoute = ({ children }) => {
    const { user, loading } = useContext(AuthContext);

    if (loading) {
        return (
            <div className='w-full min-h-screen flex items-center justify-center'>
                <span className="loading loading-bars loading-xl"></span>
            </div>
        );
    }

    if (user && user.role === 'admin') {
        return children;
    }

    return <Navigate to='/'></Navigate>;
};

export default AdminRoute;
