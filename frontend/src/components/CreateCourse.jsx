import React, { useState } from "react";

function CreateCourse() {
    const [courseName, setCourseName] = useState("");
    const [participants, setParticipants] = useState([]);
    const [participantName, setParticipantName] = useState("");

    const handleAddParticipant = () => {
        if (participantName) {
            setParticipants([...participants, participantName]);
            setParticipantName("");
        }
    };

    const handleCreateCourse = async () => {
        if (courseName && participants.length > 0) {
            const newCourse = { name: courseName, participants };
            try {
                const response = await fetch("http://localhost:5000/courses", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(newCourse),
                });
                if (response.ok) {
                    alert(`Course "${courseName}" created successfully!`);
                    setCourseName("");
                    setParticipants([]);
                } else {
                    alert("Failed to create course.");
                }
            } catch (error) {
                console.error("Error creating course:", error);
                alert("An error occurred while creating the course.");
            }
        } else {
            alert("Please provide a course name and at least one participant.");
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
            <div className="creator">
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
                    <li key={index}>{participant}</li>
                ))}
            </ul>
            <button onClick={handleCreateCourse}>Utwórz</button>
        </div>
    );
}

export default CreateCourse;
