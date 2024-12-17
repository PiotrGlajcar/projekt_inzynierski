import React from "react";
import { useNavigate } from "react-router-dom";

function Home() {
    const navigate = useNavigate();
    const goToCreateCourse = () => {
        navigate("/create-course");
    };

    return (
        <div className="container">
            <h2>Witamy na stronie głównej</h2>
            <p>Wybierz co chesz zrobić:</p>
            <div className="buttons">
                <button className="button" onClick={goToCreateCourse}>Utwórz nowy kurs</button>
                <button className="button" onClick={() => navigate("/view-courses")}>Przeglądaj kursy</button>
            </div>
        </div>
    );

}
export default Home