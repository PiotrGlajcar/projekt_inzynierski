import { React, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

function LoggedOut() {

    const navigate = useNavigate();

    useEffect(() => {
        console.log("Redirecting in 3 seconds...");
        const timer = setTimeout(() => {
            console.log("Redirecting now...");
            navigate("/");
        }, 3000);

        return () => {
            console.log("Clearing timeout...");
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
