import React from "react";
import { Link } from "react-router-dom";

function Unauthorized() {

    return (
        <div className="container">
            <h2>Nie autoryzowany dostęp</h2>
            <Link to='/'>Wróć do strony logowania</Link>
        </div>
    );
}

export default Unauthorized;
