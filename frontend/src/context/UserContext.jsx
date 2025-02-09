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
                    if (user !== null) setUser(null);
                }
            } catch (error) {
                if (error.response) {
                    if (error.response.status === 401) {
                        console.error("User is not logged in (401 Unauthorized).");
                        if (user !== null) setUser(null);
                    } else if (error.response.status === 403) {
                        console.error("User lacks permissions (403 Forbidden).");
                        if (user !== null) setUser(null);
                    } else {
                        console.error("Unexpected error fetching user:", error.response);
                    }
                } else {
                    console.error("Network error or server down:", error);
                }
            }
            finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, []);

    const getCSRFToken = () => {
        return Cookies.get("csrftoken");
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

                setTimeout(() => {
                    setUser(null);
                    window.location.href = "/logged-out";
                }, 300);
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
