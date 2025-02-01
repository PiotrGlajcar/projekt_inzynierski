import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../context/UserContext";
import backend from "../api";

function MyCourses() {
    const navigate = useNavigate();
    const [courses, setCourses] = useState([]);
    const [myCourses, setMyCourses] = useState([]);
    const [enrollments, setEnrollments] = useState([]);
    const { user } = useContext(UserContext);

    useEffect(() => {
        if (!user) return;
    
        const fetchEnrollments = async () => {
            try {
                const { data } = await backend.get("/enrollments");
    
                if (data.status === "success") {
                    const studentEnrollments = data.data.filter(
                        (enrollment) => enrollment.student_id === user.student_id
                    );
                    setEnrollments(studentEnrollments);
                } else {
                    console.error("Failed to fetch enrollments");
                }
            } catch (error) {
                console.error("Error fetching enrollments:", error);
            }
        };
    
        fetchEnrollments();
    }, [user]);

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
