import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { useContext } from "react";
import { UserContext } from "../context/UserContext";

function HomeStudent() {
    
    const navigate = useNavigate();
    const { user } = useContext(UserContext);

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