import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";

function ManageCourse() {
    const { courseName } = useParams();
    const navigate = useNavigate();
    const [courses, setCourses] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [selectedElement, setSelectedElement] = useState("");
    const [newGrade, setNewGrade] = useState("");
    const [editingStudent, setEditingStudent] = useState(null);
    const [editingScores, setEditingScores] = useState([]);
    const [notification, setNotification] = useState("");
    const [newParticipant, setNewParticipant] = useState({ name: "", group: 1 });
    const [editingDescription, setEditingDescription] = useState(false);
    const [updatedDescription, setUpdatedDescription] = useState("");
    const editFormRef = useRef(null);

    const generateUniqueId = () => {
        const letters = "abcdefghijklmnopqrstuvwxyz";
        const randomLetters = Array.from({ length: 2 }, () => letters[Math.floor(Math.random() * letters.length)]).join("");
        const randomNumbers = Math.floor(100000 + Math.random() * 900000).toString();
        return randomLetters + randomNumbers;
    };

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

    const handleUpdateDescription = async () => {
        if (!updatedDescription.trim()) {
            alert("Opis nie może być pusty.");
            return;
        }

        try {
            const updatedCourse = { ...selectedCourse, description: updatedDescription };

            const response = await fetch(`http://localhost:5000/courses/${encodeURIComponent(courseName)}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updatedCourse),
            });

            if (response.ok) {
                setSelectedCourse(updatedCourse);
                setEditingDescription(false);
                setNotification("Opis został zaktualizowany.");
                setTimeout(() => setNotification(""), 3000);
            } else {
                alert("Nie udało się zaktualizować opisu.");
            }
        } catch (error) {
            console.error("Błąd podczas aktualizacji opisu:", error);
        }
    };

    const handleAddParticipant = async () => {
        if (!newParticipant.name.trim()) {
            alert("Podaj nazwę uczestnika.");
            return;
        }

        try {
            const updatedCourse = { ...selectedCourse };

            // Dodanie uczestnika z ID do participants
            updatedCourse.participants.push({ ...newParticipant, id: generateUniqueId() });

            const response = await fetch(`http://localhost:5000/courses/${encodeURIComponent(courseName)}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updatedCourse),
            });

            if (response.ok) {
                updatedCourse.participants.sort((a, b) => {
                    const lastNameA = a.name.split(" ").slice(-1)[0].toLowerCase();
                    const lastNameB = b.name.split(" ").slice(-1)[0].toLowerCase();
                    return lastNameA.localeCompare(lastNameB);
                });
                setSelectedCourse(updatedCourse);
                setNewParticipant({ name: "", group: 1 });
                setNotification("Uczestnik został dodany.");
                setTimeout(() => setNotification(""), 3000);
            } else {
                alert("Nie udało się dodać uczestnika.");
            }
        } catch (error) {
            console.error("Błąd podczas dodawania uczestnika:", error);
        }
    };

    const handleRemoveParticipant = async (participantId) => {
        try {
            const updatedCourse = { ...selectedCourse };
            updatedCourse.participants = updatedCourse.participants.filter((p) => p.id !== participantId);

            const response = await fetch(`http://localhost:5000/courses/${encodeURIComponent(courseName)}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updatedCourse),
            });

            if (response.ok) {
                setSelectedCourse(updatedCourse);
                setNotification(`Uczestnik został usunięty.`);
                setTimeout(() => setNotification(""), 3000);
            } else {
                alert("Nie udało się usunąć uczestnika.");
            }
        } catch (error) {
            console.error("Błąd podczas usuwania uczestnika:", error);
        }
    };

    const handleEditScores = (studentId) => {
        const studentGrades = selectedCourse.grades.find((g) => g.studentId === studentId);
        setEditingStudent(studentId);
        setEditingScores(studentGrades ? [...studentGrades.scores] : []);

        if (editFormRef.current) {
            editFormRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    };

    const handleAddScore = () => {
        if (!newGrade || !selectedElement) return;
        const element = selectedCourse.requiredElements.find((el) => el.name === selectedElement);
        if (!element) return;

        const newScore = {
            name: element.name,
            value: parseFloat(newGrade),
            weight: element.weight,
            comment: "",
        };
        setEditingScores([...editingScores, newScore]);
        setNewGrade("");
    };

    const handleSaveScores = async () => {
        try {
            const updatedCourse = { ...selectedCourse };
            const studentGrades = updatedCourse.grades.find((g) => g.studentId === editingStudent);

            if (studentGrades) {
                studentGrades.scores = [...editingScores];
            } else {
                updatedCourse.grades.push({
                    studentId: editingStudent,
                    scores: [...editingScores],
                });
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
                            </div>
                        ))}
                    </div>
                </>
            ) : (
                <>
                    <h2>Zarządzanie kursem: {selectedCourse?.name}</h2>

                    {notification && <div className="notification">{notification}</div>}

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

                    <h3>Uczestnicy:</h3>
                    <ul>
                        {selectedCourse?.participants.map((participant) => (
                            <li key={participant.id}>
                                {participant.name} (Grupa {participant.group})
                                <button onClick={() => handleEditScores(participant.id)}>Edytuj oceny</button>
                                <button onClick={() => handleRemoveParticipant(participant.name)}>Usuń</button>
                            </li>
                        ))}
                    </ul>

                    {editingStudent && (
                        <div className="edit-scores" ref={editFormRef}>
                            <h3>Edytuj oceny dla uczestnika {selectedCourse?.participants.find(p => p.id === editingStudent)?.name}</h3>
                            <ul>
                                {editingScores.map((score, index) => (
                                    <li key={index}>
                                        {score.name}: {score.value} (Waga: {score.weight}%)
                                    </li>
                                ))}
                            </ul>
                            <select
                                onChange={(e) => setSelectedElement(e.target.value)}
                                value={selectedElement}
                            >
                                <option value="">Wybierz element</option>
                                {selectedCourse.requiredElements.map((element, index) => (
                                    <option key={index} value={element.name}>
                                        {element.name} (Waga: {element.weight}%)
                                    </option>
                                ))}
                            </select>
                            <input
                                type="number"
                                placeholder="Podaj ocenę"
                                value={newGrade}
                                onChange={(e) => setNewGrade(e.target.value)}
                            />
                            <button onClick={handleAddScore}>Dodaj ocenę</button>
                            <button onClick={handleSaveScores}>Zapisz zmiany</button>
                            <button onClick={() => setEditingStudent(null)}>Anuluj</button>
                            <p></p>
                        </div>
                    )}

                    <div className="add-participant">
                        <h3>Dodawanie uczestników:</h3>
                        <input
                            type="text"
                            placeholder="Nazwa uczestnika"
                            value={newParticipant.name}
                            onChange={(e) => setNewParticipant({ ...newParticipant, name: e.target.value })}
                        />
                        <input
                            type="number"
                            placeholder="Grupa"
                            value={newParticipant.group}
                            onChange={(e) => setNewParticipant({ ...newParticipant, group: parseInt(e.target.value) || 1 })}
                        />
                        <button onClick={handleAddParticipant}>Dodaj uczestnika</button>
                    </div>

                    <button onClick={() => navigate("/manage-course")}>Wróć do listy kursów</button>
                </>
            )}
        </div>
    );
}

export default ManageCourse;
