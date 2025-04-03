import React from 'react';
import { Outlet, Navigate, useLocation , matchPath } from 'react-router-dom';
import { useAuth } from './AuthContext';


const ProtectedRoutes = () => {
    const location = useLocation()

    const rolePermissions = {
        admin: ['/', '/business' , '/business/details' , '/categories/edit-category' ,  '/users/user-details' , '/business/add-business', '/business/add-photos', '/categories', '/categories/add-category', '/users', '/users/add-user', '/advertisements', '/advertisements/add-advertisements', '/cities', '/cities/add-cities', '/profile', '/advertisements/add-details/:id'],
        technician: ['/' ,'/categories', '/categories/edit-category' , '/advertisements', '/cities', '/profile', '/business' , '/business/add-photos' , '/business/add-business', '/advertisements/add-details/:id'],
        reviewer: ['/' ,'/business',  '/business/details' , '/profile', '/advertisements/add-details/:id']
    };

    const { authToken , userRole } = useAuth();

    if (!authToken) return <Navigate to='/login' />;
    

    const allowedRoutes = rolePermissions[userRole] || [];

    const isAllowed = allowedRoutes.some(route => matchPath(route, location.pathname));

    if (!isAllowed) {
        return <Navigate to='/' />;
    }

    return <Outlet />;
};

export default ProtectedRoutes;
