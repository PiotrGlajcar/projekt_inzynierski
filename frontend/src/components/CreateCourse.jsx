import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../context/UserContext";
import backend from "../api";
import { getCSRFToken } from "../api";

function CreateCourse() {
    const [courseName, setCourseName] = useState("");
    const [courseDescription, setCourseDescription] = useState("");
    const [requiredElements, setRequiredElements] = useState([]);
    const [elementName, setElementName] = useState("");
    const [elementDescription, setElementDescription] = useState("");
    const [elementWeight, setElementWeight] = useState(1);
    const navigate = useNavigate();
    const { user } = useContext(UserContext);

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
                teacher: user.teacher_id,
            };

            try {
                const response = await backend.post("/courses/?include=assignments", newCourse);

                if (response.status === 201) {
                    alert(`Kurs "${courseName}" został pomyślnie utworzony!`);
                    setCourseName("");
                    setCourseDescription("");
                    setRequiredElements([]);
                    navigate(`/manage-course/`);
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
                    Waga oceny:
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
                            {el.name} (w = {el.weight})
                        </li>
                    ))}
                </ul>
                <p>Prowadzący kurs: {user ? user.first_name : "Nieznany"} {user ? user.last_name : ""}</p>
                <p>Zapisuje id nauczyciela: {user ? user.teacher_id : "Nieznany"}</p>
            </div>

            <button onClick={handleCreateCourse}>Utwórz kurs</button>
        </div>
    );
}

export default CreateCourse;
