import React, { createContext, useState, useEffect } from 'react';
import backend from '../api';
import Cookies from "js-cookie";

export const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await backend.get('/users/me', { withCredentials: true });

                if (response.data.status === 'success') {
                    setUser(response.data.data);
                } else {
                    console.error("Failed to fetch user:", response.data.message);
                    setUser(null);
                }
            } catch (error) {
                console.error("Error fetching user:", error);
                if (error.response && error.response.status === 500) {
                    console.warn("Server returned 500 - Assuming user is logged out.");
                    setUser(null);
                }
            }
            finally {
                setLoading(false); // Set loading to false after the request
            }
        };

        fetchUser();
    }, []);

    const getCSRFToken = () => {
        return Cookies.get("csrftoken"); // Get CSRF token from cookies
    };

    const logoutUser = async () => {
        try {
            const response = await backend.post('/oauth/logout/', {}, 
                { 
                    headers: { "X-CSRFToken": getCSRFToken() },
                    withCredentials: true 
                });

            if (response.status === 200) {
                console.log("Logged out successfully");

                window.location.href = "/logged-out";

                setTimeout(() => setUser(null), 100);
            } else {
                console.error("Logout failed");
            }
        } catch (error) {
            console.error("Error logging out:", error);
        }
    };

    return (
        <UserContext.Provider value={{ user, setUser, loading, logoutUser }}>
            {children}
        </UserContext.Provider>
    );
};
