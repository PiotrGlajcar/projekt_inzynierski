from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from rest_framework.request import Request
from django.http import JsonResponse
from .models import User, Student, Teacher, Course, Enrollment, Grade, Assignment
from .serializers import (
    UserSerializer,
    StudentSerializer,
    TeacherSerializer,
    CourseSerializer,
    EnrollmentSerializer,
    GradeSerializer,
    AssignmentSerializer
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
    queryset = Course.objects.select_related('teacher').prefetch_related("assignments")
    serializer_class = CourseSerializer

    def get_serializer_context(self):
        """
        Add 'include' query parameter to the serializer context.
        """
        context = super().get_serializer_context()
        if isinstance(self.request, Request):
            context["include"] = self.request.query_params.getlist("include")
        else:
            context["include"] = self.request.GET.getlist("include")
        return context
        
    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True, context={"include": request.query_params.getlist("include")})
        return api_response(
            status="success",
            message="Courses retrieved successfully.",
            data=serializer.data,
            status_code=200,
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
    queryset = Course.objects.select_related("teacher").prefetch_related("assignments", "enrollments__student__user", "enrollments__grades__assignment")
    serializer_class = CourseSerializer

    def get_serializer_context(self):
        """
        Add 'include' query parameter to the serializer context.
        """
        context = super().get_serializer_context()
        if isinstance(self.request, Request):
            context["include"] = self.request.query_params.getlist("include")
        else:
            context["include"] = self.request.GET.getlist("include")
        return context

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
    queryset = Enrollment.objects.select_related("student", "course").all()
    serializer_class = EnrollmentSerializer

    def get_object(self):
        """
        Override get_object to support querying by student_id and course_id.
        """
        queryset = self.get_queryset()
        student_id = self.request.query_params.get('student_id')
        course_id = self.request.query_params.get('course_id')

        if student_id and course_id:
            try:
                return queryset.get(student_id=student_id, course_id=course_id)
            except Enrollment.DoesNotExist:
                raise serializers.ValidationError(
                    {"detail": "Enrollment not found for the given student_id and course_id."}
                )
        return super().get_object()
    
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
            status_code=200,
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
    
    def destroy(self, request, *args, **kwargs):
        """
        Delete an enrollment based on student_id and course_id query parameters.
        """
        student_id = request.query_params.get("student_id")
        course_id = request.query_params.get("course_id")

        if not student_id or not course_id:
            return api_response(
                status="error",
                message="Missing student_id or course_id query parameters.",
                status_code=400,
            )

        try:
            enrollment = Enrollment.objects.get(student_id=student_id, course_id=course_id)
            enrollment.delete()
            return api_response(
                status="success",
                message="Enrollment deleted successfully.",
                status_code=204,
            )
        except Enrollment.DoesNotExist:
            return api_response(
                status="error",
                message="Enrollment not found.",
                status_code=404,
            )

class EnrollmentDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    Retrieve, update, or delete a specific enrollment.
    """
    queryset = Enrollment.objects.select_related('student', 'course').all()
    serializer_class = EnrollmentSerializer

    def get_object(self):
        """
        Override get_object to support querying by student_id and course_id.
        """
        queryset = self.get_queryset()
        student_id = self.request.query_params.get('student_id')
        course_id = self.request.query_params.get('course_id')

        if student_id and course_id:
            try:
                return queryset.get(student_id=student_id, course_id=course_id)
            except Enrollment.DoesNotExist:
                raise serializers.ValidationError(
                    {"detail": "Enrollment not found for the given student_id and course_id."}
                )
        raise serializers.ValidationError(
            {"detail": "Both student_id and course_id must be provided."}
        )
    
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
