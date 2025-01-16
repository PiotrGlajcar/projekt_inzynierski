import React, { createContext, useState, useEffect } from 'react';
import backend from '../api';

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
                setUser(null);
            }
            finally {
                setLoading(false); // Set loading to false after the request
            }
        };

        fetchUser();
    }, []);

    return (
        <UserContext.Provider value={{ user, setUser, loading }}>
            {children}
        </UserContext.Provider>
    );
};
