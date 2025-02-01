import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../context/UserContext";

function MyCourses() {
    const navigate = useNavigate();
    const [courses, setCourses] = useState([]);
    const [myCourses, setMyCourses] = useState([]);
    const [enrollments, setEnrollments] = useState([]);
    const { user } = useContext(UserContext);

    useEffect(() => {
        if (user ) {
            fetch("http://localhost:8000/enrollments")
                .then((response) => response.json())
                .then((data) => {
                    if (data.status === "success") {
                        // Filter enrollments for the current student
                        const studentEnrollments = data.data.filter(
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

    // useEffect(() => {
    //     if (user && user.student_number) {
    //         const filteredCourses = courses.filter((course) =>
    //             course.participants.some((participant) => participant.id === user.student_number)
    //         );
    //         setMyCourses(filteredCourses);
    //     }
    // }, [user, courses]);

    return (
        <div className="my-courses">
            <h2>Moje kursy</h2>
            {user && <h3>ID studenta: {user.student_number}</h3>}

            <div className="course-grid">
                {enrollments.length > 0 ? (
                    enrollments.map((enrollment) => (
                        <div key={enrollment.id} className="course-tile">
                            <h3>{enrollment.course_name}</h3>
                            <button
                                onClick={() =>
                                    navigate(`/my-course/${encodeURIComponent(enrollment.course_id)}`)
                                }
                            >
                                Szczegóły
                            </button>
                        </div>
                        
                    ))
                ) : (
                    <p>Nie jesteś jeszcze zarejestrowany na żadne kursy.</p>
                )}
            </div>
            <Link to='/home-student'>⇦ Powrót</Link>
        </div>
    );
}

export default MyCourses;
