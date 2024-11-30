import React from "react";
import { Navigate, RouteProps } from "react-router-dom";


const isAuthenticated = (): boolean => {
    return localStorage.getItem("token") !== null;
};

// AuthRoute component: wraps routes that need to be protected
const AuthRoute: React.FC<RouteProps> = ({ element }) => {
    return isAuthenticated() ? (
        <>{element}</>
    ) : (
        <Navigate to="/login" replace />
    );
};

export default AuthRoute;
