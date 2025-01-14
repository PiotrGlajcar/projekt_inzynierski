import React, { useState } from "react";

function CourseDetails({ course, onUpdateCourse, onBack }) {
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [newGrade, setNewGrade] = useState("");

    const handleAddGrade = () => {
        if (!newGrade || isNaN(newGrade)) {
            alert("Podaj poprawną ocenę (liczba).");
            return;
        }

        const updatedGrades = course.grades.map((entry) =>
            entry.student === selectedStudent
                ? { ...entry, scores: [...entry.scores, Number(newGrade)] }
                : entry
        );

        const updatedCourse = { ...course, grades: updatedGrades };
        onUpdateCourse(updatedCourse);

        setNewGrade("");
    };

    return (
        <div className="course-details">
            <h2>Szczegóły kursu: {course.name}</h2>
            <h3>Uczestnicy i oceny:</h3>
            <ul>
                {course.participants.map((participant) => {
                    const gradesEntry = course.grades.find(
                        (entry) => entry.student === participant
                    );
                    return (
                        <li key={participant}>
                            <strong>{participant}</strong> - Oceny:{" "}
                            {gradesEntry ? gradesEntry.scores.join(", ") : "Brak ocen"}
                            <button onClick={() => setSelectedStudent(participant)}>
                                Dodaj ocenę
                            </button>
                        </li>
                    );
                })}
            </ul>

            {selectedStudent && (
                <div className="add-grade">
                    <h4>Dodawanie oceny dla: {selectedStudent}</h4>
                    <input
                        type="number"
                        value={newGrade}
                        onChange={(e) => setNewGrade(e.target.value)}
                        placeholder="Podaj ocenę"
                    />
                    <button onClick={handleAddGrade}>Dodaj</button>
                    <button onClick={() => setSelectedStudent(null)}>Anuluj</button>
                </div>
            )}

            {/* Przycisk powrotu */}
            <button className="back-button" onClick={onBack}>
                Powrót do przeglądania kursów
            </button>
        </div>
    );
}

export default CourseDetails;
