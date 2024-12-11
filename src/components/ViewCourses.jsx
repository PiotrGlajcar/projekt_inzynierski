import React, { useEffect, useState } from "react";

function ViewCourses() {
    const [courses, setCourses] = useState([]);
    const [confirmDelete, setConfirmDelete] = useState(null); // Przechowuje kurs do potwierdzenia usunięcia

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
                alert(`Course '${courseName}' deleted successfully.`);
                fetchCourses(); // Odśwież listę kursów
            } else {
                const errorData = await response.json();
                console.error("Delete error:", errorData);
                alert(`Failed to delete course: ${errorData.error}`);
            }
        } catch (error) {
            console.error("Error deleting course:", error);
            alert("An error occurred while deleting the course.");
        }
    };

    return (
        <div>
            <h2>View Courses</h2>
            <ul>
                {courses.map((course, index) => (
                    <li key={index}>
                        <strong>{course.name}</strong> - Participants: {course.participants.join(", ")}
                        <button onClick={() => setConfirmDelete(course.name)}>Delete</button>
                    </li>
                ))}
            </ul>

            {/* Okienko potwierdzenia */}
            {confirmDelete && (
                <div style={{ border: "1px solid black", padding: "1em", marginTop: "1em" }}>
                    <p>Are you sure you want to delete the course '{confirmDelete}'?</p>
                    <button onClick={() => handleDeleteCourse(confirmDelete)}>Yes</button>
                    <button onClick={() => setConfirmDelete(null)}>No</button>
                </div>
            )}
        </div>
    );
}

export default ViewCourses;
