import { React, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

function LoggedOut() {

    const navigate = useNavigate();

    useEffect(() => {
        const timer = setTimeout(() => {
            navigate("/");
        }, 3000);

        return () => {
            clearTimeout(timer);
        };
    }, [navigate]);

    return (
        <div className="centruj">
            <div className="container">
                <h2>Pomyślnie wylogowano</h2>
                <p>Za chwilę zostaniesz przekierowany...</p>
            </div>
        </div>
    );
}

export default LoggedOut;
