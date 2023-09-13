import React, { useContext } from 'react'
import { AuthContext } from '../../context/AuthContext';
import { Navigate } from 'react-router-dom';

export default function AdminAuth(props) {
    const [user] = useContext(AuthContext);
    console.log(user, "user");
    if (!user.isAdmin) return <Navigate to="/" />
    return props.children;
}
