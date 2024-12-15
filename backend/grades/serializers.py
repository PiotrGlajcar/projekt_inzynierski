from rest_framework import serializers
from .models import Student, Grade, Course, User, Enrollment

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

class EnrollmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Enrollment
        fields = ['student', 'course']  # Adjust fields as necessary

    def validate(self, data):
        if Enrollment.objects.filter(student=data['student'], course=data['course']).exists():
            raise serializers.ValidationError("Student is already enrolled in this course.")
        return data
    
class GradeSerializer(serializers.ModelSerializer):
    student = StudentSerializer(read_only=True)
    course = CourseSerializer(read_only=True)

    class Meta:
        model = Grade
        fields = ['id', 'student', 'course', 'score', 'date_assigned']
        
    def validate(self, data):
        """
        Ensure that the score is within an acceptable range (e.g., 0 to 100).
        """
        if data['score'] < 0 or data['score'] > 100:
            raise serializers.ValidationError("Score must be between 0 and 100.")
        return data