import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function MyCourses() {
    const navigate = useNavigate();
    const [courses, setCourses] = useState([]);
    const [myCourses, setMyCourses] = useState([]);
    const [user, setUser] = useState(null);

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

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await fetch("http://localhost:5000/courses");
                if (response.ok) {
                    const data = await response.json();
                    setCourses(data);
                } else {
                    console.error("Błąd podczas pobierania listy kursów.");
                }
            } catch (error) {
                console.error("Błąd podczas pobierania kursów:", error);
            }
        };

        fetchCourses();
    }, []);

    useEffect(() => {
        if (user && user.student_number) {
            const filteredCourses = courses.filter((course) =>
                course.participants.some((participant) => participant.id === user.student_number)
            );
            setMyCourses(filteredCourses);
        }
    }, [user, courses]);

    return (
        <div className="my-courses">
            <h2>Moje kursy</h2>
            <h3>id studenta: {user?.student_number}</h3>

            <div className="course-grid">
                {myCourses.length > 0 ? (
                    myCourses.map((course) => (
                        <div key={course.name} className="course-tile">
                            <h3>{course.name}</h3>
                            <button onClick={() => navigate(`/my-course/${encodeURIComponent(course.name)}`)}>
                                Zobacz szczegóły
                            </button>
                        </div>
                    ))
                ) : (
                    <p>Nie jesteś zapisany na żadne kursy.</p>
                )}
            </div>
        </div>
    );
}

export default MyCourses;
