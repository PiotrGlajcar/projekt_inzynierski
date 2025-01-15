import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function ViewCourses() {
    const [courses, setCourses] = useState([]);
    const [confirmDelete, setConfirmDelete] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        try {
            const response = await fetch("http://localhost:5000/courses");
            if (response.ok) {
                const data = await response.json();
                setCourses(data);
            } else {
                alert("Nie udało się pobrać listy kursów.");
            }
        } catch (error) {
            console.error("Błąd podczas pobierania kursów:", error);
        }
    };

    const handleDeleteCourse = async (courseName) => {
        try {
            const response = await fetch(`http://localhost:5000/courses/${encodeURIComponent(courseName)}`, {
                method: "DELETE",
            });
            if (response.ok) {
                alert(`Kurs '${courseName}' został pomyślnie usunięty.`);
                fetchCourses();
            } else {
                alert("Nie udało się usunąć kursu.");
            }
        } catch (error) {
            console.error("Błąd podczas usuwania kursu:", error);
        } finally {
            setConfirmDelete(null);
        }
    };

    return (
        <div className="view-courses">
            <h2>Przeglądanie kursów</h2>
            <ul>
                {courses.map((course) => (
                    <li key={course.name} className="course-item">
                        <div>
                            <strong>{course.name}</strong>
                            ‎ ‎
                            <button
                                className="details-button"
                                onClick={() => navigate(`/manage-course/${encodeURIComponent(course.name)}`)}
                            >
                                Zobacz szczegóły
                            </button>
                            ‎ ‎
                            <button
                                className="delete-button"
                                onClick={() => setConfirmDelete(course.name)}
                            >
                                Usuń
                            </button>
                        </div>
                    </li>
                ))}
            </ul>

            {/* Przycisk powrotu */}
            <button className="back-button" onClick={() => navigate("/home")}>
                Wróć do strony głównej
            </button>

            {/* Okienko potwierdzenia usunięcia */}
            {confirmDelete && (
                <div className="confirmation-dialog">
                    <p>Czy na pewno chcesz usunąć kurs '{confirmDelete}'?</p>
                    <button onClick={() => handleDeleteCourse(confirmDelete)}>Tak</button>
                    <button onClick={() => setConfirmDelete(null)}>Nie</button>
                </div>
            )}
        </div>
    );
}

export default ViewCourses;
