import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function ManageCourse() {
    const { courseName } = useParams(); // Pobieranie nazwy kursu z URL
    const [course, setCourse] = useState(null);

    console.log("Course name from URL:", courseName); // Debug
    console.log("Params:", useParams());
    
    useEffect(() => {
        // Pobranie szczegółów kursu z serwera
        const fetchCourse = async () => {
            try {
                console.log(`Fetching course details for: ${courseName}`);
                const response = await fetch(`http://localhost:5000/courses/${encodeURIComponent(courseName)}`);
                console.log(`Response status: ${response.status}`);
                if (response.ok) {
                    const data = await response.json();
                    console.log("Fetched course data:", data);
                    setCourse(data);
                } else {
                    console.error("Błąd podczas pobierania szczegółów kursu.");
                }
            } catch (error) {
                console.error("Błąd:", error);
            }
        };

        fetchCourse();
    }, [courseName]);

    if (!course) {
        return <p>Ładowanie szczegółów kursu...</p>;
    }

    return (
        <div className="manage-course">
            <h2>Zarządzanie kursem: {course.name}</h2>
            <h3>Uczestnicy:</h3>
            <ul>
                {course.participants.map((participant, index) => (
                    <li key={index}>{participant}</li>
                ))}
            </ul>
            <h3>Oceny:</h3>
            <ul>
                {course.grades.map((grade, index) => (
                    <li key={index}>
                        {grade.student}: {grade.scores.length > 0 ? grade.scores.join(", ") : "Brak ocen"}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default ManageCourse;
