from rest_framework import serializers
from .models import Student, Grade, Course, User

class UserSerializer(serializers.ModelSerializer):
    student_number = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ["id", "email", "role", "first_name", "last_name", "student_number"]
    def get_student_number(self, obj):
        if obj.role == "student" and hasattr(obj, "student"):
            return obj.student.student_number
        return None

class StudentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Student
        fields = '__all__'

class CourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = '__all__'

class GradeSerializer(serializers.ModelSerializer):
    student = StudentSerializer(read_only=True)
    course = CourseSerializer(read_only=True)

    class Meta:
        model = Grade
        fields = ['id', 'student', 'course', 'score', 'date_assigned']
        