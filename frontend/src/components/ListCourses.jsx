import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const ListCourses = () => {
    const navigate = useNavigate();
    const [courses, setCourses] = useState([]);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await fetch("http://localhost:8000/courses/");
                if (response.ok) {
                    const result = await response.json();
                    setCourses(Array.isArray(result.data) ? result.data : []);
                } else {
                    console.error(response.messages);
                }
            } catch (error) {
                console.error("Error fetching courses:", error);
            }
        };

        fetchCourses();
    }, []);

    const handleDeleteCourse = async (id) => {
        const isConfirmed = window.confirm(`Are you sure you want to delete this course?`);
        if (!isConfirmed) return;

        try {
            const response = await fetch(`http://localhost:8000/courses/${id}`, {
                method: "DELETE",
            });

            if (response.ok) {
                setCourses(courses.filter((course) => course.id !== id));
                alert("Course deleted successfully.");
            } else {
                alert("Failed to delete the course.");
            }
        } catch (error) {
            console.error("Error deleting course:", error);
        }
    };

    return (
        <div className="course-list">
            <h2>Zarządzanie kursami</h2>
            <div className="course-grid">
                {courses.length > 0 ? (
                    courses.map((course) => (
                        <div key={course.id} className="course-tile">
                            <h3>{course.name}</h3>
                            <button
                                onClick={() => navigate(`/manage-course/${course.id}`)}
                            >
                                Szczegóły
                            </button>
                            <button onClick={() => handleDeleteCourse(course.id)}>
                                Usuń
                            </button>
                        </div>
                    ))
                ) : (
                    <p>Brak dostępnych kursów.</p>
                )}
            </div>
            <div className="centruj"><Link to="/home-staff" >⇦ Wróć</Link></div>
        </div>
    );
};

export default ListCourses;
