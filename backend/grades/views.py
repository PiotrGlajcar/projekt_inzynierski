from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from rest_framework.request import Request
from django.http import JsonResponse
from .models import User, Student, Teacher, Course, Enrollment, Grade, Assignment, RequiredGrade, Group
from .serializers import (
    UserSerializer,
    StudentSerializer,
    TeacherSerializer,
    CourseSerializer,
    EnrollmentSerializer,
    GradeSerializer,
    AssignmentSerializer,
    RequiredGradeSerializer,
    GroupSerializer,
)
from oauth.utils.responses import api_response

def handle_options(request):
    response = JsonResponse({})
    response["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS"
    response["Access-Control-Allow-Headers"] = "Content-Type, Authorization"
    return response

# User Views

@api_view(['GET'])
def users_me(request):
    """
    Returns the logged-in user's details, including role-specific data.
    """
    user = request.user
    serializer = UserSerializer(user)
    return api_response(
        status="success",
        message="User data retrieved successfully",
        data=serializer.data,
        status_code=200,
    )

class UserListCreateView(generics.ListCreateAPIView):
    """
    List all users.
    """
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def list(self, request, *args, **kwargs):
        """
        List all users.
        """
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return api_response(
            status="success",
            message="Users retrieved successfully.",
            data=serializer.data,
            status_code=200
        )

    def create(self, request, *args, **kwargs):
        """
        Create a new user.
        """
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return api_response(
                status="success",
                message="User created successfully.",
                data=serializer.data,
                status_code=201
            )
        return api_response(
            status="error",
            message="Invalid user data.",
            data=serializer.errors,
            status_code=400
        )

class UserDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    Retrieve details of a specific user.
    """
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return api_response(
            status="success",
            message="User retrieved successfully.",
            data=serializer.data,
            status_code=200
        )
    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return api_response(
                status="success",
                message="User updated successfully.",
                data=serializer.data,
                status_code=200
            )
        return api_response(
            status="error",
            message="Invalid user data.",
            data=serializer.errors,
            status_code=400
        )
    def destroy(self, request, *args, **kwargs):
        """
        Delete a specific user.
        """
        instance = self.get_object()
        self.perform_destroy(instance)
        return api_response(
            status="success",
            message="User deleted successfully.",
            status_code=204
        )

# Student Views
class StudentListCreateView(generics.ListCreateAPIView):
    """
    List all students or create a new student.
    """
    queryset = Student.objects.select_related('user').all()
    serializer_class = StudentSerializer

    def list(self, request, *args, **kwargs):
        """
        List all students with a standardized response.
        """
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return api_response(
            status="success",
            message="Students retrieved successfully.",
            data=serializer.data,
            status_code=200
        )

    def create(self, request, *args, **kwargs):
        """
        Create a new student with a standardized response.
        """
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return api_response(
                status="success",
                message="Student created successfully.",
                data=serializer.data,
                status_code=201
            )
        return api_response(
            status="error",
            message="Invalid student data.",
            data=serializer.errors,
            status_code=400
        )   

class StudentDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    Retrieve, update, or delete a specific student.
    """
    queryset = Student.objects.select_related('user').all()
    serializer_class = StudentSerializer

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return api_response(
            status="success",
            message="Student retrieved successfully.",
            data=serializer.data,
            status_code=200
        )

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', True)  # Support partial updates
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        if serializer.is_valid():
            serializer.save()
            return api_response(
                status="success",
                message="Student updated successfully.",
                data=serializer.data,
                status_code=200
            )
        return api_response(
            status="error",
            message="Invalid student data.",
            data=serializer.errors,
            status_code=400
        )

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        return api_response(
            status="success",
            message="Student deleted successfully.",
            status_code=204
        )

# Teacher Views
class TeacherListView(generics.ListAPIView):
    """
    List all teachers with search and filtering functionality.
    """
    queryset = Teacher.objects.select_related('user').all()
    serializer_class = TeacherSerializer
    
    def list(self, request, *args, **kwargs):
        """
        List all teachers with a standardized response.
        """
        queryset = self.filter_queryset(self.get_queryset())
        serializer = self.get_serializer(queryset, many=True)
        return api_response(
            status="success",
            message="Teachers retrieved successfully.",
            data=serializer.data,
            status_code=200
        )

class TeacherDetailView(generics.RetrieveUpdateAPIView):
    """
    Retrieve, update, or delete a specific teacher.
    """
    queryset = Teacher.objects.select_related('user').all()
    serializer_class = TeacherSerializer

    def retrieve(self, request, *args, **kwargs):
        """
        Retrieve details of a specific teacher.
        """
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return api_response(
            status="success",
            message="Teacher retrieved successfully.",
            data=serializer.data,
            status_code=200
        )

    def update(self, request, *args, **kwargs):
        """
        Update a specific teacher.
        """
        partial = kwargs.pop('partial', True)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        if serializer.is_valid():
            serializer.save()
            return api_response(
                status="success",
                message="Teacher updated successfully.",
                data=serializer.data,
                status_code=200
            )
        return api_response(
            status="error",
            message="Invalid teacher data.",
            data=serializer.errors,
            status_code=400
        )

# Course Views
class CourseListCreateView(generics.ListCreateAPIView):
    """
    List all courses or create a new course.
    """
    queryset = Course.objects.select_related('teacher').all()
    serializer_class = CourseSerializer

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return api_response(
            status="success",
            message="Courses retrieved successfully.",
            data=serializer.data,
            status_code=200
        )

    def create(self, request, *args, **kwargs):
        """
        Create a new course with a standardized response.
        """
        serializer = self.get_serializer(data=request.data)
        
        if serializer.is_valid():
            serializer.save()
            return api_response(
                status="success",
                message="Course created successfully.",
                data=serializer.data,
                status_code=201
            )
        return api_response(
            status="error",
            message="Invalid course data.",
            data=serializer.errors,
            status_code=400
        )

class CourseDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    Retrieve, update, or delete a specific course.
    """
    queryset = Course.objects.select_related('teacher').all()
    serializer_class = CourseSerializer

    def retrieve(self, request, *args, **kwargs):
        """
        Retrieve a specific course with a standardized response.
        """
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return api_response(
            status="success",
            message="Course retrieved successfully.",
            data=serializer.data,
            status_code=200
        )

    def update(self, request, *args, **kwargs):
        """
        Update a specific course with a standardized response.
        """
        partial = kwargs.pop('partial', True)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        if serializer.is_valid():
            serializer.save()
            return api_response(
                status="success",
                message="Course updated successfully.",
                data=serializer.data,
                status_code=200
            )

            
            serializer.save()
            return api_response(
                status="success",
                message="Course updated successfully.",
                data=serializer.data,
                status_code=200
            )
        return api_response(
            status="error",
            message="Invalid course data.",
            data=serializer.errors,
            status_code=400
        )

    def destroy(self, request, *args, **kwargs):
        """
        Delete a specific course with a standardized response.
        """
        instance = self.get_object()
        self.perform_destroy(instance)
        return api_response(
            status="success",
            message="Course deleted successfully.",
            status_code=204
        )

# Grade Views
class GradeListCreateView(generics.ListCreateAPIView):
    """
    List all grades or create a new grade.
    """
    queryset = Grade.objects.select_related('enrollment', 'assignment').all()
    serializer_class = GradeSerializer

    def list(self, request, *args, **kwargs):
        """
        List all grades with detailed information.
        """
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return api_response(
            status="success",
            message="Grades retrieved successfully.",
            data=serializer.data,
            status_code=200
        )

    def create(self, request, *args, **kwargs):
        """
        Create a new grade with error handling.
        """
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            try:
                serializer.save()
                return api_response(
                    status="success",
                    message="Grade created successfully.",
                    data=serializer.data,
                    status_code=201
                )
            except Exception as e:
                return api_response(
                    status="error",
                    message="Failed to create grade.",
                    data={"error": str(e)},
                    status_code=400
                )
        return api_response(
            status="error",
            message="Invalid grade data.",
            data=serializer.errors,
            status_code=400
        )

class GradeDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    Retrieve, update, or delete a specific grade.
    """
    queryset = Grade.objects.select_related('enrollment', 'assignment').all()
    serializer_class = GradeSerializer

    def retrieve(self, request, *args, **kwargs):
        """
        Retrieve a specific grade.
        """
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return api_response(
            status="success",
            message="Grade retrieved successfully.",
            data=serializer.data,
            status_code=200
        )

    def update(self, request, *args, **kwargs):
        """
        Update a specific grade.
        """
        partial = kwargs.pop('partial', True)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        if serializer.is_valid():
            serializer.save()
            return api_response(
                status="success",
                message="Grade updated successfully.",
                data=serializer.data,
                status_code=200
            )
        return api_response(
            status="error",
            message="Invalid grade data.",
            data=serializer.errors,
            status_code=400
        )

    def destroy(self, request, *args, **kwargs):
        """
        Delete a specific grade.
        """
        instance = self.get_object()
        self.perform_destroy(instance)
        return api_response(
            status="success",
            message="Grade deleted successfully.",
            status_code=204
        )

# Assignment Views
class AssignmentListCreateView(generics.ListCreateAPIView):
    """
    List all assignments or create a new assignment.
    """
    queryset = Assignment.objects.select_related('course').all()
    serializer_class = AssignmentSerializer

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return api_response(
            status="success",
            message="Assignments retrieved successfully.",
            data=serializer.data,
            status_code=200
        )

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return api_response(
                status="success",
                message="Assignment created successfully.",
                data=serializer.data,
                status_code=201
            )
        return api_response(
            status="error",
            message="Invalid assignment data.",
            data=serializer.errors,
            status_code=400
        )


class AssignmentDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    Retrieve, update, or delete a specific assignment.
    """
    queryset = Assignment.objects.select_related('course').all()
    serializer_class = AssignmentSerializer

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return api_response(
            status="success",
            message="Assignment retrieved successfully.",
            data=serializer.data,
            status_code=200
        )

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', True)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        if serializer.is_valid():
            serializer.save()
            return api_response(
                status="success",
                message="Assignment updated successfully.",
                data=serializer.data,
                status_code=200
            )
        return api_response(
            status="error",
            message="Invalid assignment data.",
            data=serializer.errors,
            status_code=400
        )

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        return api_response(
            status="success",
            message="Assignment deleted successfully.",
            status_code=204
        )

# Enrollment Views
class EnrollmentListCreateView(generics.ListCreateAPIView):
    """
    List all enrollments or create a new enrollment.
    """
    queryset = Enrollment.objects.all()
    serializer_class = EnrollmentSerializer

    def list(self, request, *args, **kwargs):
        """
        List all enrollments with a standardized response.
        """
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return api_response(
            status="success",
            message="Enrollments retrieved successfully.",
            data=serializer.data,
            status_code=200
        )

    def create(self, request, *args, **kwargs):
        """
        Create a new enrollment with a standardized response.
        """
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return api_response(
                status="success",
                message="Enrollment created successfully.",
                data=serializer.data,
                status_code=201
            )
        return api_response(
            status="error",
            message="Invalid enrollment data.",
            data=serializer.errors,
            status_code=400
        )


class EnrollmentDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    Retrieve, update, or delete a specific enrollment.
    """
    queryset = Enrollment.objects.select_related('student', 'course').all()
    serializer_class = EnrollmentSerializer

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return api_response(
            status="success",
            message="Enrollment retrieved successfully.",
            data=serializer.data,
            status_code=200
        )

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', True)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        if serializer.is_valid():
            serializer.save()
            return api_response(
                status="success",
                message="Enrollment updated successfully.",
                data=serializer.data,
                status_code=200
            )
        return api_response(
            status="error",
            message="Invalid enrollment data.",
            data=serializer.errors,
            status_code=400
        )

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        return api_response(
            status="success",
            message="Enrollment deleted successfully.",
            status_code=204
        )

# Required Grade Views
class RequiredGradeListCreateView(generics.ListCreateAPIView):
    """
    List all required grades or create a new required grade.
    """
    queryset = RequiredGrade.objects.select_related('enrollment', 'assignment').all()
    serializer_class = RequiredGradeSerializer

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return api_response(
            status="success",
            message="Required grades retrieved successfully.",
            data=serializer.data,
            status_code=200
        )

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            # Validate enrollment and assignment exist
            enrollment_id = serializer.validated_data['enrollment'].id
            assignment_id = serializer.validated_data['assignment'].id

            if not Enrollment.objects.filter(id=enrollment_id).exists():
                return api_response(
                    status="error",
                    message="The specified enrollment does not exist.",
                    status_code=400
                )
            if not Assignment.objects.filter(id=assignment_id).exists():
                return api_response(
                    status="error",
                    message="The specified assignment does not exist.",
                    status_code=400
                )

            serializer.save()
            return api_response(
                status="success",
                message="Required grade created successfully.",
                data=serializer.data,
                status_code=201
            )
        return api_response(
            status="error",
            message="Invalid required grade data.",
            data=serializer.errors,
            status_code=400
        )

class RequiredGradeDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    Retrieve, update, or delete a specific required grade.
    """
    queryset = RequiredGrade.objects.select_related('enrollment', 'assignment').all()
    serializer_class = RequiredGradeSerializer

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return api_response(
            status="success",
            message="Required grade retrieved successfully.",
            data=serializer.data,
            status_code=200
        )

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', True)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        if serializer.is_valid():
            serializer.save()
            return api_response(
                status="success",
                message="Required grade updated successfully.",
                data=serializer.data,
                status_code=200
            )
        return api_response(
            status="error",
            message="Invalid required grade data.",
            data=serializer.errors,
            status_code=400
        )

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        return api_response(
            status="success",
            message="Required grade deleted successfully.",
            status_code=204
        )

# Group Views
class GroupListCreateView(generics.ListCreateAPIView):
    """
    List all groups or create a new group.
    """
    queryset = Group.objects.select_related('course').prefetch_related('students').all()
    serializer_class = GroupSerializer

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return api_response(
            status="success",
            message="Groups retrieved successfully.",
            data=serializer.data,
            status_code=200
        )

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return api_response(
                status="success",
                message="Group created successfully.",
                data=serializer.data,
                status_code=201
            )
        return api_response(
            status="error",
            message="Invalid group data.",
            data=serializer.errors,
            status_code=400
        )


class GroupDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    Retrieve, update, or delete a specific group.
    """
    queryset = Group.objects.select_related('course').prefetch_related('students').all()
    serializer_class = GroupSerializer

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return api_response(
            status="success",
            message="Group retrieved successfully.",
            data=serializer.data,
            status_code=200
        )

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        if serializer.is_valid():
            serializer.save()
            return api_response(
                status="success",
                message="Group updated successfully.",
                data=serializer.data,
                status_code=200
            )
        return api_response(
            status="error",
            message="Invalid group data.",
            data=serializer.errors,
            status_code=400
        )

    def delete(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        return api_response(
            status="success",
            message="Group deleted successfully.",
            status_code=204
        )
