import React from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';


const ProtectedRoutes = () => {
    const location = useLocation()

    const rolePermissions = {
        admin: ['/', '/business' ,  '/business/details' , '/categories/edit-category' ,  '/users/user-details' , '/business/add-business', '/business/add-photos', '/categories', '/categories/add-category', '/users', '/users/add-user', '/advertisements', '/advertisements/add-advertisements', '/cities', '/cities/add-cities', '/profile'],
        technician: ['/' ,'/categories', '/categories/edit-category' , '/advertisements', '/cities', '/profile', '/business' , '/business/add-business', '/users/user-details' , '/users', '/users/add-user',],
        reviewer: ['/' ,'/business',  '/business/details' , '/profile']
    };

    const { authToken , userRole } = useAuth();

    if (!authToken) return <Navigate to='/login' />;
    

    const allowedRoutes = rolePermissions[userRole] || [];
    if (!allowedRoutes.includes(location.pathname)) {
        return <Navigate to='/' />;
    }

    return <Outlet />;
};

export default ProtectedRoutes;
