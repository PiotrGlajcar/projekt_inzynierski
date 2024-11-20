from django.db import models
from datetime import date
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    ROLE_CHOICES = (
        ('student', 'Student'),
        ('teacher', 'Teacher'),
    )
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='student')
    usos_id = models.CharField(max_length=50, unique=True, null=True, blank=True)
    email = models.EmailField(unique=True, null=True, blank=True)  # Optional for email storage

    def __str__(self):
        return f"{self.username} ({self.role})"


class Student(models.Model):

    usos_id = models.CharField(max_length=255, unique=True, null=True, blank=True)
    name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    enrollment_number = models.CharField(max_length=50, unique=True)

    def __str__(self) -> str:
        return str(self.name)


class Course(models.Model):

    course_name = models.CharField(max_length=100)
    course_code = models.CharField(max_length=20, unique=True)
    description = models.TextField(blank=True, null=True)

    def __str__(self) -> str:
        return str(self.course_name)


class Grade(models.Model):
    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name="grades")
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name="grades")
    score = models.DecimalField(max_digits=5, decimal_places=2)
    date_assigned = models.DateField(default=date.today)

    def __str__(self):
        return f"{self.student.name} - {self.course.course_name}: {self.score}"
