import React from "react";
import { Link } from "react-router-dom";
function Header(){

    return(
        <header>
            <h1>Strona</h1>
            <nav>
                <ul>
                    <li><Link to='/'>Home</Link></li>
                    <li><Link to='/about'>About</Link></li>
                    <li><a href="#">Services</a></li>
                    <li><Link to='/contact'>Contact</Link></li>
                </ul>
            </nav>
        </header>

    );
}

export default Header