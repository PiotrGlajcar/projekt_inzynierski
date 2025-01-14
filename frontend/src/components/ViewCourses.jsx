import React, { useEffect, useState } from "react";
import CourseDetails from "./CourseDetails";
import { useNavigate } from "react-router-dom";

function ViewCourses() {
    const [courses, setCourses] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState(null);
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
                alert("Failed to fetch courses.");
            }
        } catch (error) {
            console.error("Error fetching courses:", error);
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
            console.error("Error deleting course:", error);
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
                            <strong>{course.name} ‎ ‎</strong>
                            <button
                                className="details-button"
                                onClick={() => setSelectedCourse(course)}
                            >
                                Zobacz szczegóły
                            </button>
                            ‎ ‎ ‎ ‎ {/* spacje :D */}
                            <button
                                className="delete-button"
                                onClick={() => setConfirmDelete(course.name)}
                            >
                                Usuń
                            </button>
                        </div>
                    </li>
                ))}
                <button className="back-button" onClick={() => navigate("/home")}>
                Wróć do strony głównej
                </button>
            </ul>

            {/* Okienko szczegółów */}
            {selectedCourse && (
                <CourseDetails
                    course={selectedCourse}
                    onBack={() => setSelectedCourse(null)}
                />
            )}

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
