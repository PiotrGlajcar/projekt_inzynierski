import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

function ManageCourse() {
    const { courseName } = useParams();
    const navigate = useNavigate();
    const [courses, setCourses] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [newGrade, setNewGrade] = useState("");
    const [selectedStudent, setSelectedStudent] = useState("");
    const [notification, setNotification] = useState("");
    const [newParticipant, setNewParticipant] = useState("");

    const [editingStudent, setEditingStudent] = useState(null);
    const [editingScores, setEditingScores] = useState([]);

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
        if (courseName && courses.length > 0) {
            const course = courses.find((c) => c.name === courseName);
            setSelectedCourse(course || null);
        }
    }, [courseName, courses]);

    const handleEditScores = (student) => {
        const studentGrades = selectedCourse.grades.find((g) => g.student === student);
        setEditingStudent(student);
        setEditingScores(studentGrades ? [...studentGrades.scores] : []);
    };

    const handleSaveScores = async () => {
        try {
            const updatedCourse = { ...selectedCourse };
            const studentGrades = updatedCourse.grades.find((g) => g.student === editingStudent);

            if (studentGrades) {
                studentGrades.scores = [...editingScores];
            }

            const response = await fetch(`http://localhost:5000/courses/${encodeURIComponent(courseName)}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updatedCourse),
            });

            if (response.ok) {
                setSelectedCourse(updatedCourse);
                setEditingStudent(null);
                setEditingScores([]);
                setNotification("Oceny zostały zaktualizowane.");
                setTimeout(() => setNotification(""), 3000);
            } else {
                alert("Nie udało się zapisać zmian w ocenach.");
            }
        } catch (error) {
            console.error("Błąd podczas zapisywania ocen:", error);
        }
    };

    const handleRemoveScore = (index) => {
        const updatedScores = editingScores.filter((_, i) => i !== index);
        setEditingScores(updatedScores);
    };

    const handleAddScore = () => {
        if (!newGrade) return;
        setEditingScores([...editingScores, parseInt(newGrade)]);
        setNewGrade("");
    };

    const handleAddParticipant = async () => {
        if (!newParticipant.trim()) {
            alert("Podaj nazwę uczestnika.");
            return;
        }

        try {
            const updatedCourse = { ...selectedCourse };
            const participantName = newParticipant.trim();

            // Dodanie uczestnika do participants
            updatedCourse.participants.push(participantName);

            // Dodanie pustego wpisu do grades
            updatedCourse.grades.push({ student: participantName, scores: [] });

            const response = await fetch(`http://localhost:5000/courses/${encodeURIComponent(courseName)}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updatedCourse),
            });

            if (response.ok) {
                setSelectedCourse(updatedCourse);
                setNewParticipant("");
                setNotification("Uczestnik został dodany.");
                setTimeout(() => setNotification(""), 3000);
            } else {
                alert("Nie udało się dodać uczestnika.");
            }
        } catch (error) {
            console.error("Błąd podczas dodawania uczestnika:", error);
        }
    };

    const handleRemoveParticipant = async (participant) => {
        try {
            const updatedCourse = { ...selectedCourse };
            updatedCourse.participants = updatedCourse.participants.filter((p) => p !== participant);
            updatedCourse.grades = updatedCourse.grades.filter((g) => g.student !== participant);

            const response = await fetch(`http://localhost:5000/courses/${encodeURIComponent(courseName)}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updatedCourse),
            });

            if (response.ok) {
                setSelectedCourse(updatedCourse);
                setNotification(`Uczestnik ${participant} został usunięty.`);
                setTimeout(() => setNotification(""), 3000);
            } else {
                alert("Nie udało się usunąć uczestnika.");
            }
        } catch (error) {
            console.error("Błąd podczas usuwania uczestnika:", error);
        }
    };

    const handleAddGrade = async () => {
        if (!selectedStudent || !newGrade) {
            alert("Wybierz studenta i podaj ocenę.");
            return;
        }

        try {
            const updatedCourse = { ...selectedCourse };
            const studentGrades = updatedCourse.grades.find((g) => g.student === selectedStudent);
            if (studentGrades) {
                studentGrades.scores.push(parseInt(newGrade));
            } else {
                updatedCourse.grades.push({ student: selectedStudent, scores: [parseInt(newGrade)] });
            }

            const response = await fetch(`http://localhost:5000/courses/${encodeURIComponent(courseName)}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updatedCourse),
            });

            if (response.ok) {
                setSelectedCourse(updatedCourse);
                setNewGrade("");
                setNotification("Ocena została dodana.");
                setTimeout(() => setNotification(""), 3000);
            } else {
                alert("Nie udało się dodać oceny.");
            }
        } catch (error) {
            console.error("Błąd podczas dodawania oceny:", error);
        }
    };

    return (
        <div className="manage-course">
            {!courseName ? (
                <>
                    <h2>Zarządzanie kursami</h2>
                    <div className="course-grid">
                        {courses.map((course) => (
                            <div key={course.name} className="course-tile">
                                <h3>{course.name}</h3>
                                <button onClick={() => navigate(`/manage-course/${encodeURIComponent(course.name)}`)}>
                                    Zobacz szczegóły
                                </button>
                                <button onClick={() => handleDeleteCourse(course.name)}>Usuń kurs</button>
                            </div>
                        ))}
                    </div>
                </>
            )  : (
                <>
                    <h2>Zarządzanie kursem: {selectedCourse?.name}</h2>

                    {notification && <div className="notification">{notification}</div>}

                    <h3>Uczestnicy:</h3>
                    <ul>
                        {selectedCourse?.participants
                            .slice()
                            .sort((a, b) =>
                                a.split(" ").slice(-1)[0].localeCompare(b.split(" ").slice(-1)[0])
                            )
                            .map((participant, index) => (
                                <li key={index}>
                                    {participant}
                                    <button onClick={() => handleRemoveParticipant(participant)}>Usuń</button>
                                </li>
                            ))}
                    </ul>
                    <div className="add-participant">
                        <input
                            type="text"
                            placeholder="Dodaj nowego uczestnika"
                            value={newParticipant}
                            onChange={(e) => setNewParticipant(e.target.value)}
                        />
                        <button onClick={handleAddParticipant}>Dodaj uczestnika</button>
                    </div>

                    <h3>Oceny:</h3>
                        {selectedCourse?.grades
                            .slice()
                            .sort((a, b) =>
                                a.student.split(" ").slice(-1)[0].localeCompare(b.student.split(" ").slice(-1)[0])
                            )
                            .map((grade, index) => (
                                <div key={index} className="grade-entry">
                                    <p>
                                        <strong>{grade.student}:</strong>{" "}
                                        {grade.scores.length > 0
                                            ? grade.scores.join(", ")
                                            : "Brak ocen"}
                                    </p>
                                    <button onClick={() => handleEditScores(grade.student)}>Edytuj</button>
                                </div>
                            ))}

                    {editingStudent && (
                        <div className="edit-scores">
                            <h3>Edytuj oceny dla {editingStudent}</h3>
                            <ul>
                                {editingScores.map((score, index) => (
                                    <li key={index}>
                                        {score}{" "}
                                        <button onClick={() => handleRemoveScore(index)}>Usuń</button>
                                    </li>
                                ))}
                            </ul>
                            <input
                                type="number"
                                placeholder="Dodaj nową ocenę"
                                value={newGrade}
                                onChange={(e) => setNewGrade(e.target.value)}
                            />
                            <button onClick={handleAddScore}>Dodaj ocenę</button>
                            <button onClick={handleSaveScores}>Zapisz zmiany</button>
                            <button onClick={() => setEditingStudent(null)}>Anuluj</button>
                        </div>
                    )}

                    <div className="add-grade">
                        <h3>Dodaj ocenę</h3>
                        <select onChange={(e) => setSelectedStudent(e.target.value)} value={selectedStudent}>
                            <option value="">Wybierz studenta</option>
                            {selectedCourse?.participants
                                .slice()
                                .sort((a, b) =>
                                    a.split(" ").slice(-1)[0].localeCompare(b.split(" ").slice(-1)[0])
                                )
                                .map((participant, index) => (
                                    <option key={index} value={participant}>
                                        {participant}
                                    </option>
                                ))}
                        </select>
                        <input
                            type="number"
                            placeholder="Podaj ocenę"
                            value={newGrade}
                            onChange={(e) => setNewGrade(e.target.value)}
                        />
                        <button onClick={handleAddGrade}>Dodaj</button>
                    </div>

                    <button onClick={() => navigate("/manage-course")}>Wróć do listy kursów</button>
                </>
            )}
        </div>
    );
}

export default ManageCourse;
