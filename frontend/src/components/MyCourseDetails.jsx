import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

function MyCourseDetails() {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [enrollmentId, setEnrollmentId] = useState(null);
    const [grades, setGrades] = useState([]);
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
        if (courseId) {
            fetch(`http://localhost:8000/courses/${courseId}`)
                .then((response) => response.json())
                .then((data) => {
                    if (data.status === "success") {
                        setSelectedCourse(data.data);
                    } else {
                        console.error("Failed to fetch course details.");
                    }
                })
                .catch((error) => console.error("Error fetching course details:", error));
        }
    }, [courseId]);

    useEffect(() => {
        if (user && courseId) {
            fetch("http://localhost:8000/enrollments")
                .then((response) => response.json())
                .then((data) => {
                    if (data.status === "success") {
                        const userEnrollment = data.data.find(
                            (enrollment) => enrollment.student_id === user.student_id && enrollment.course_id === Number(courseId)
                        );
                        if (userEnrollment) {
                            setEnrollmentId(userEnrollment.id); // Store enrollment_id
                        }
                    }
                })
                .catch((error) => console.error("Error fetching enrollments:", error));
        }
    }, [user, courseId]);

    useEffect(() => {
        if (enrollmentId) {
            fetch("http://localhost:8000/grades")
                .then((response) => response.json())
                .then((data) => {
                    if (data.status === "success") {
                        // Filter grades based on enrollment_id
                        const studentGrades = data.data.filter((grade) => grade.enrollment_id === enrollmentId);
                        setGrades(studentGrades);
                    }
                })
                .catch((error) => console.error("Error fetching grades:", error));
        }
    }, [enrollmentId]);

    if (!selectedCourse || !user) {
        return <p>Ładowanie szczegółów kursu...</p>;
    }

    return (
        <div className="course-details">
            <h2>Course Details: {selectedCourse.name}</h2>
            <h3>Course Description:</h3>
            <p>{selectedCourse.description || "No description available."}</p>
            <h3>Your Grades:</h3>
            <ul>
                {grades.length > 0 ? (
                    grades.map((grade) => (
                        <li key={grade.id}>
                            {grade.assignment_name}: {grade.score} (Assigned: {grade.date_assigned})
                        </li>
                    ))
                ) : (
                    <p>No grades available for this course.</p>
                )}
            </ul>

            <button onClick={() => navigate("/my-courses")}>Back to My Courses</button>
        </div>
    );
}

export default MyCourseDetails;
