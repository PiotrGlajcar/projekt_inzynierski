import React, { useContext } from "react";
import { Link, useNavigate, } from "react-router-dom";
import { UserContext } from "../context/UserContext";

function Header(){

    const { logoutUser } = useContext(UserContext);
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logoutUser();
    };

    return(
        <header>
            <h1>Strona</h1>
            <nav>
                <ul>
                    <li><Link to='/'>Home</Link></li>
                    <li><Link to='/about'>O nas</Link></li>
                    <li><Link to='/contact'>Kontakt</Link></li>
                    <li><button onClick={handleLogout} className="logout-button">Wyloguj</button></li>
                </ul>
            </nav>
        </header>

    );
}

export default Header