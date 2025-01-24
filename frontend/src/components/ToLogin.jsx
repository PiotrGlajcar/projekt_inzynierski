import React from "react";
import { useNavigate } from "react-router-dom";
import backend from "../api";

const ToLogin = () => {
    const navigate = useNavigate();

    const handleLoginAsLecturer = () => {
        navigate("/home-staff");
        {/*window.location.href = "http://localhost:8000/oauth/start/";*/}
    };

    const handleLoginAsParticipant = async () => {
        window.location.href = "http://localhost:8000/oauth/start/";
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