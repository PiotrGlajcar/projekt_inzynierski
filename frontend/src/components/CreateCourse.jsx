import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function CreateCourse() {
    const [courseName, setCourseName] = useState("");
    const [participants, setParticipants] = useState([]);
    const [grades, setGrades] = useState([]);
    const [participantName, setParticipantName] = useState("");
    const navigate = useNavigate(); // Hook do nawigacji

    const handleAddParticipant = () => {
        if (participantName) {
            setParticipants([...participants, participantName]);
            setGrades([...grades, { student: participantName, scores: [] }]);
            setParticipantName("");
        }
    };

    const handleCreateCourse = async () => {
        if (courseName && participants.length > 0) {
            const newCourse = { name: courseName, participants, grades };
            try {
                const response = await fetch("http://localhost:5000/courses", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(newCourse),
                });
                if (response.ok) {
                    alert(`Kurs "${courseName}" został pomyślnie utworzony!`);
                    setCourseName("");
                    setParticipants([]);
                    setGrades([]);

                    // Przekierowanie na stronę zarządzania kursem
                    navigate(`/manage-course/${encodeURIComponent(courseName)}`);
                } else {
                    alert("Nie udało się utworzyć kursu.");
                }
            } catch (error) {
                console.error("Błąd podczas tworzenia kursu:", error);
                alert("Wystąpił błąd podczas tworzenia kursu.");
            }
        } else {
            alert("Podaj nazwę kursu i dodaj przynajmniej jednego uczestnika.");
        }
    };

    return (
        <div className="creator">
            <h2>Dodaj nowy kurs:</h2>
            <div>
                <label>
                    Nazwa kursu:
                    <input
                        type="text"
                        value={courseName}
                        onChange={(e) => setCourseName(e.target.value)}
                        placeholder="Ustaw nazwę kursu"
                    />
                </label>
            </div>
            <div>
                <label>
                    Uczestnik:
                    <input
                        type="text"
                        value={participantName}
                        onChange={(e) => setParticipantName(e.target.value)}
                        placeholder="Imię i nazwisko"
                    />
                </label>
                <button onClick={handleAddParticipant}>Dodaj uczestnika</button>
            </div>
            <ul>
                {participants.map((participant, index) => (
                    <li key={index}>
                        {participant} - Oceny: {grades.find(g => g.student === participant)?.scores.join(", ") || "Brak ocen"}
                    </li>
                ))}
            </ul>
            <button onClick={handleCreateCourse}>Utwórz</button>
        </div>
    );
}

export default CreateCourse;
