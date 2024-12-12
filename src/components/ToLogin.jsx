import React from "react";
import { useNavigate } from "react-router-dom";

const ToLogin = () => {
    const navigate = useNavigate();

    const handleLoginAsLecturer = () => {
        navigate("/home");
    };

    const handleLoginAsParticipant = () => {
        navigate("/home-student");
    };

    return (
        <div className="container">
            <h1>Wybierz sposób logowania</h1>
            <div className="buttons">
                <button onClick={handleLoginAsLecturer} className="button">
                    Logowanie jako Prowadzący
                </button>
                <button onClick={handleLoginAsParticipant} className="button">
                    Logowanie jako Uczestnik
                </button>
            </div>
            <p></p>
        </div>
    );
};

export default ToLogin;