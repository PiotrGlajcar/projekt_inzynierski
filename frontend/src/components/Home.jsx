import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../context/UserContext";

function Home() {

    const navigate = useNavigate();
    const { user } = useContext(UserContext);

    // const [error, setError] = useState(null); 

    const goToCreateCourse = () => {
        navigate("/create-course");
    };

    //if (loading) return <h2>Loading...</h2>;
    //if (error) return <h2>{error}</h2>;

    return (
        <div className="centruj">
            <div className="container">
                <h2>Witamy na stronie głównej {user ? user.first_name : ""}</h2>
                <p>Wybierz co chesz zrobić:</p>
                <div className="buttons">
                    <button className="button" onClick={goToCreateCourse}>Utwórz nowy kurs</button>
                    <button className="button" onClick={() => navigate("/manage-course")}>Przeglądaj kursy</button>
                </div>
            </div>
        </div>
    );
}
export default Home