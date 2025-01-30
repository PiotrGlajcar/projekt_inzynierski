import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

function CourseRegister() {
    const { courseName } = useParams();
    const navigate = useNavigate();
    const [courses, setCourses] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [notification, setNotification] = useState("");
    const [user, setUser] = useState(null);

    useEffect(() => {
        fetch("http://localhost:8000/courses/")
            .then((response) => response.json())
            .then((result) => {
                if (result.status === "success") {
                    setCourses(Array.isArray(result.data) ? result.data : []);
                } else {
                    console.error("Failed to fetch courses");
                }
            })
            .catch((error) => console.error("Error fetching courses:", error));
    }, []);

    useEffect(() => {
        fetch("http://localhost:8000/users/me", { credentials: "include" })
            .then((response) => response.json())
            .then((user_data) => {
                if (user_data.status === "success") {
                    setUser(user_data.data);
                } else {
                    console.error("Failed to fetch user data");
                }
            })
            .catch((error) => console.error("Error fetching user:", error));
    }, []);

    // useEffect(() => {
    //     if (courseName && courses.length > 0) {
    //         const course = courses.find((c) => c.name === courseName);
    //         setSelectedCourse(course || null);
    //     }
    // }, [courseName, courses]);

    const handleRegister = async (courseId) => {
        if (!user) {
            alert("Nie udało się pobrać danych użytkownika.");
            return;
        }
        try {
            const response = await fetch("http://localhost:8000/enrollments/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    student_id: user.student_id, // Get student ID from logged-in user
                    course_id: courseId, // Register for selected course
                }),
            });

            if (response.ok) {
                setNotification(`Successfully registered for the course.`);
                setTimeout(() => setNotification(""), 3000);
            } else {
                const errorData = await response.json();
                setNotification(`Failed to register: ${errorData.message || "Unknown error"}`);
                setTimeout(() => setNotification(""), 3000);
            }
        } catch (error) {
            console.error("Error registering for course:", error);
        }
        // try {
        //     const updatedCourses = [...courses];
        //     const courseIndex = updatedCourses.findIndex((c) => c.name === courseName);

        //     if (courseIndex !== -1) {
        //         const isAlreadyRegistered = updatedCourses[courseIndex].participants.some(
        //             (participant) => participant.id === user.student_number
        //         );

        //         if (isAlreadyRegistered) {
        //             setNotification(`Już jesteś zapisany na kurs: ${courseName}`);
        //             setTimeout(() => setNotification(""), 3000);
        //             return;
        //         }

        //         updatedCourses[courseIndex].participants.push({
        //             name: `${user.first_name} ${user.last_name}`,
        //             id: user.student_number, // ID użytkownika
        //         });

        //         const response = await fetch(`http://localhost:5000/courses/${encodeURIComponent(courseName)}`, {
        //             method: "PUT",
        //             headers: { "Content-Type": "application/json" },
        //             body: JSON.stringify(updatedCourses[courseIndex]),
        //         });

        //         if (response.ok) {
        //             setCourses(updatedCourses);
        //             setNotification(`Zarejestrowano na kurs: ${courseName}`);
        //             setTimeout(() => setNotification(""), 3000);
        //         } else {
        //             alert("Nie udało się zarejestrować na kurs.");
        //         }
        //     }
        // } catch (error) {
        //     console.error("Błąd podczas rejestracji na kurs:", error);
        // }
    };

    return (
        <div className="manage-course">
            
                <>
                    <h2>Przeglądanie kursów</h2>
                    {notification && <div className="notification">{notification}</div>}

                    <div className="course-grid">
                        {courses.map((course) => (
                            <div key={course.id} className="course-tile">
                                <h3>{course.name}</h3>
                                <p>{course.description || "No description available."}</p> {/* Add this line */}
                                <button onClick={() => handleRegister(course.id)}>Register</button>
                            </div>
                        ))}
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
