import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
function ManageCourse() {
    const { courseId } = useParams();
    const navigate = useNavigate();

    const [selectedCourse, setSelectedCourse] = useState(null);
    const [selectedElement, setSelectedElement] = useState("");
    const [newGrade, setNewGrade] = useState("");
    const [editingStudent, setEditingStudent] = useState(null);
    const [editingScores, setEditingScores] = useState([]);
    const [notification, setNotification] = useState("");
    const [editingDescription, setEditingDescription] = useState(false);
    const [updatedDescription, setUpdatedDescription] = useState("");
    const editFormRef = useRef(null);
    const [newElement, setNewElement] = useState("");
    const [editingEnrollmentId, setEditingEnrollmentId] = useState(null);


    useEffect(() => {
        const fetchCourse = async () => {
            try {
                const response = await fetch(
                    `http://localhost:8000/courses/${courseId}?include=assignments&include=students`
                );
                if (response.ok) {
                    const result = await response.json();
                    setSelectedCourse(result.data);
                } else {
                    console.error(selectedCourse.message);
                }
            } catch (error) {
                console.error("Error fetching course details:", error);
            }
        };
    
        if (courseId) {
            fetchCourse();
        }
    }, [courseId]);

    const handleUpdateDescription = async () => {

        if (!updatedDescription.trim()) {
            alert("Opis nie może być pusty.");
            return;
        }

        try {
            const response = await fetch(`http://localhost:8000/courses/${courseId}/`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ description: updatedDescription }),
            });

            if (response.ok) {
                const updatedCourse = await response.json();
                setSelectedCourse((prev) => ({
                    ...prev,
                    description: updatedCourse.data.description,
                }));
                setEditingDescription(false);
                setNotification(updatedCourse.message);
                setTimeout(() => setNotification(""), 3000);
            } else {
                alert(selectedCourse.message);
            }
        } 
        catch (error) {
            console.error("Błąd podczas aktualizacji opisu:", error);
        }
    };

    const handleRemoveParticipant = async (studentId) => {
        try {
            const response = await fetch(
                `http://localhost:8000/enrollments/detail/?student_id=${studentId}&course_id=${courseId}`,
                { method: "DELETE" }
            );
    
            if (response.ok) {
                setSelectedCourse((prev) => ({
                    ...prev,
                    students: prev.students.filter((student) => student.id !== studentId),
                }));
                setNotification("Uczestnik został usunięty z kursu.");
                setTimeout(() => setNotification(""), 3000);
            } else {
                alert("Nie udało się usunąć uczestnika.");
            }
        } catch (error) {
            console.error("Błąd podczas usuwania uczestnika:", error);
        }
    };
    
    const handleEditScores = async (studentId) => {
        const student = selectedCourse.students.find((s) => s.id === studentId);
        const studentGrades = student ? student.grades : [];
        setEditingStudent(studentId);
        setEditingScores([...studentGrades]);

        // Fetch enrollment_id dynamically
        try {
            const response = await fetch(
                `http://localhost:8000/enrollments/detail/?student_id=${studentId}&course_id=${courseId}`
            );

            if (response.ok) {
                const result = await response.json();
                setEditingEnrollmentId(result.data?.id);
            } else {
                console.error("Failed to fetch enrollment ID.");
            }
        } catch (error) {
            console.error("Error fetching enrollment ID:", error);
        }

        if (editFormRef.current) {
            editFormRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    };

    const handleAddScore = () => {
        if (!newGrade || !selectedElement) return;
    
        if (selectedElement === "other") {
            const newScore = {
                id: null,
                assignment_id: null,
                assignment_name: "Inne",
                score: parseFloat(newGrade),
                weight: 0,
            };
    
            setEditingScores([...editingScores, newScore]);
            setNewGrade("");
            return;
        }
    
        const assignment = selectedCourse.assignments.find((a) => a.id === parseInt(selectedElement));
    
        if (!assignment) {
            console.error("Assignment not found.");
            return;
        }
    
        const newScore = {
            id: null,
            assignment_id: assignment.id,
            assignment_name: assignment.name,
            score: parseFloat(newGrade),
            weight: assignment.weight,
        };
    
        const existingIndex = editingScores.findIndex(
            (score) => score.assignment_id === newScore.assignment_id
        );
    
        if (existingIndex !== -1) {
            const updatedScores = [...editingScores];
            updatedScores[existingIndex] = {
                ...updatedScores[existingIndex],
                score: newScore.score,
            };
            setEditingScores(updatedScores);
        } else {
            setEditingScores([...editingScores, newScore]);
        }
    
        setNewGrade("");
    };    

    const handleSaveScores = async () => {
        try {
            for (const score of editingScores) {
                console.log("Updating grade with ID:", score.grade_id, "Score:", score.score);

                if (score.grade_id) {
                    // Update existing grade
                    const response = await fetch(`http://localhost:8000/grades/${score.grade_id}/`, {
                        method: "PUT",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ score: score.score }),
                    });
    
                    if (!response.ok) {
                        throw new Error(`Failed to update grade with ID: ${score.grade_id}`);
                    }
                } else {
                    // Add new grade
                    if (!editingEnrollmentId) {
                        throw new Error("Enrollment ID is missing.");
                    }
                    const response = await fetch(`http://localhost:8000/grades/`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            enrollment_id: editingEnrollmentId,
                            assignment_id: score.assignment_id,
                            score: score.score,
                        }),
                    });
    
                    if (!response.ok) {
                        throw new Error("Failed to create new grade.");
                    }
    
                    const newGrade = await response.json();
                    score.id = newGrade.data.id;
                }
            }
    
            // Update local state with the latest scores
            setSelectedCourse((prevCourse) => {
                const updatedStudents = prevCourse.students.map((student) => {
                    if (student.id === editingStudent) {
                        return {
                            ...student,
                            grades: editingScores,
                        };
                    }
                    return student;
                });
    
                return { ...prevCourse, students: updatedStudents };
            });
    
            // Reset editing state and notify the user
            setEditingStudent(null);
            setEditingScores([]);
            setEditingEnrollmentId(null);
            setNotification("Oceny zostały zaktualizowane.");
            setTimeout(() => setNotification(""), 3000);
        } catch (error) {
            console.error("Błąd podczas zapisywania ocen:", error);
            alert("Nie udało się zapisać zmian w ocenach.");
        }
    };

    // const handleAddParticipant = async () => {
    //     if (!newParticipant.name.trim()) {
    //         alert("Podaj nazwę uczestnika.");
    //         return;
    //     }

    //     try {
    //         const updatedCourse = { ...selectedCourse };

    //         // Dodanie uczestnika z ID do participants
    //         updatedCourse.participants.push({ ...newParticipant, id: generateUniqueId() });

    //         const response = await fetch(`http://localhost:5000/courses/${encodeURIComponent(courseName)}`, {
    //             method: "PUT",
    //             headers: { "Content-Type": "application/json" },
    //             body: JSON.stringify(updatedCourse),
    //         });

    //         if (response.ok) {
    //             updatedCourse.participants.sort((a, b) => {
    //                 const lastNameA = a.name.split(" ").slice(-1)[0].toLowerCase();
    //                 const lastNameB = b.name.split(" ").slice(-1)[0].toLowerCase();
    //                 return lastNameA.localeCompare(lastNameB);
    //             });
    //             setSelectedCourse(updatedCourse);
    //             setNewParticipant({ name: "", group: 1 });
    //             setNotification("Uczestnik został dodany.");
    //             setTimeout(() => setNotification(""), 3000);
    //         } else {
    //             alert("Nie udało się dodać uczestnika.");
    //         }
    //     } catch (error) {
    //         console.error("Błąd podczas dodawania uczestnika:", error);
    //     }
    // };

    return (
        <div className="manage-course">
            <div className="containermng">
                <div className="my-course-details">
                    <h2>Zarządzanie kursem: {selectedCourse?.name}</h2>
                    {notification && <div className="notification">{notification}</div>}

                    {/* Course Description Section */}
                    <h3>Opis kursu:</h3>
                    {editingDescription ? (
                        <div>
                            <textarea
                                value={updatedDescription}
                                onChange={(e) => setUpdatedDescription(e.target.value)}
                            />
                            <button onClick={handleUpdateDescription}>Zapisz opis</button>
                            <button onClick={() => setEditingDescription(false)}>Anuluj</button>
                        </div>
                    ) : (
                        <div>
                            <p>{selectedCourse?.description || "Brak opisu."}</p>
                            <button onClick={() => {
                                    setEditingDescription(true);
                                    setUpdatedDescription(selectedCourse?.description || "");
                                }}>Edytuj opis</button>
                        </div>
                    )}

                    {/* Assignments Section */}
                    <div className="assignments-list">
                        <h3>Lista zadań:</h3>
                        {selectedCourse?.assignments?.length > 0 ? (
                            <ul>
                                {selectedCourse.assignments.map((assignment) => (
                                    <li key={assignment.id}>
                                        <strong>{assignment.name}</strong>
                                        <p>{assignment.description || "Brak opisu"}</p>
                                        <p>Waga: {assignment.weight}%</p>
                                        {/*<p>
                                            {assignment.is_mandatory
                                                ? "Obowiązkowe"
                                                : "Nieobowiązkowe"}
                                        </p>*/}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p>Brak zadań w tym kursie.</p>
                        )}
                    </div>

                    <button onClick={() => navigate("/manage-course")}>Wróć do listy kursów</button>
                </div>

                {/* Students List Section */}
                <div className="participants-list">
                    <h3>Uczestnicy:</h3>
                    <ul className="students-list">
                        {selectedCourse?.students?.length > 0 ? (
                            selectedCourse.students.map((student) => (
                                <li key={student.id} className="student-item">
                                    <div>
                                        <strong>
                                            {student.user.first_name} {student.user.last_name}
                                        </strong>{/*{" "}
                                        (Numer studenta: {student.student_number})*/}
                                    </div>

                                    <ul className="grades-list">
                                        {student.grades?.length > 0 ? (
                                            student.grades.map((grade) => (
                                                <li key={grade.assignment_id}>
                                                    {grade.assignment_name}: {grade.score}{/*%
                                                    (Przyznano: {grade.date_assigned})*/}
                                                </li>
                                            ))
                                        ) : (
                                            <li>Brak ocen</li>
                                        )}
                                    </ul>
                                    <div className="student-actions">
                                        <button onClick={() => handleEditScores(student.id)}>
                                            Edytuj oceny
                                        </button>
                                        <button onClick={() => handleRemoveParticipant(student.id)}>
                                            Usuń uczestnika
                                        </button>
                                    </div>
                                </li>
                            ))
                        ) : (
                            <p>Brak uczestników w tym kursie.</p>
                        )}
                    </ul>

                    {/* Edit Grades Section */}
                    {editingStudent && (
                        <div className="edit-scores" ref={editFormRef}>
                            <h3>
                                Edytuj oceny dla uczestnika{" "}
                                {
                                    selectedCourse?.students.find(
                                        (student) => student.id === editingStudent
                                    )?.user.first_name
                                }{" "}
                                {
                                    selectedCourse?.students.find(
                                        (student) => student.id === editingStudent
                                    )?.user.last_name
                                }
                            </h3>
                            <ul>
                                {editingScores.map((score, index) => (
                                    <li key={index}>
                                        {score.assignment_name}: {score.score} (Waga:{" "}
                                        {score.weight}%)
                                    </li>
                                ))}
                            </ul>
                            <select
                                onChange={(e) => {
                                    const value = e.target.value;
                                    setSelectedElement(value);
                                    if (value === "other") {
                                        setNewElement("");
                                    }
                                }}
                                value={selectedElement}
                            >
                                <option value="">Wybierz element</option>
                                {selectedCourse.assignments.map((assignment, index) => (
                                    <option key={index} value={assignment.id}>
                                        {assignment.name} (Waga: {assignment.weight}%)
                                    </option>
                                ))}
                                <option value="other">Inne</option>
                            </select>
                            {selectedElement === "other" && (
                                <input
                                    type="text"
                                    placeholder="Podaj nowy element"
                                    value={newElement}
                                    onChange={(e) => setNewElement(e.target.value)}
                                />
                            )}
                            <input
                                type="number"
                                placeholder="Podaj ocenę"
                                value={newGrade}
                                onChange={(e) => setNewGrade(e.target.value)}
                            />
                            <button onClick={handleAddScore}>Dodaj ocenę</button>
                            <button onClick={handleSaveScores}>Zapisz zmiany</button>
                            <button onClick={() => setEditingStudent(null)}>Anuluj</button>
                        </div>
                    )}
                </div>
            </div>         
        </div>
        
    );
}

export default ManageCourse;
