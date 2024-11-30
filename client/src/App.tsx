import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/home";
import Explore from "./pages/explore";
import Detail from "./pages/pinDetail";
import Create from "./pages/pinCreate";
import Login from "./pages/login";
import Signup from "./pages/signup";
import AuthRoute from "./components/appRoute";
import Layout from "./components/layout";
import ProfilePage from "./pages/profilePage";

const App: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState<string>("");

    const handleSearchChange = (query: string) => {
        setSearchQuery(query);
    };

    return (
        <Router>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/" element={<Login />} />
                <Route element={<Layout onSearchChange={handleSearchChange} />}>
                    {" "}
                    {/* Pass the function to Layout */}
                    <Route
                        path="/home"
                        element={
                            <AuthRoute
                                element={<Home searchQuery={searchQuery} />}
                            />
                        }
                    />
                    <Route
                        path="/explore"
                        element={<AuthRoute element={<Explore />} />}
                    />
                    <Route
                        path="/detail/:id"
                        element={<AuthRoute element={<Detail />} />}
                    />
                    <Route
                        path="/profile"
                        element={<AuthRoute element={<ProfilePage />} />}
                    />
                    <Route
                        path="/create"
                        element={<AuthRoute element={<Create />} />}
                    />
                </Route>
            </Routes>
        </Router>
    );
};

export default App;
