import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

function MyCourseDetails() {
    const { courseName } = useParams();
    const navigate = useNavigate();
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [user, setUser] = useState(null);
    

    // Pobieranie danych użytkownika
    useEffect(() => {
        fetch("http://localhost:8000/users/me", {
            credentials: "include",
        })
            .then((response) => response.json())
            .then((user_data) => {
                if (user_data.status === "success") {
                    setUser(user_data.data);
                } else {
                    console.log("Failed to fetch user data");
                }
            });
    }, []);

    // Pobieranie danych kursu
    useEffect(() => {
        const fetchCourse = async () => {
            try {
                const response = await fetch("http://localhost:5000/courses");
                if (response.ok) {
                    const data = await response.json();
                    const course = data.find((c) => c.name === courseName);
                    setSelectedCourse(course || null);
                } else {
                    console.error("Błąd podczas pobierania kursów.");
                }
            } catch (error) {
                console.error("Błąd podczas pobierania kursu:", error);
            }
        };

        fetchCourse();
    }, [courseName]);

    if (!selectedCourse || !user) {
        return <p>Ładowanie szczegółów kursu...</p>;
    }

    // Pobieranie ocen studenta
    const studentGrades = selectedCourse.grades.find(
        (grade) => grade.studentId === user.student_number
    );

    return (
        <div className="course-details">
            <h2>Szczegóły kursu: {selectedCourse.name}</h2>
            <h3>Opis kursu:</h3>
            <p>{selectedCourse.description || "Brak opisu."}</p>

            <h3>Twoje oceny:</h3>
            <ul>
                {selectedCourse?.requiredElements.map((element) => {
                    const score = studentGrades?.scores.find((s) => s.name === element.name);

                    return (
                        <li key={element.name}>
                            {element.name}:{" "}
                            {score ? (
                                `${score.value} (Waga: ${score.weight}%)`
                            ) : (
                                <span style={{ color: "red" }}>Brak oceny</span>
                            )}
                        </li>
                    );
                })}
            </ul>

            <button onClick={() => navigate("/my-courses")}>Wróć do moich kursów</button>
        </div>
    );
}

export default MyCourseDetails;
