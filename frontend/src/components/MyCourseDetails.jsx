import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../context/UserContext";
import backend from "../api";

function MyCourseDetails() {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [enrollmentId, setEnrollmentId] = useState(null);
    const [grades, setGrades] = useState([]);    
    const { user } = useContext(UserContext);

    useEffect(() => {
        if (!courseId) return;
    
        const fetchCourse = async () => {
            try {
                const { data } = await backend.get(`/courses/${courseId}`);
    
                if (data.status === "success") {
                    setSelectedCourse(data.data);
                } else {
                    console.error("Failed to fetch course details.");
                }
            } catch (error) {
                console.error("Error fetching course details:", error);
            }
        };
    
        fetchCourse();
    }, [courseId]);    

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

    useEffect(() => {
        if (!enrollmentId) return;
    
        const fetchGrades = async () => {
            try {
                const { data } = await backend.get("/grades");
    
                if (data.status === "success") {
                    // Filter grades based on enrollment_id
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
                        {grades.length > 0 ? (
                            grades.map((grade) => (
                                <li key={grade.id}>
                                    <strong>{grade.assignment_name}:</strong> {grade.score}
                                    <p>(Dodano: {grade.date_assigned})</p>
                                </li>
                            ))
                        ) : (
                            <p>Na razie nie posiadasz ocen z tego kursu.</p>
                        )}
                    </ul>

                    <button onClick={() => navigate("/my-courses")}>Powrót</button>
                </div>
        </div>
    );
}

export default MyCourseDetails;
