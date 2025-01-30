import React from "react";
import { Link } from "react-router-dom";

function LoggedOut() {

    return (
        <div className="centruj">
            <div className="container">
                <h2>Pomyślnie wylogowano</h2>
                <Link to='/'>Wróć do strony logowania</Link>
            </div>
        </div>
    );
}

export default LoggedOut;
