import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Home() {
    const navigate = useNavigate();

    const [data, setUser] = useState(true);
    // const [error, setError] = useState(null); 

    useEffect(() => {
        fetch('http://localhost:8000/users/me', {
            credentials: 'include'  // Important for session cookies
        })
        .then(response => response.json())
        .then(user_data => {
            if (user_data.status === 'success') {
                console.log("User role:", user_data.data.role);
                setUser(user_data.data);  // Save user data
            } else {
                console.log("Failed to fetch user data");
            }
        });
    }, []);
    

    const goToCreateCourse = () => {
        navigate("/create-course");
    };

    //if (loading) return <h2>Loading...</h2>;
    //if (error) return <h2>{error}</h2>;

    return (
        <div className="container">
            <h2>Witamy na stronie głównej {data.first_name}</h2>
            <p>Wybierz co chesz zrobić:</p>
            <div className="buttons">
                <button className="button" onClick={goToCreateCourse}>Utwórz nowy kurs</button>
                <button className="button" onClick={() => navigate("/manage-course")}>Przeglądaj kursy</button>
            </div>
        </div>
    );
}
export default Home