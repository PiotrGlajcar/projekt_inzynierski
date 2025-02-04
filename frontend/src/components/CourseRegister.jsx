import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../context/UserContext";
import backend from "../api";
import { getCSRFToken } from "../api";

function CourseRegister() {
    const { courseName } = useParams();
    const navigate = useNavigate();
    const [courses, setCourses] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [notification, setNotification] = useState("");
    const [enrollments, setEnrollments] = useState([]);
    const { user } = useContext(UserContext);

    useEffect(() => {
        backend.get("/courses/")
            .then((response) => {
                if (response.data.status === "success") {
                    setCourses(Array.isArray(response.data.data) ? response.data.data : []);
                } else {
                    console.error("Failed to fetch courses");
                }
            })
            .catch((error) => console.error("Error fetching courses:", error));
    }, []);    

    useEffect(() => {
        if (user) {
            backend.get("/enrollments/")
                .then((response) => {
                    if (response.data.status === "success") {

                        // Filter enrollments only for the logged-in user
                        const studentEnrollments = response.data.data.filter(
                            (enrollment) => enrollment.student_id === user.student_id
                        );
                        setEnrollments(studentEnrollments);
                    } else {
                        console.error("Failed to fetch enrollments");
                    }
                })
                .catch((error) => console.error("Error fetching enrollments:", error));
        }
    }, [user]);

    const handleRegister = async (courseId) => {
        if (!user) {
            alert("Nie udało się pobrać danych użytkownika.");
            return;
        }
    
        const isAlreadyEnrolled = enrollments.some(enrollment => enrollment.course_id === courseId);
        if (isAlreadyEnrolled) {
            alert("Jesteś już zapisany na ten kurs.");
            return;
        }
    
        try {
            const response = await backend.post(
                "/enrollments/",
                {
                    student_id: user.student_id,
                    course_id: courseId,
                },
                {
                    headers: {
                        "X-CSRFToken": getCSRFToken(),
                    },
                }
            );
    
            if (response.status === 201) {
                setNotification("Successfully registered for the course.");
                
                setEnrollments([...enrollments, { student_id: user.student_id, course_id: courseId }]); 
                
                setCourses((prevCourses) => 
                    prevCourses.map((course) =>
                        course.id === courseId
                            ? { ...course, is_registered: true }
                            : course
                    )
                );
    
                setTimeout(() => setNotification(""), 3000);
            } else {
                setNotification("Failed to register: Unexpected response.");
            }
        } catch (error) {
            console.error("Error registering for course:", error);
    
            if (error.response) {
                setNotification(`Failed to register: ${error.response.data.message || "Unknown error"}`);
            } else {
                setNotification("Failed to register: Server error.");
            }
        }
    
        setTimeout(() => setNotification(""), 3000);
    };

    return (
        <div className="manage-course">
            
                <>
                    <h2>Przeglądanie kursów</h2>
                    {notification && <div className="notification">{notification}</div>}

                    <div className="course-grid">
                        {courses.map((course) => {
                            const isEnrolled = enrollments.some(enrollment => enrollment.course_id === course.id);
                            
                            return (
                                <div key={course.id} className="course-tile">
                                    <h3>{course.name}</h3>
                                    {/*<p>{course.description || "No description available."}</p>*/}

                                    {isEnrolled ? (
                                        <p className="registered-text">✔️ Zarejestrowano</p>
                                    ) : (
                                        <button onClick={() => handleRegister(course.id)}>Zarejestruj się</button>
                                    )}
                                </div>
                            );
                        })}

                    </div>
                    
                    <Link to='/home-student'>⇦ Powrót</Link>
                </>
              {/*: (
                <>
                    <div className="containermng">
                        <div className="course-details">
                            <h2>Szczegóły kursu: {selectedCourse?.name}</h2>

                            {notification && <div className="notification">{notification}</div>}

                            <h3>Opis kursu:</h3>
                            <p>{selectedCourse?.description || "Brak opisu kursu."}</p>
                            <p>ID prowadzącego: {user.id}</p>
                            <button onClick={() => handleRegister(selectedCourse?.name)}>Zarejestruj się</button>
                            <br></br>
                            <button onClick={() => navigate("/course-register")}>Wróć do listy kursów</button>
                        </div>
                        <div className="participants-list">
                            <h3>Uczestnicy:</h3>
                            <ul>
                                {selectedCourse?.participants.map((participant) => (
                                    <li key={participant.id}>
                                        <span className="participant-info">
                                            {participant.name}
                                        </span>
                                    </li>
                                )) || <p>Brak uczestników.</p>}
                            </ul>
                        </div>
                    </div>
                </>
            ) */}
        </div>
    );
}

export default CourseRegister;
