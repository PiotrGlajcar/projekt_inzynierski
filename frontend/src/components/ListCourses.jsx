import React, { useEffect, useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import backend from "../api";
import { getCSRFToken } from "../api";
import { UserContext } from "../context/UserContext";
import ConfirmationModal from "./ConfirmationModal";

const ListCourses = () => {
    const navigate = useNavigate();
    const [courses, setCourses] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [courseToDelete, setCourseToDelete] = useState(null);

    const { user } = useContext(UserContext);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await backend.get("/courses/");
    
                const allCourses = Array.isArray(response.data.data) ? response.data.data : [];
                
                const teacherCourses = allCourses.filter(course => course.teacher === user?.teacher_id);
    
                setCourses(teacherCourses);
            } catch (error) {
                console.error("Error fetching courses:", error);
            }
        };
    
        fetchCourses();
    }, [user]);   

    const handleDeleteCourse = async (id) => {
        // Open the modal and store the course ID
        setCourseToDelete(id);
        setIsModalOpen(true);
    };
    
    const confirmDelete = async () => {
        if (!courseToDelete) return;
    
        try {
        const response = await backend.delete(`/courses/${courseToDelete}/`);
    
        if (response.status === 204) {
            setCourses(courses.filter((course) => course.id !== courseToDelete));
            alert("Kurs został pomyślnie usunięty.");
        } else {
            alert("Nie udało się usunąć kursu.");
        }
        } catch (error) {
        console.error("Error deleting course:", error);
        } finally {
        // Close the modal and reset the course ID
        setIsModalOpen(false);
        setCourseToDelete(null);
        }
    };

    const cancelDelete = () => {
        // Close the modal and reset the course ID
        setIsModalOpen(false);
        setCourseToDelete(null);
      };
    

    return (
        <div className="course-list">
            <h2>Zarządzanie kursami</h2>
            <div className="course-grid">
                {courses.length > 0 ? (
                    courses.map((course) => (
                        <div key={course.id} className="course-tile">
                            <h3>{course.name}</h3>
                            <button
                                onClick={() => navigate(`/manage-course/${course.id}`)}
                            >
                                Szczegóły
                            </button>
                            <button onClick={() => handleDeleteCourse(course.id)}>
                                Usuń
                            </button>
                        </div>
                    ))
                ) : (
                    <p>Brak dostępnych kursów.</p>
                )}
            </div>
            <div className="centruj"><Link to="/home-staff" >⇦ Wróć</Link></div>
            {/* Custom Confirmation Modal */}
            <ConfirmationModal
                isOpen={isModalOpen}
                onConfirm={confirmDelete}
                onCancel={cancelDelete}
                message="Czy na pewno chcesz usunąć ten kurs?"
            />
        </div>
    );
};

export default ListCourses;
