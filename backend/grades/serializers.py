from rest_framework import serializers
from .models import User, Student, Teacher, Course, Enrollment, Grade, Assignment, RequiredGrade, Group

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
    first_name = serializers.CharField(source='user.first_name', required=False)
    last_name = serializers.CharField(source='user.last_name', required=False)
    email = serializers.EmailField(source='user.email', required=False)
    student_number = serializers.CharField(required=False)

    class Meta:
        model = Student
        fields = ['id', 'first_name', 'last_name', 'email', 'student_number']

    def create(self, validated_data):
        user_data = validated_data.pop('user', {})
        user = User.objects.create(**user_data)  # Create the User instance
        student = Student.objects.create(user=user, **validated_data)  # Create the Student instance
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
    teacher = serializers.PrimaryKeyRelatedField(queryset=Teacher.objects.all())

    class Meta:
        model = Course
        fields = ['id', 'name', 'teacher']

    def create(self, validated_data):
        """
        Create a new course, ensuring the teacher exists.
        """
        teacher = validated_data.get("teacher")
        if not Teacher.objects.filter(id=teacher.id).exists():
            raise serializers.ValidationError("The specified teacher does not exist.")
        return Course.objects.create(**validated_data)
    

class AssignmentSerializer(serializers.ModelSerializer):
    course_name = serializers.CharField(source="course.name", read_only=True)
    class Meta:
        model = Assignment
        fields = ['id', 'name', 'description', 'course', 'course_name', 'is_mandatory']

    def validate_course(self, value):
        if not Course.objects.filter(id=value.id).exists():
            raise serializers.ValidationError("The specified course does not exist.")
        return value

class EnrollmentSerializer(serializers.ModelSerializer):
    course_id = serializers.IntegerField(write_only=True)
    course_name = serializers.CharField(source='course.name', read_only=True)
    student_id = serializers.IntegerField(write_only=True)
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
    enrollment_id = serializers.IntegerField(write_only=True)
    assignment_id = serializers.IntegerField(write_only=True)
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

        enrollment = Enrollment.objects.filter(id=enrollment_id).first()
        assignment = Assignment.objects.filter(id=assignment_id).first()

        if not enrollment:
            raise serializers.ValidationError({"enrollment_id": "The specified enrollment does not exist."})
        if not assignment:
            raise serializers.ValidationError({"assignment_id": "The specified assignment does not exist."})

        if assignment.course != enrollment.course:
            raise serializers.ValidationError("The assignment does not belong to the course in the enrollment.")

        # Attach objects to validated data
        data['enrollment'] = enrollment
        data['assignment'] = assignment

        return data

    def create(self, validated_data):
        enrollment = validated_data.pop('enrollment')
        assignment = validated_data.pop('assignment')
        return Grade.objects.create(enrollment=enrollment, assignment=assignment, **validated_data)
    
class RequiredGradeSerializer(serializers.ModelSerializer):
    enrollment_id = serializers.IntegerField(source='enrollment.id', write_only=True)
    assignment_id = serializers.IntegerField(source='assignment.id', write_only=True)
    enrollment = EnrollmentSerializer(read_only=True)
    assignment = AssignmentSerializer(read_only=True)

    class Meta:
        model = RequiredGrade
        fields = ['id', 'enrollment_id', 'assignment_id', 'enrollment', 'assignment']

    def create(self, validated_data):
        enrollment_id = validated_data.pop('enrollment')['id']
        assignment_id = validated_data.pop('assignment')['id']

        # Fetch the related enrollment and assignment
        enrollment = Enrollment.objects.filter(id=enrollment_id).first()
        assignment = Assignment.objects.filter(id=assignment_id).first()

        if not enrollment:
            raise serializers.ValidationError("The specified enrollment does not exist.")
        if not assignment:
            raise serializers.ValidationError("The specified assignment does not exist.")

        return RequiredGrade.objects.create(enrollment=enrollment, assignment=assignment)
        
class GroupSerializer(serializers.ModelSerializer):
    course_id = serializers.IntegerField(write_only=True)
    student_ids = serializers.ListField(
        child=serializers.IntegerField(), write_only=True
    )
    course = CourseSerializer(read_only=True)
    students = StudentSerializer(many=True, read_only=True)

    class Meta:
        model = Group
        fields = ['id', 'name', 'course_id', 'student_ids', 'course', 'students']

    def validate(self, data):
        course_id = data.get('course_id')
        student_ids = data.get('student_ids')

        # Validate course existence
        course = Course.objects.filter(id=course_id).first()
        if not course:
            raise serializers.ValidationError({"course_id": "The specified course does not exist."})

        # Validate students in bulk
        students = Student.objects.filter(id__in=student_ids)
        if students.count() != len(student_ids):
            non_existent = set(student_ids) - set(students.values_list('id', flat=True))
            raise serializers.ValidationError({
                "student_ids": f"The following students do not exist: {list(non_existent)}"
            })

        # Attach validated objects to data
        data['course'] = course
        data['students'] = students

        return data

    def create(self, validated_data):
        course = validated_data.pop('course')
        students = validated_data.pop('students')

        group = Group.objects.create(course=course, **validated_data)
        group.students.set(students)
        return group

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
