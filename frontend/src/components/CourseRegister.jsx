import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

function CourseRegister() {
    const { courseName } = useParams();
    const navigate = useNavigate();
    const [courses, setCourses] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [notification, setNotification] = useState("");
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await fetch("http://localhost:5000/courses");
                if (response.ok) {
                    const data = await response.json();
                    setCourses(data);
                } else {
                    console.error("Błąd podczas pobierania listy kursów.");
                }
            } catch (error) {
                console.error("Błąd podczas pobierania kursów:", error);
            }
        };

        fetchCourses();
    }, []);

    useEffect(() => {
        fetch("http://localhost:8000/users/me", {
            credentials: "include", // Ważne dla sesji
        })
            .then((response) => response.json())
            .then((user_data) => {
                if (user_data.status === "success") {
                    setUser(user_data.data); // Ustaw dane użytkownika
                } else {
                    console.log("Failed to fetch user data");
                }
            });
    }, []);

    useEffect(() => {
        if (courseName && courses.length > 0) {
            const course = courses.find((c) => c.name === courseName);
            setSelectedCourse(course || null);
        }
    }, [courseName, courses]);

    const handleRegister = async (courseName) => {
        if (!user) {
            alert("Nie udało się pobrać danych użytkownika.");
            return;
        }

        try {
            const updatedCourses = [...courses];
            const courseIndex = updatedCourses.findIndex((c) => c.name === courseName);

            if (courseIndex !== -1) {
                const isAlreadyRegistered = updatedCourses[courseIndex].participants.some(
                    (participant) => participant.id === user.student_number
                );

                if (isAlreadyRegistered) {
                    setNotification(`Już jesteś zapisany na kurs: ${courseName}`);
                    setTimeout(() => setNotification(""), 3000);
                    return;
                }

                updatedCourses[courseIndex].participants.push({
                    name: `${user.first_name} ${user.last_name}`,
                    group: 1, // Domyślna grupa; możesz zmienić
                    id: user.student_number, // ID użytkownika
                });

                const response = await fetch(`http://localhost:5000/courses/${encodeURIComponent(courseName)}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(updatedCourses[courseIndex]),
                });

                if (response.ok) {
                    setCourses(updatedCourses);
                    setNotification(`Zarejestrowano na kurs: ${courseName}`);
                    setTimeout(() => setNotification(""), 3000);
                } else {
                    alert("Nie udało się zarejestrować na kurs.");
                }
            }
        } catch (error) {
            console.error("Błąd podczas rejestracji na kurs:", error);
        }
    };

    return (
        <div className="manage-course">
            {!courseName ? (
                <>
                    <h2>Przeglądanie kursów</h2>
                    {notification && <div className="notification">{notification}</div>}

                    <div className="course-grid">
                        {courses.map((course) => (
                            <div key={course.name} className="course-tile">
                                <h3>{course.name}</h3>
                                <button onClick={() => navigate(`/course-register/${encodeURIComponent(course.name)}`)}>
                                    Zobacz szczegóły
                                </button>
                                <button onClick={() => handleRegister(course.name)}>Zarejestruj się</button>
                            </div>
                        ))}
                    </div>
                </>
            ) : (
                <>
                    <div className="containermng">
                        <div className="course-details">
                            <h2>Szczegóły kursu: {selectedCourse?.name}</h2>

                            {notification && <div className="notification">{notification}</div>}

                            <h3>Opis kursu:</h3>
                            <p>{selectedCourse?.description || "Brak opisu kursu."}</p>

                            <button onClick={() => navigate("/course-register")}>Wróć do listy kursów</button>
                        </div>
                        <div className="participants-list">
                            <h3>Uczestnicy:</h3>
                            <ul>
                                {selectedCourse?.participants.map((participant) => (
                                    <li key={participant.id}>
                                        <span className="participant-info">
                                            {participant.name} (Grupa {participant.group})
                                        </span>
                                    </li>
                                )) || <p>Brak uczestników.</p>}
                            </ul>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

export default CourseRegister;
