from datetime import date
from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    """
    Represents a user in the system.

    Extends the Django AbstractUser model to include additional fields for role,
    USOS ID, and email.

    Attributes:
        role (str): The role of the user ('student', 'staff', or 'unknown').
        usos_id (str): The unique identifier for the user from the USOS system.
        email (str): The user's email address, which must be unique.

    Methods:
        __str__: Returns a string representation of the user.
        set_role: Sets the user's role based on their student_status and staff_status.
    """

    ROLE_CHOICES = (
        ('student', 'Student'),
        ('staff', 'Staff'),
        ('unknown', 'Unknown'),
    )
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='unknown')
    email = models.EmailField(unique=True, null=False)

    def __str__(self):
        return f"{self.first_name} {self.last_name} - {self.email})"

class Student(models.Model):
    """
    Represents a student in the system.

    Attributes:
        user (User): The associated User object.
        name (str): The student's first name.
        last_name (str): The student's last name.
        student_number (str): The student's unique number.

    Methods:
        __str__: Returns a string representation of the student using their USOS ID.
    """

    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="student")
    student_number = models.CharField(max_length=10, unique=True)

    def __str__(self):
        return f"{self.user.first_name} {self.user.last_name} - {self.student_number}"

class Staff(models.Model):
    """
    Represents a staff member in the system.

    Attributes:
        user (User): The associated User object.
        name (str): The staff member's first name.
        last_name (str): The staff member's last name.

    Methods:
        __str__: Returns a string representation of the staff member using their USOS ID.
    """

    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="staff")

    def __str__(self):
        return f"{self.user.first_name} {self.user.last_name}"

class Course(models.Model):
    """
    Represents a course in the system.
    """
    name = models.CharField(max_length=100)
    teacher = models.ForeignKey(
        Staff,                      # Links course to the teacher who created it
        on_delete=models.CASCADE, 
        related_name="courses"
    )

    def __str__(self):
        return f"{self.name}"

class Enrollment(models.Model):
    """
    Represents a student's enrollment in a course.
    """
    student = models.ForeignKey(
        Student, 
        on_delete=models.CASCADE, 
        related_name="enrollments"
    )
    course = models.ForeignKey(
        Course, 
        on_delete=models.CASCADE, 
        related_name="enrollments"
    )

    class Meta:
        unique_together = ("student", "course")  # Prevent duplicate enrollments

    def __str__(self):
        return f"{self.student.user.first_name} {self.student.user.last_name} - {self.course.name}"
    
class Grade(models.Model):
    """
    Represents a grade assigned to a student for a specific course.
    """
    enrollment = models.ForeignKey(
        Enrollment, 
        on_delete=models.CASCADE, 
        related_name="grades"
    )
    score = models.DecimalField(max_digits=5, decimal_places=2)
    date_assigned = models.DateField(auto_now_add=True)

    def __str__(self):
        return f"{self.enrollment.student.user.first_name} - {self.enrollment.course.name}: {self.score}"
