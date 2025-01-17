import React from "react";
import { useNavigate } from "react-router-dom";

function HomeStudent() {
    /*
    const navigate = useNavigate();
    const goToCreateCourse = () => {
        navigate("/create-course");
    };
    */
    return (
        <div>
            <h2>Witaj Studencie</h2>
            <p>Przeglądaj swoje kursy i postępy w jednym miejscu!</p>
            {/*
            <button onClick={goToCreateCourse}>Create a Course</button>
            <button onClick={() => navigate("/view-courses")}>View Courses</button>
            */}
        </div>
    );

}
export default HomeStudent