import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import fs from "fs";

const app = express();
const PORT = 5000;
const DATA_FILE = "courses.json";

app.use(cors());
app.use(bodyParser.json());

// Endpoint do odczytu kursów
app.get("/courses", (req, res) => {
    fs.readFile(DATA_FILE, "utf8", (err, data) => {
        if (err) {
            return res.status(500).json({ error: "Failed to read courses" });
        }
        const courses = data ? JSON.parse(data) : [];
        res.json(courses);
    });
});

// Endpoint do zapisu nowego kursu
app.post("/courses", (req, res) => {
    const newCourse = req.body;

    fs.readFile(DATA_FILE, "utf8", (err, data) => {
        if (err && err.code !== "ENOENT") {
            return res.status(500).json({ error: "Failed to read courses" });
        }

        const courses = data ? JSON.parse(data) : [];
        courses.push(newCourse);

        fs.writeFile(DATA_FILE, JSON.stringify(courses, null, 2), "utf8", (err) => {
            if (err) {
                return res.status(500).json({ error: "Failed to save course" });
            }
            res.status(201).json(newCourse);
        });
    });
});

// Endpoint do usuwania kursu
app.delete("/courses/:name", (req, res) => {
    const courseName = req.params.name;
    console.log("Attempting to delete course:", courseName);

    fs.readFile(DATA_FILE, "utf8", (err, data) => {
        if (err) {
            console.error("Error reading file:", err);
            return res.status(500).json({ error: "Failed to read courses" });
        }

        let courses = JSON.parse(data);
        console.log("Current courses:", courses.map((course) => course.name));
        const initialLength = courses.length;

        courses = courses.filter((course) => course.name.trim().toLowerCase() !== courseName.trim().toLowerCase());
        
        if (courses.length === initialLength) {
            console.log("Course not found:", courseName);
            return res.status(404).json({ error: "Course not found" });
        }

        fs.writeFile(DATA_FILE, JSON.stringify(courses, null, 2), "utf8", (err) => {
            if (err) {
                console.error("Error writing file:", err);
                return res.status(500).json({ error: "Failed to delete course" });
            }
            console.log("Course deleted successfully:", courseName);
            res.status(200).json({ message: `Course '${courseName}' deleted successfully` });
        });
    });
});

app.put("/courses/:name", (req, res) => {
    const courseName = req.params.name;
    const updatedCourse = req.body;

    fs.readFile(DATA_FILE, "utf8", (err, data) => {
        if (err) {
            return res.status(500).json({ error: "Failed to read courses" });
        }

        let courses = JSON.parse(data);
        const courseIndex = courses.findIndex((course) => course.name === courseName);

        if (courseIndex === -1) {
            return res.status(404).json({ error: "Course not found" });
        }

        courses[courseIndex] = updatedCourse;

        fs.writeFile(DATA_FILE, JSON.stringify(courses, null, 2), "utf8", (err) => {
            if (err) {
                return res.status(500).json({ error: "Failed to update course" });
            }
            res.status(200).json(updatedCourse);
        });
    });
});


app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
