import React from "react";
import { useNavigate } from "react-router-dom";

function Home() {
    const navigate = useNavigate();
    const goToCreateCourse = () => {
        navigate("/create-course");
    };

    return (
    <div>
            <h2>Welcome to the Home Page</h2>
            <p>This is the main landing page of our website. Here you can find the latest updates and news.</p>
            <button onClick={goToCreateCourse}>Create a Course</button>
            <button onClick={() => navigate("/view-courses")}>View Courses</button>

        </div>
    );

}
export default Home