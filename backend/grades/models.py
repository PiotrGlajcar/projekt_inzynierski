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
    usos_id = models.CharField(max_length=50, unique=True)
    email = models.EmailField(unique=True, null=False)

    def __str__(self):
        return f"{self.username} ({self.role})"

    def set_role(self, student_status=None, staff_status=None):
        """
        Sets the user's role based on their student_status and staff_status.

        Args:
            student_status (int, optional): The status indicating if the user is a student.
            staff_status (int, optional): The status indicating if the user is staff.

        Returns:
            None
        """

        if staff_status == 2:
            self.role = 'staff'
        elif student_status == 2:
            self.role = 'student'
        else:
            self.role = 'unknown'
        self.save()

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
    name = models.CharField(max_length=100, null=True)
    last_name = models.CharField(max_length=100, null=True)
    student_number = models.CharField(max_length=10, null=True, unique=True)

    def __str__(self):
        return self.user.usos_id

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
    name = models.CharField(max_length=100, null=True)
    last_name = models.CharField(max_length=100, null=True)

    def __str__(self):
        return self.user.usos_id

class Course(models.Model):
    """
    Represents a course in the system.

    Attributes:
        course_name (str): The name of the course.
        course_code (str): The unique code of the course.
        description (str): The optional description of the course.

    Methods:
        __str__: Returns a string representation of the course name.
    """

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
