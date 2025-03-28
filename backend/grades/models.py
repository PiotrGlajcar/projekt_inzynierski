from typing import Optional

from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.db import models


class UserManager(BaseUserManager["User"]):
    """
    Custom manager for User model where email is the unique identifier.
    """

    def create_user(self, email: str, password: Optional[str] = None, **extra_fields):
        """Create and return a regular user with an email instead of username."""
        if not email:
            raise ValueError("The Email field must be set")
        email = self.normalize_email(email)
        extra_fields.setdefault("is_active", True)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(
        self, email: str, password: Optional[str] = None, **extra_fields
    ):
        """Create and return a superuser."""
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)

        if not extra_fields.get("is_staff"):
            raise ValueError("Superuser must have is_staff=True.")
        if not extra_fields.get("is_superuser"):
            raise ValueError("Superuser must have is_superuser=True.")

        return self.create_user(email, password, **extra_fields)


class User(AbstractUser):
    """
    Custom User model that removes username and uses email instead.
    """

    id = models.AutoField(primary_key=True)
    username = None
    email = models.EmailField(unique=True, db_index=True)

    ROLE_STUDENT = "student"
    ROLE_TEACHER = "teacher"
    ROLE_UNKNOWN = "unknown"

    ROLE_CHOICES = [
        (ROLE_STUDENT, "Student"),
        (ROLE_TEACHER, "Teacher"),
        (ROLE_UNKNOWN, "Unknown"),
    ]

    role = models.CharField(max_length=10, choices=ROLE_CHOICES)

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["first_name", "last_name"]

    objects: UserManager = UserManager()

    def __str__(self):
        return f"{self.first_name} {self.last_name}"


class Student(models.Model):
    """
    Represents a student in the system.

    Attributes:
        user (User): The associated User object.
        student_number (str): The student's unique number.
    """

    id = models.AutoField(primary_key=True)
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="student")
    student_number = models.CharField(max_length=10, unique=True, db_index=True)

    def __str__(self):
        return f"{self.user.first_name} {self.user.last_name} - {self.student_number}"


class Teacher(models.Model):
    """
    Represents a teacher in the system.

    Attributes:
        user (User): The associated User object.
    """

    id = models.AutoField(primary_key=True)
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="teacher")

    def __str__(self):
        return f"{self.user.first_name} {self.user.last_name}"


class Course(models.Model):
    """
    Represents a course in the system.
    """

    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100, db_index=True)
    description = models.TextField(default="No description provided.")
    teacher = models.ForeignKey(
        Teacher, on_delete=models.CASCADE, related_name="courses"
    )

    def __str__(self):
        return f"{self.name}"


class Assignment(models.Model):

    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100, db_index=True)
    description = models.TextField(blank=True, null=True)
    weight = models.CharField(max_length=5, default="100")
    is_mandatory = models.BooleanField(default=True)
    course = models.ForeignKey(
        Course, on_delete=models.CASCADE, related_name="assignments"
    )

    def __str__(self):
        return f"{self.name}"


class Enrollment(models.Model):
    """
    Represents a student's enrollment in a course.
    """

    id = models.AutoField(primary_key=True)
    student = models.ForeignKey(
        Student, on_delete=models.CASCADE, related_name="enrollments"
    )
    course = models.ForeignKey(
        Course, on_delete=models.CASCADE, related_name="enrollments"
    )

    class Meta:
        unique_together = ("student", "course")

    def __str__(self):
        return f"{self.student} - {self.course}"


class Grade(models.Model):
    """
    Represents a grade assigned to a student for a specific course.
    """

    id = models.AutoField(primary_key=True)
    enrollment = models.ForeignKey(
        Enrollment, on_delete=models.CASCADE, related_name="grades"
    )
    assignment = models.ForeignKey(
        Assignment, on_delete=models.CASCADE, related_name="grades"
    )
    score = models.DecimalField(max_digits=5, decimal_places=2)
    date_assigned = models.DateField(auto_now_add=True)

    def __str__(self):
        return f"{self.enrollment.student.user.first_name} {self.enrollment.student.user.last_name} - {self.assignment.name}: {self.score}"
