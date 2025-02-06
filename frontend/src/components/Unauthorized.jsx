import React from "react";
import { Link } from "react-router-dom";

function Unauthorized() {

    return (
        <div className="centruj">
            <div className="container">
                <h2>Nieautoryzowany dostęp</h2>
                <Link to='/'>Wróć do strony logowania</Link>
            </div>
        </div>
    );
}

export default Unauthorized;
