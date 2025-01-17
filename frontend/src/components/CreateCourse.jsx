import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function CreateCourse() {
    const [courseName, setCourseName] = useState("");
    const [courseDescription, setCourseDescription] = useState("");
    const [requiredElements, setRequiredElements] = useState([]);
    const [participants, setParticipants] = useState([]);
    const [elementName, setElementName] = useState("");
    const [elementDescription, setElementDescription] = useState("");
    const [elementWeight, setElementWeight] = useState("");
    const [participantName, setParticipantName] = useState("");
    const [participantGroup, setParticipantGroup] = useState("");
    const navigate = useNavigate();

    const handleAddRequiredElement = () => {
        if (elementName && elementWeight > 0) {
            setRequiredElements([
                ...requiredElements,
                {
                    name: elementName,
                    description: elementDescription,
                    weight: parseInt(elementWeight, 10),
                },
            ]);
            setElementName("");
            setElementDescription("");
            setElementWeight("");
        } else {
            alert("Podaj poprawne dane dla elementu wymaganego.");
        }
    };

    const handleAddParticipant = () => {
        if (participantName && participantGroup > 0) {
            setParticipants([
                ...participants,
                {
                    name: participantName,
                    group: parseInt(participantGroup, 10),
                },
            ]);
            setParticipantName("");
            setParticipantGroup("");
        } else {
            alert("Podaj poprawne dane dla uczestnika.");
        }
    };

    const handleCreateCourse = async () => {
        if (courseName && courseDescription && requiredElements.length > 0 && participants.length > 0) {
            const newCourse = {
                name: courseName,
                description: courseDescription,
                requiredElements,
                participants,
                grades: [], // Grades zostaną dodane później
            };

            try {
                const response = await fetch("http://localhost:5000/courses", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(newCourse),
                });
                if (response.ok) {
                    alert(`Kurs "${courseName}" został pomyślnie utworzony!`);
                    setCourseName("");
                    setCourseDescription("");
                    setRequiredElements([]);
                    setParticipants([]);
                    navigate(`/manage-course/${encodeURIComponent(courseName)}`);
                } else {
                    alert("Nie udało się utworzyć kursu.");
                }
            } catch (error) {
                console.error("Błąd podczas tworzenia kursu:", error);
                alert("Wystąpił błąd podczas tworzenia kursu.");
            }
        } else {
            alert("Uzupełnij wszystkie wymagane pola.");
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
                        placeholder="Wprowadź nazwę kursu"
                    />
                </label>
            </div>
            <div>
                <label>
                    Opis kursu:
                    <textarea
                        value={courseDescription}
                        onChange={(e) => setCourseDescription(e.target.value)}
                        placeholder="Wprowadź opis kursu"
                    />
                </label>
            </div>
            <div>
                <h3>Elementy wymagane:</h3>
                <label>
                    Nazwa elementu:
                    <input
                        type="text"
                        value={elementName}
                        onChange={(e) => setElementName(e.target.value)}
                        placeholder="Nazwa elementu"
                    />
                </label>
                <label>
                    Opis elementu:
                    <textarea
                        value={elementDescription}
                        onChange={(e) => setElementDescription(e.target.value)}
                        placeholder="Opis elementu"
                    />
                </label>
                <label>
                    Waga (%):
                    <input
                        type="number"
                        value={elementWeight}
                        onChange={(e) => setElementWeight(e.target.value)}
                        placeholder="Waga elementu"
                    />
                </label>
                <button onClick={handleAddRequiredElement}>Dodaj element</button>
                <ul>
                    {requiredElements.map((el, index) => (
                        <li key={index}>
                            {el.name} - {el.description} (Waga: {el.weight}%)
                        </li>
                    ))}
                </ul>
            </div>
            <div>
                <h3>Uczestnicy:</h3>
                <label>
                    Imię i nazwisko:
                    <input
                        type="text"
                        value={participantName}
                        onChange={(e) => setParticipantName(e.target.value)}
                        placeholder="Imię i nazwisko"
                    />
                </label>
                <label>
                    Grupa:
                    <input
                        type="number"
                        value={participantGroup}
                        onChange={(e) => setParticipantGroup(e.target.value)}
                        placeholder="Numer grupy"
                    />
                </label>
                <button onClick={handleAddParticipant}>Dodaj uczestnika</button>
                <ul>
                    {participants.map((participant, index) => (
                        <li key={index}>
                            {participant.name} (Grupa: {participant.group})
                        </li>
                    ))}
                </ul>
            </div>
            <button onClick={handleCreateCourse}>Utwórz kurs</button>
        </div>
    );
}

export default CreateCourse;
