from typing import cast

from django.test import TestCase
from rest_framework import serializers

from grades.models import (Assignment, Course, Enrollment, Grade, Student,
                           Teacher, User)
from grades.serializers import (AssignmentSerializer, StudentSerializer,
                                TeacherSerializer, UserSerializer)


class UserSerializerTest(TestCase):
    def setUp(self):
        """Set up test data"""
        # Create a regular user (not a student)
        self.user = User.objects.create_user(
            email="user@example.com",
            password="password123",
            first_name="John",
            last_name="Doe",
            role=User.ROLE_UNKNOWN,
        )

        # Create a student user
        self.student_user = User.objects.create_user(
            email="student@example.com",
            password="password123",
            first_name="Jane",
            last_name="Smith",
            role=User.ROLE_STUDENT,
        )
        self.student = Student.objects.create(
            user=self.student_user, student_number="S12345"
        )

    def test_user_serializer_regular_user(self):
        """Test serialization of a regular user (non-student)"""
        serializer = UserSerializer(instance=self.user)
        data = dict(serializer.data)  # ✅ Fix: Convert to dictionary

        self.assertEqual(data["id"], self.user.id)
        self.assertEqual(data["first_name"], "John")
        self.assertEqual(data["last_name"], "Doe")
        self.assertEqual(data["email"], "user@example.com")
        self.assertEqual(data["role"], User.ROLE_UNKNOWN)
        self.assertIsNone(data["student_id"])  # Non-students should have None
        self.assertIsNone(data["student_number"])  # Non-students should have None

    def test_user_serializer_student(self):
        """Test serialization of a student user"""
        serializer = UserSerializer(instance=self.student_user)
        data = dict(serializer.data)  # ✅ Fix: Convert to dictionary

        self.assertEqual(data["id"], self.student_user.id)
        self.assertEqual(data["first_name"], "Jane")
        self.assertEqual(data["last_name"], "Smith")
        self.assertEqual(data["email"], "student@example.com")
        self.assertEqual(data["role"], User.ROLE_STUDENT)
        self.assertEqual(
            data["student_id"], self.student.id
        )  # Student ID should be included
        self.assertEqual(
            data["student_number"], "S12345"
        )  # Student number should be included


class StudentSerializerTest(TestCase):
    def setUp(self):
        """Set up test data"""
        # Create a teacher
        self.teacher_user = User.objects.create_user(
            email="teacher@example.com",
            password="password",
            first_name="Alice",
            last_name="Brown",
            role=User.ROLE_TEACHER,
        )
        self.teacher = Teacher.objects.create(user=self.teacher_user)

        # Create a course
        self.course = Course.objects.create(name="Math 101", teacher=self.teacher)

        # Create a student user
        self.student_user = User.objects.create_user(
            email="student@example.com",
            password="password",
            first_name="Jane",
            last_name="Smith",
            role=User.ROLE_STUDENT,
        )
        self.student = Student.objects.create(
            user=self.student_user, student_number="S12345"
        )

    def test_student_serializer_no_grades(self):
        """Test serialization of a student with no grades"""
        serializer = StudentSerializer(
            instance=self.student, context={"course": self.course}
        )
        data = dict(serializer.data)  # Ensure it's a dictionary

        self.assertEqual(data["id"], self.student.id)
        self.assertEqual(data["student_number"], "S12345")
        self.assertEqual(data["user"]["id"], self.student_user.id)
        self.assertEqual(data["user"]["first_name"], "Jane")
        self.assertEqual(data["user"]["last_name"], "Smith")
        self.assertEqual(data["user"]["email"], "student@example.com")
        self.assertEqual(data["user"]["role"], User.ROLE_STUDENT)
        self.assertEqual(data["grades"], [])  # No grades assigned

    def test_student_serializer_with_grades(self):
        """Test serialization of a student with grades"""
        # Enroll the student in the course
        enrollment = Enrollment.objects.create(student=self.student, course=self.course)

        # Create assignments
        assignment1 = Assignment.objects.create(name="Homework 1", course=self.course)
        assignment2 = Assignment.objects.create(name="Exam 1", course=self.course)

        # Assign grades to the student
        grade1 = Grade.objects.create(
            enrollment=enrollment, assignment=assignment1, score=90.0
        )
        grade2 = Grade.objects.create(
            enrollment=enrollment, assignment=assignment2, score=85.5
        )

        serializer = StudentSerializer(
            instance=self.student, context={"course": self.course}
        )
        data = dict(serializer.data)

        self.assertEqual(len(data["grades"]), 2)
        self.assertIn(
            {
                "grade_id": grade1.id,
                "assignment_id": assignment1.id,
                "assignment_name": "Homework 1",
                "score": 90.0,
            },
            data["grades"],
        )
        self.assertIn(
            {
                "grade_id": grade2.id,
                "assignment_id": assignment2.id,
                "assignment_name": "Exam 1",
                "score": 85.5,
            },
            data["grades"],
        )

    def test_student_serializer_create(self):
        """Test student creation through serializer"""
        student_data = {
            "student_number": "S54321",
            "user": {
                "email": "newstudent@example.com",
                "password": "password123",
                "first_name": "Tom",
                "last_name": "Holland",
                "role": User.ROLE_STUDENT,
            },
        }

        serializer = StudentSerializer(data=student_data)
        self.assertTrue(serializer.is_valid(), serializer.errors)

        student = cast(Student, serializer.save())
        self.assertEqual(student.user.email, "newstudent@example.com")
        self.assertEqual(student.student_number, "S54321")

    def test_student_serializer_update(self):
        """Test updating a student using the serializer"""
        update_data = {
            "student_number": "UPDATED123",
            "user": {
                "first_name": "UpdatedName",
                "last_name": "UpdatedLast",
            },
        }

        serializer = StudentSerializer(
            instance=self.student, data=update_data, partial=True
        )
        self.assertTrue(serializer.is_valid(), serializer.errors)

        updated_student = cast(Student, serializer.save())
        self.assertEqual(updated_student.student_number, "UPDATED123")
        self.assertEqual(updated_student.user.first_name, "UpdatedName")
        self.assertEqual(updated_student.user.last_name, "UpdatedLast")


class TeacherSerializerTest(TestCase):
    def setUp(self):
        """Set up test data"""
        # Create a teacher user
        self.teacher_user = User.objects.create_user(
            email="teacher@example.com",
            password="password",
            first_name="Alice",
            last_name="Brown",
            role=User.ROLE_TEACHER,
        )
        self.teacher = Teacher.objects.create(user=self.teacher_user)

    def test_teacher_serializer(self):
        """Test serialization of a teacher"""
        serializer = TeacherSerializer(instance=self.teacher)
        data = dict(serializer.data)

        self.assertEqual(data["id"], self.teacher.id)
        self.assertEqual(data["email"], "teacher@example.com")
        self.assertEqual(data["first_name"], "Alice")
        self.assertEqual(data["last_name"], "Brown")

    def test_teacher_serializer_update(self):
        """Test updating a teacher using the serializer"""
        update_data = {
            "email": "updated_teacher@example.com",
            "first_name": "UpdatedName",
            "last_name": "UpdatedLast",
        }

        serializer = TeacherSerializer(
            instance=self.teacher, data=update_data, partial=True
        )
        self.assertTrue(serializer.is_valid(), serializer.errors)

        updated_teacher = cast(Teacher, serializer.save())

        self.assertEqual(updated_teacher.user.email, "updated_teacher@example.com")
        self.assertEqual(updated_teacher.user.first_name, "UpdatedName")
        self.assertEqual(updated_teacher.user.last_name, "UpdatedLast")

    def test_teacher_serializer_email_uniqueness(self):
        """Test that the serializer prevents duplicate emails"""
        # Create another teacher user with a different email
        another_user = User.objects.create_user(
            email="another_teacher@example.com",
            password="password",
            first_name="Bob",
            last_name="Smith",
            role=User.ROLE_TEACHER,
        )
        another_teacher = Teacher.objects.create(user=another_user)

        update_data = {
            "email": "another_teacher@example.com",  # Trying to use an existing email
        }

        serializer = TeacherSerializer(
            instance=self.teacher, data=update_data, partial=True
        )
        self.assertFalse(serializer.is_valid())  # Should fail due to duplicate email

        errors = dict(serializer.errors)
        self.assertIn("email", errors)
        self.assertEqual(str(errors["email"][0]), "This email is already in use.")
