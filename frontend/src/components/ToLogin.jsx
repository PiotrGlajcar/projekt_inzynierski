import React from "react";
import { useNavigate } from "react-router-dom";

const ToLogin = () => {
    const navigate = useNavigate();

    const handleLogin = async () => {
        window.location.href = `${import.meta.env.VITE_API_ENDPOINT}/oauth/start/`;
    };

    return (
        <div className="centruj">
            <div className="container">
                <h1>Zaloguj się aby kontynuować</h1>
                <div className="buttons">
                    <button onClick={handleLogin} className="button">
                        Logowanie
                    </button>
                    {/*}
                    <button onClick={handleLoginAsParticipant} className="button">
                        Logowanie jako Uczestnik
                    </button>*/}
                </div>
                <p>Korzystanie z aplikacji wymaga konta w systemie USOS</p>
            </div>
        </div>
    );
};

export default ToLogin;