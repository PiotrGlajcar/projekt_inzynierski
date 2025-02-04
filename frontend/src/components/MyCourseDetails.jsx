import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import backend from "../api";

function MyCourseDetails() {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [enrollmentId, setEnrollmentId] = useState(null);
    const [grades, setGrades] = useState([]);    
    const { user } = useContext(UserContext);

    // Fetch course details along with assignments and students
    useEffect(() => {
        if (!courseId) return;
    
        const fetchCourse = async () => {
            try {
                const response = await backend.get(`/courses/${courseId}/?include=assignments&include=students`);
                
                if (response.data.status === "success") {
                    setSelectedCourse(response.data.data);
                } else {
                    console.error("Failed to fetch course details.");
                }
            } catch (error) {
                console.error("Error fetching course details:", error);
            }
        };
    
        fetchCourse();
    }, [courseId]);

    // Fetch enrollment
    useEffect(() => {
        if (!user || !courseId) return;
    
        const fetchEnrollments = async () => {
            try {
                const { data } = await backend.get("/enrollments");
    
                if (data.status === "success") {
                    const userEnrollment = data.data.find(
                        (enrollment) => enrollment.student_id === user.student_id && enrollment.course_id === Number(courseId)
                    );
    
                    if (userEnrollment) {
                        setEnrollmentId(userEnrollment.id);
                    }
                }
            } catch (error) {
                console.error("Error fetching enrollments:", error);
            }
        };
    
        fetchEnrollments();
    }, [user, courseId]);    

    // Fetch grades
    useEffect(() => {
        if (!enrollmentId) return;
    
        const fetchGrades = async () => {
            try {
                const { data } = await backend.get("/grades");
    
                if (data.status === "success") {
                    const studentGrades = data.data.filter((grade) => grade.enrollment_id === enrollmentId);
                    setGrades(studentGrades);
                }
            } catch (error) {
                console.error("Error fetching grades:", error);
            }
        };
    
        fetchGrades();
    }, [enrollmentId]);    

    if (!selectedCourse || !user) {
        return <p>Ładowanie szczegółów kursu...</p>;
    }

    return (
        <div className="centruj">
            <div className="course-details">
                <h2>Szczegóły kursu: {selectedCourse.name}</h2>
                <h3>Opis kursu:</h3>
                <p>{selectedCourse.description || "Brak opisu."}</p>

                <h3>Twoje oceny:</h3>
                <ul>
                    {selectedCourse.assignments && selectedCourse.assignments.length > 0 ? (
                        selectedCourse.assignments.map((assignment) => {
                            const grade = grades.find(g => g.assignment_id === assignment.id);
                            return (
                                <li key={assignment.id}>
                                    <strong>{assignment.name}:</strong>{" "}
                                    {grade ? (
                                        `${grade.score} (Waga: ${assignment.weight}%)`
                                    ) : (
                                        <span style={{ color: "red" }}>Brak oceny</span>
                                    )}
                                </li>
                            );
                        })
                    ) : (
                        <p>Brak wymagań do zaliczenia kursu.</p>
                    )}
                </ul>

                <button onClick={() => navigate("/my-courses")}>Wróć do moich kursów</button>
            </div>
        </div>
    );
}

export default MyCourseDetails;
