from django.contrib.auth import get_user_model
from django.test import TestCase

from grades.models import (Assignment, Course, Enrollment, Grade, Student,
                           Teacher, User)


class UserModelTest(TestCase):
    def test_create_user(self):
        """Test user creation"""
        user = User.objects.create_user(
            email="test@example.com",
            password="password123",
            first_name="John",
            last_name="Doe",
            role=User.ROLE_STUDENT,
        )
        self.assertEqual(user.email, "test@example.com")
        self.assertTrue(user.check_password("password123"))
        self.assertEqual(user.role, User.ROLE_STUDENT)
        self.assertEqual(str(user), "John Doe")

    def test_create_superuser(self):
        """Test superuser creation"""
        superuser = User.objects.create_superuser(
            email="admin@example.com", password="admin123"
        )
        self.assertTrue(superuser.is_staff)
        self.assertTrue(superuser.is_superuser)

    def test_user_email_required(self):
        """Ensure email is required"""
        with self.assertRaises(ValueError):
            User.objects.create_user(email="", password="password123")


class StudentModelTest(TestCase):
    def setUp(self):
        """Create a test user and student"""
        self.user = User.objects.create_user(
            email="student@example.com",
            password="password",
            first_name="Jane",
            last_name="Smith",
            role=User.ROLE_STUDENT,
        )
        self.student = Student.objects.create(user=self.user, student_number="S12345")

    def test_student_creation(self):
        """Test student creation"""
        self.assertEqual(self.student.user.email, "student@example.com")
        self.assertEqual(self.student.student_number, "S12345")
        self.assertEqual(str(self.student), "Jane Smith - S12345")


class TeacherModelTest(TestCase):
    def setUp(self):
        """Create a test user and teacher"""
        self.user = User.objects.create_user(
            email="teacher@example.com",
            password="password",
            first_name="Alice",
            last_name="Brown",
            role=User.ROLE_TEACHER,
        )
        self.teacher = Teacher.objects.create(user=self.user)

    def test_teacher_creation(self):
        """Test teacher creation"""
        self.assertEqual(self.teacher.user.email, "teacher@example.com")
        self.assertEqual(str(self.teacher), "Alice Brown")


class CourseModelTest(TestCase):
    def setUp(self):
        """Create a test teacher and course"""
        self.teacher_user = User.objects.create_user(
            email="teacher2@example.com",
            password="password",
            first_name="Tom",
            last_name="Hanks",
            role=User.ROLE_TEACHER,
        )
        self.teacher = Teacher.objects.create(user=self.teacher_user)
        self.course = Course.objects.create(name="Math 101", teacher=self.teacher)

    def test_course_creation(self):
        """Test course creation"""
        self.assertEqual(self.course.name, "Math 101")
        self.assertEqual(self.course.teacher.user.email, "teacher2@example.com")
        self.assertEqual(str(self.course), "Math 101")


class AssignmentModelTest(TestCase):
    def setUp(self):
        """Create a test course and assignment"""
        self.teacher_user = User.objects.create_user(
            email="teacher3@example.com",
            password="password",
            first_name="Mark",
            last_name="Johnson",
            role=User.ROLE_TEACHER,
        )
        self.teacher = Teacher.objects.create(user=self.teacher_user)
        self.course = Course.objects.create(name="Physics 101", teacher=self.teacher)
        self.assignment = Assignment.objects.create(
            name="Homework 1", course=self.course
        )

    def test_assignment_creation(self):
        """Test assignment creation"""
        self.assertEqual(self.assignment.name, "Homework 1")
        self.assertEqual(self.assignment.course.name, "Physics 101")
        self.assertEqual(str(self.assignment), "Homework 1")


class EnrollmentModelTest(TestCase):
    def setUp(self):
        """Set up test data for enrollment tests"""
        # Create a teacher
        self.teacher_user = User.objects.create_user(
            email="teacher@example.com",
            password="password",
            first_name="Alice",
            last_name="Brown",
            role=User.ROLE_TEACHER,
        )
        self.teacher = Teacher.objects.create(user=self.teacher_user)

        # Create a course assigned to the teacher
        self.course = Course.objects.create(name="Math 101", teacher=self.teacher)

        # Create a student
        self.student_user = User.objects.create_user(
            email="student@example.com",
            password="password",
            first_name="John",
            last_name="Doe",
            role=User.ROLE_STUDENT,
        )
        self.student = Student.objects.create(
            user=self.student_user, student_number="S12345"
        )

    def test_enrollment_creation(self):
        """Test successful student enrollment in a course"""
        enrollment = Enrollment.objects.create(student=self.student, course=self.course)

        self.assertEqual(enrollment.student, self.student)
        self.assertEqual(enrollment.course, self.course)
        self.assertEqual(str(enrollment), "John Doe - S12345 - Math 101")

    def test_duplicate_enrollment_not_allowed(self):
        """Test that duplicate enrollments are not allowed"""
        Enrollment.objects.create(student=self.student, course=self.course)

        with self.assertRaises(Exception):  # Django IntegrityError is expected
            Enrollment.objects.create(student=self.student, course=self.course)


class GradeModelTest(TestCase):
    def setUp(self):
        """Create a test student, enrollment, assignment, and grade"""
        self.student_user = User.objects.create_user(
            email="student3@example.com",
            password="password",
            first_name="Luke",
            last_name="Skywalker",
            role=User.ROLE_STUDENT,
        )
        self.student = Student.objects.create(
            user=self.student_user, student_number="S98765"
        )

        self.teacher_user = User.objects.create_user(
            email="teacher5@example.com",
            password="password",
            first_name="Darth",
            last_name="Vader",
            role=User.ROLE_TEACHER,
        )
        self.teacher = Teacher.objects.create(user=self.teacher_user)

        self.course = Course.objects.create(
            name="Lightsaber Combat", teacher=self.teacher
        )
        self.enrollment = Enrollment.objects.create(
            student=self.student, course=self.course
        )
        self.assignment = Assignment.objects.create(
            name="Duel Test", course=self.course
        )
        self.grade = Grade.objects.create(
            enrollment=self.enrollment, assignment=self.assignment, score=95.0
        )

    def test_grade_creation(self):
        """Test grade assignment"""
        self.assertEqual(
            self.grade.enrollment.student.user.email, "student3@example.com"
        )
        self.assertEqual(self.grade.assignment.name, "Duel Test")
        self.assertEqual(self.grade.score, 95.0)
        self.assertEqual(str(self.grade), "Luke Skywalker - Duel Test: 95.0")
