import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import backend from "../api";
import { getCSRFToken } from "../api";

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
    const [newElementDescription, setNewElementDescription] = useState("");
    const [newElementWeight, setNewElementWeight] = useState("");


    useEffect(() => {
        const fetchCourse = async () => {
            try {
                const response = await backend.get(`/courses/${courseId}/?include=assignments&include=students`);
    
                setSelectedCourse(response.data.data);
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
            const response = await backend.put(`/courses/${courseId}/`,
                {
                    description: updatedDescription,
                }
            );
    
            setSelectedCourse((prev) => ({
                ...prev,
                description: response.data.data.description,
            }));
    
            setEditingDescription(false);
            setNotification(response.data.message);
            setTimeout(() => setNotification(""), 3000);
        } catch (error) {
            console.error("Błąd podczas aktualizacji opisu:", error);
            alert("Nie udało się zaktualizować opisu.");
        }
    };    

    const handleRemoveParticipant = async (studentId) => {
        try {
            await backend.delete(`/enrollments/detail/`, {
                params: { student_id: studentId, course_id: courseId }
            });
    
            setSelectedCourse((prev) => ({
                ...prev,
                students: prev.students.filter((student) => student.id !== studentId),
            }));
    
            setNotification("Uczestnik został usunięty z kursu.");
            setTimeout(() => setNotification(""), 3000);
        } catch (error) {
            console.error("Błąd podczas usuwania uczestnika:", error);
            alert("Nie udało się usunąć uczestnika.");
        }
    };    
    
    const handleEditScores = async (studentId) => {
        const student = selectedCourse.students.find((s) => s.id === studentId);
        setEditingStudent(studentId);
        setEditingScores(student ? [...student.grades] : []);
    
        if (!editingEnrollmentId) {
            try {
                const { data } = await backend.get("/enrollments/detail/", {
                    params: { student_id: studentId, course_id: courseId },
                });
    
                setEditingEnrollmentId(data?.data?.id);
            } catch (error) {
                console.error("Error fetching enrollment ID:", error);
            }
        }
    
        if (editFormRef.current) {
            editFormRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    };    

    const handleAddScore = () => {
        if (!newGrade || !selectedElement) return;
    
        if (selectedElement === "other") {
            const newScore = {
                grade_id: null,
                assignment_id: null,
                assignment_name: newElement,
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
    
        const existingIndex = editingScores.findIndex(
            (score) => score.assignment_id === assignment.id
        );

        if (existingIndex !== -1) {
            const updatedScores = [...editingScores];
            updatedScores[existingIndex] = {
                ...updatedScores[existingIndex],
                score: parseFloat(newGrade), //  newScore.score,
            };
            setEditingScores(updatedScores);
        } else {
            const newScore = {
                grade_id: null,
                assignment_id: assignment.id,
                assignment_name: assignment.name,
                score: parseFloat(newGrade)
            };
            setEditingScores([...editingScores, newScore]);
        }
    
        setNewGrade("");
    };    

    const handleSaveScores = async () => {
        try {
            for (const score of editingScores) {
                if (score.grade_id) {

                    await backend.put(`/grades/${score.grade_id}/`,
                        { score: score.score }
                    );
                } else {
                    let assignmentId = score.assignment_id;
    
                    if (!assignmentId) {

                        // Create a new assignment
                        const { data: newAssignment } = await backend.post(`/assignments/`, {
                            name: score.assignment_name,
                            course_id: courseId,
                            description: newElementDescription,
                            weight: newElementWeight,
                            is_mandatory: false,
                        });
    
                        assignmentId = newAssignment.data.id;
    
                        // Update the local state for assignments
                        setSelectedCourse((prevCourse) => ({
                            ...prevCourse,
                            assignments: [...prevCourse.assignments, newAssignment.data],
                            students: prevCourse.students.map((student) =>
                                student.id === editingStudent
                                    ? {
                                        ...student,
                                        grades: [
                                            ...student.grades,
                                            {
                                                assignment_id: newAssignment.data.id,
                                                assignment_name: newAssignment.data.name,
                                                score: score.score,
                                            },
                                        ],
                                    }
                                    : student
                            ),
                        }));
                    }
    
                    // Add new grade
                    const { data: newGrade } = await backend.post(`/grades/`, {
                        enrollment_id: editingEnrollmentId,
                        assignment_id: assignmentId,
                        score: score.score,
                    });
    
                    score.grade_id = newGrade.data.id;
                }
            }
    
            // Update local state with the latest scores
            setSelectedCourse((prevCourse) => ({
                ...prevCourse,
                students: prevCourse.students.map((student) =>
                    student.id === editingStudent
                        ? { ...student, grades: editingScores }
                        : student
                ),
            }));
    
            // Reset state & show notification
            setEditingScores([]);
            setEditingEnrollmentId(null);
            setNewElementDescription("");
            setNewElementWeight("");
            setNotification("Oceny zostały zaktualizowane.");
            setTimeout(() => setNotification(""), 3000);
            setEditingStudent(null);
        } catch (error) {
            console.error("Błąd podczas zapisywania ocen:", error);
            alert("Nie udało się zapisać zmian w ocenach.");
        }
    };
    

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
                                        {score.assignment_name}: {score.score}
                                    </li>
                                ))}
                            </ul>
                            <select
                                onChange={(e) => {
                                    const value = e.target.value;
                                    setSelectedElement(value);
                                    if (value === "other") {
                                        setNewElement("");
                                    }else {
                                        const selectedAssignment = selectedCourse.assignments.find((a) => a.id === parseInt(value));
                                        if (selectedAssignment) {
                                            setNewElement(selectedAssignment.name);
                                            setNewElementDescription(selectedAssignment.description || "");
                                            setNewElementWeight(selectedAssignment.weight || 0);
                                        }
                                    }
                                }}
                                value={selectedElement}
                            >
                                <option value="">Wybierz element</option>
                                    {selectedCourse.assignments.map((assignment, index) => {
                                        // Find the current grade for this assignment (if it exists)
                                        const currentGrade = editingScores.find((score) => score.assignment_id === assignment.id)?.score || "Brak oceny";

                                        return (
                                            <option key={index} value={assignment.id}>
                                                {assignment.name} - Ocena: {currentGrade} - (Waga: {assignment.weight}%)
                                            </option>
                                        );
                                    })}

                                <option value="other">Inne</option>
                            </select>

                            {/* Add OTHER assignment */}
                            {selectedElement === "other" && (
                                <div>
                                    {/* Assignment Name Input */}
                                    <input
                                        type="text"
                                        placeholder="Podaj nazwę nowego zadania"
                                        value={newElement}
                                        onChange={(e) => setNewElement(e.target.value)}
                                    />
                            
                                    {/* Assignment Description Input */}
                                    <input
                                        type="text"
                                        placeholder="Podaj opis (opcjonalnie)"
                                        value={newElementDescription}
                                        onChange={(e) => setNewElementDescription(e.target.value)}
                                    />
                            
                                    {/* Assignment Weight Input */}
                                    <input
                                        type="number"
                                        placeholder="Podaj wagę (%)"
                                        min="0"
                                        max="100"
                                        step="1"
                                        value={newElementWeight}
                                        onChange={(e) => setNewElementWeight(e.target.value)}
                                    />
                                </div>
                            )}

                            {/* Grade Input */}
                            <input
                                type="number"
                                placeholder="Podaj ocenę"
                                min="0"
                                max="100"
                                step="1"
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
