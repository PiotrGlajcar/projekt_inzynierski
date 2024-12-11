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
        <div>
            <h2>Create a New Course</h2>
            <div>
                <label>
                    Course Name:
                    <input
                        type="text"
                        value={courseName}
                        onChange={(e) => setCourseName(e.target.value)}
                        placeholder="Enter course name"
                    />
                </label>
            </div>
            <div>
                <label>
                    Participant Name:
                    <input
                        type="text"
                        value={participantName}
                        onChange={(e) => setParticipantName(e.target.value)}
                        placeholder="Enter participant name"
                    />
                </label>
                <button onClick={handleAddParticipant}>Add Participant</button>
            </div>
            <ul>
                {participants.map((participant, index) => (
                    <li key={index}>{participant}</li>
                ))}
            </ul>
            <button onClick={handleCreateCourse}>Create Course</button>
        </div>
    );
}

export default CreateCourse;
