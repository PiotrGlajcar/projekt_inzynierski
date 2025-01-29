from rest_framework import serializers
from .models import User, Student, Teacher, Course, Enrollment, Grade, Assignment

class UserSerializer(serializers.ModelSerializer):
    student_id = serializers.SerializerMethodField()
    class Meta:
        model = User
        fields = ["id", "student_id", "first_name", "last_name",  "email", "role"]
        
    def get_student_id(self, obj):
        """Returns the student's ID if the user is a student."""
        if obj.role == "student" and hasattr(obj, "student"):
            return obj.student.id
        return None

class StudentSerializer(serializers.ModelSerializer):
    user = UserSerializer()
    grades = serializers.SerializerMethodField()

    class Meta:
        model = Student
        fields = ['id', 'student_number', 'user', 'grades']

    def get_grades(self, obj):
        """
        Retrieve grades for the student's enrollment in the course.
        """
        course = self.context.get('course')
        if not course:
            return None
        
        enrollments = obj.enrollments.filter(course=course).prefetch_related("grades__assignment")
        grades = []

        for enrollment in enrollments:
            for grade in enrollment.grades.filter(assignment__course=course):
                grades.append({
                    "grade_id": grade.id,
                    "assignment_id": grade.assignment.id,
                    "assignment_name": grade.assignment.name,
                    "score": grade.score,
                })
        
        return grades
    
    def create(self, validated_data):
        user_data = validated_data.pop('user', {})
        user = User.objects.create(**user_data)
        student = Student.objects.create(user=user, **validated_data)
        return student

    def update(self, instance, validated_data):
        # Extract nested user data
        user_data = validated_data.pop('user', {})
        user = instance.user

        # Update user fields
        for field, value in user_data.items():
            setattr(user, field, value)
        user.save()

        # Update student fields
        for field, value in validated_data.items():
            setattr(instance, field, value)
        instance.save()

        return instance


class TeacherSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(source='user.email', required=False)
    first_name = serializers.CharField(source='user.first_name', required=False)
    last_name = serializers.CharField(source='user.last_name', required=False)

    class Meta:
        model = Teacher
        fields = ['id', 'email', 'first_name', 'last_name']

    def validate(self, data):
        # Validate email uniqueness if provided
        user_data = data.get('user', {})
        email = user_data.get('email')

        if email and User.objects.filter(email=email).exists():
            raise serializers.ValidationError({"email": "This email is already in use."})

        return data

    def update(self, instance, validated_data):
        """
        Update related User fields and save the Teacher instance.
        """
        user_data = validated_data.pop('user', {})
        user = instance.user

        # Update User fields
        for field, value in user_data.items():
            setattr(user, field, value)
        user.save()

        # Save the Teacher instance
        instance.save()
        return instance

class CourseSerializer(serializers.ModelSerializer):
    """
    Serializer for the Course model.
    """
    teacher = serializers.PrimaryKeyRelatedField(queryset=Teacher.objects.all())
    assignments = serializers.SerializerMethodField()
    students = serializers.SerializerMethodField()

    class Meta:
        model = Course
        fields = ['id', 'name', 'description', 'teacher', 'assignments', 'students']

    def get_assignments(self, obj):
        """
        Dynamically include assignments based on the context.
        """
        include = self.context.get("include", [])
        if "assignments" in include:
            assignments = obj.assignments.all()
            return AssignmentSerializer(assignments, many=True).data
        return None
    
    def get_students(self, obj):
        """
        Dynamically include students and their grades based on the context.
        """
        include = self.context.get("include", [])
        if "students" in include:
            enrollments = obj.enrollments.prefetch_related("student__user", "grades__assignment").all()
            students = [enrollment.student for enrollment in enrollments]
            return StudentSerializer(students, many=True, context={"course": obj}).data
        return None
    
    def create(self, validated_data):
        """
        Create a new course instance.
        """
        return Course.objects.create(**validated_data)
    
    def update(self, instance, validated_data):
        # Update the fields dynamically
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()  # Save to the database
        return instance
    
    

class AssignmentSerializer(serializers.ModelSerializer):
    """
    Serializer for the Assignment model.
    """
    #course_id = serializers.IntegerField(write_only=True)
    class Meta:
        model = Assignment
        fields = ['id', 'name', 'description', 'weight', 'is_mandatory']

    def create(self, validated_data):
        course_id = validated_data.pop('course_id')  # Retrieve the course_id
        course = Course.objects.get(id=course_id)    # Get the Course object
        return Assignment.objects.create(course=course, **validated_data)
    
class EnrollmentSerializer(serializers.ModelSerializer):
    course_id = serializers.IntegerField()
    course_id = serializers.IntegerField()
    course_name = serializers.CharField(source='course.name', read_only=True)
    student_id = serializers.IntegerField()
    student_id = serializers.IntegerField()
    student_name = serializers.SerializerMethodField()

    class Meta:
        model = Enrollment
        fields = ['id', 'student_id', 'student_name', 'course_id', 'course_name']

    def get_student_name(self, obj):
        return f"{obj.student.user.first_name} {obj.student.user.last_name}"

    def validate(self, data):
        student_id = data.get('student_id')
        course_id = data.get('course_id')

        # Fetch the student and course
        student = Student.objects.filter(id=student_id).first()
        course = Course.objects.filter(id=course_id).first()

        if not student:
            raise serializers.ValidationError({"student_id": "The specified student does not exist."})
        if not course:
            raise serializers.ValidationError({"course_id": "The specified course does not exist."})

        # Prevent duplicate enrollment
        if self.instance:
            # Check for duplicates when updating
            if Enrollment.objects.filter(student=student, course=course).exclude(id=self.instance.id).exists():
                raise serializers.ValidationError("This student is already enrolled in this course.")
        else:
            # Check for duplicates when creating
            if Enrollment.objects.filter(student=student, course=course).exists():
                raise serializers.ValidationError("This student is already enrolled in this course.")


        # Attach objects to validated data
        data['student'] = student
        data['course'] = course

        return data

    def create(self, validated_data):
        # Use the attached objects from validate
        student = validated_data.pop('student')
        course = validated_data.pop('course')
        return Enrollment.objects.create(student=student, course=course, **validated_data)
    
    def update(self, instance, validated_data):
        # Update course if provided
        course = validated_data.pop('course', None)
        if course:
            instance.course = course

        # Update students if provided
        students = validated_data.pop('students', None)
        if students is not None:
            instance.students.set(students)

        # Update non-relational fields (only if explicitly provided)
        for attr, value in validated_data.items():
            if value is not None:  # Avoid overwriting fields with None
                setattr(instance, attr, value)

        # Save and return the updated instance
        instance.save()
        return instance


class GradeSerializer(serializers.ModelSerializer):
    enrollment_id = serializers.IntegerField(required=False)
    assignment_id = serializers.IntegerField(required=False)
    student_name = serializers.SerializerMethodField(read_only=True)
    course_name = serializers.SerializerMethodField(read_only=True)
    assignment_name = serializers.CharField(source='assignment.name', read_only=True)

    class Meta:
        model = Grade
        fields = ['id', 'enrollment_id', 'assignment_id', 'assignment_name', 'score', 'date_assigned', 'student_name', 'course_name']

    def get_student_name(self, obj):
        return f"{obj.enrollment.student.user.first_name} {obj.enrollment.student.user.last_name}"

    def get_course_name(self, obj):
        return obj.enrollment.course.name

    def validate(self, data):
        enrollment_id = data.get('enrollment_id')
        assignment_id = data.get('assignment_id')

        # Only validate enrollment_id if it is provided
        if enrollment_id:
            enrollment = Enrollment.objects.filter(id=enrollment_id).first()
            if not enrollment:
                raise serializers.ValidationError({"enrollment_id": "The specified enrollment does not exist."})

        # Only validate assignment_id if it is provided
        if assignment_id:
            assignment = Assignment.objects.filter(id=assignment_id).first()
            if not assignment:
                raise serializers.ValidationError({"assignment_id": "The specified assignment does not exist."})

        # Ensure the assignment belongs to the same course as the enrollment
        if enrollment_id and assignment_id:
            enrollment = Enrollment.objects.get(id=enrollment_id)
            assignment = Assignment.objects.get(id=assignment_id)
            if assignment.course != enrollment.course:
                raise serializers.ValidationError("The assignment does not belong to the course in the enrollment.")

        return data

    def create(self, validated_data):
        # Fetch and attach the Enrollment object
        enrollment_id = validated_data.pop('enrollment_id')
        enrollment = Enrollment.objects.get(id=enrollment_id)

        # Fetch and attach the Assignment object
        assignment_id = validated_data.pop('assignment_id')
        assignment = Assignment.objects.get(id=assignment_id)

        # Create the Grade object
        return Grade.objects.create(enrollment=enrollment, assignment=assignment, **validated_data)
    