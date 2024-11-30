import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./navBar"; // Import your Navbar component

interface LayoutProps {
    onSearchChange: (query: string) => void; 
}

const Layout: React.FC<LayoutProps> = ({ onSearchChange }) => {
    return (
        <div>
            <Navbar onSearchChange={onSearchChange} /> 
            <div className="content">
                <Outlet />
            </div>
        </div>
    );
};

export default Layout;
