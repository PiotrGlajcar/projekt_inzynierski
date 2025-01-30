import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";

function HomeStudent() {
    
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
            fetch('http://localhost:8000/users/me', {
                credentials: 'include'  // Important for session cookies
            })
            .then(response => response.json())
            .then(user_data => {
                if (user_data.status === 'success') {
                    console.log("User role:", user_data.data.role);
                    setUser(user_data.data);  // Save user data
                } else {
                    console.log("Failed to fetch user data");
                }
            });
        }, []);

    const goToRegister = () => {
        navigate("/course-register");
    };    
        
    return (
        <div className="centruj">
            <div className="container">
                {user ? (
                    <>
                    <h1>Witaj, {user.first_name} {user.last_name}!</h1>
                    <div className="buttons">
                        <button className="button" onClick={goToRegister}>Zarejestruj się na nowy kurs</button>
                        <button className="button" onClick={() => navigate("/my-courses")}>Przeglądaj swoje kursy</button>
                    </div>
                    <p>email: {user.email}<br></br>nr albumu: {user.student_number}</p>
                    </>
                ) : (
                    <p>Loading user data...</p>
                )}
            </div>
        </div>
    );
}
export default HomeStudent