import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

function CreateCourse() {
    const [courseName, setCourseName] = useState("");
    const [courseDescription, setCourseDescription] = useState("");
    const [requiredElements, setRequiredElements] = useState([]);
    const [participants, setParticipants] = useState([]);
    const [elementName, setElementName] = useState("");
    const [elementDescription, setElementDescription] = useState("");
    const [elementWeight, setElementWeight] = useState("");
    const navigate = useNavigate();
  
    const [data, setUser] = useState(true);
    // const [error, setError] = useState(null); 

    useEffect(() => {
        fetch('http://localhost:8000/users/me', {
            credentials: 'include'  // Important for session cookies
        })
        .then(response => response.json())
        .then(user_data => {
            if (user_data.status === 'success') {
                console.log("User role:", user_data.data.role);
                setUser(user_data.data);  // Save user data
            } else {
                console.log("Failed to fetch user data");
            }
        });
    }, []);

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

    const handleCreateCourse = async () => {
        if (courseName && requiredElements.length > 0) {
            const newCourse = {
                name: courseName,
                description: courseDescription,
                writable_assignments: requiredElements,
                teacher: data.id,
            };

            try {
                const response = await fetch("http://localhost:8000/courses/?include=assignments", {
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
                    setUser("");
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
            <Link to='/home-staff'>← Powrót</Link>
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
                <label className="element-label">
                    Opis kursu:
                    <textarea
                        className="element-textarea"
                        value={courseDescription}
                        onChange={(e) => setCourseDescription(e.target.value)}
                        placeholder="Można zostawić to pole puste"
                    />
                </label>
            </div>
            <div>
                <h3>Elementy wymagane:</h3>
                <label>
                    Obligatoryjne do zaliczenia przez uczestników kursu
                    <input
                        type="text"
                        value={elementName}
                        onChange={(e) => setElementName(e.target.value)}
                        placeholder="Nazwa elementu"
                    />
                </label>
                <label className="element-label">
                    Opis elementu:
                    <textarea
                        className="element-textarea"
                        value={elementDescription}
                        onChange={(e) => setElementDescription(e.target.value)}
                        placeholder="Można zostawić puste"
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
                <p>Prowadzący kurs: {data.first_name} {data.last_name}</p>
                <p>Zapisuje id w bazie: {data.id}</p>
            </div>

            <button onClick={handleCreateCourse}>Utwórz kurs</button>
        </div>
    );
}

export default CreateCourse;
