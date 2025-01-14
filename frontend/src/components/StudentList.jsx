import React, { useEffect, useState } from 'react';
import backend from '../api';

const StudentList = () => {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    backend.get('/students/')
      .then((response) => setStudents(response.data))
      .catch((error) => console.error('Error fetching students:', error));
  }, []);

  return (
    <div>
      <h1>Students</h1>
      <ul>
        {students.map((student) => (
          <li key={student.id}>
            {student.name} - {student.email}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default StudentList;
