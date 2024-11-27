from rest_framework.decorators import api_view
from rest_framework.request import Request
from oauth.utils import api_response
from .models import Student, Course, Grade
from .serializers import StudentSerializer, CourseSerializer, GradeSerializer

@api_view(['GET', 'POST'])
def student_list(request):
    """
    Handles listing all students (GET) or creating a new student (POST).
    """
    if request.method == 'GET':
        students = Student.objects.all()
        serializer = StudentSerializer(students, many=True)
        return api_response(
            status="success",
            message="Students retrieved successfully",
            data=serializer.data,
            status_code=200
        )

    elif request.method == 'POST':
        serializer = StudentSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return api_response(
                status="success",
                message="Student created successfully",
                data=serializer.data,
                status_code=201
            )
        return api_response(
            status="error",
            message="Invalid student data",
            error_code="INVALID_STUDENT_DATA",
            data=serializer.errors,
            status_code=400
        )

@api_view(['GET', 'PUT', 'DELETE'])
def student_detail(request: Request, pk: int):
    """
    Handles retrieving (GET), updating (PUT), or deleting (DELETE) a specific student.
    """
    try:
        student = Student.objects.get(pk=pk)
    except Student.DoesNotExist:
        return api_response(
            status="error",
            message="Student not found",
            error_code="STUDENT_NOT_FOUND",
            status_code=404
        )

    if request.method == 'GET':
        serializer = StudentSerializer(student)
        return api_response(
            status="success",
            message="Student retrieved successfully",
            data=serializer.data,
            status_code=200
        )

    elif request.method == 'PUT':
        serializer = StudentSerializer(student, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return api_response(
                status="success",
                message="Student updated successfully",
                data=serializer.data,
                status_code=200
            )
        return api_response(
            status="error",
            message="Invalid student data",
            error_code="INVALID_STUDENT_DATA",
            data=serializer.errors,
            status_code=400
        )

    elif request.method == 'DELETE':
        student.delete()
        return api_response(
            status="success",
            message="Student deleted successfully",
            status_code=204
        )

@api_view(['GET', 'POST'])
def course_list(request: Request):
    """
    Handles listing all courses (GET) or creating a new course (POST).
    """
    if request.method == 'GET':
        courses = Course.objects.all()
        serializer = CourseSerializer(courses, many=True)
        return api_response(
            status="success",
            message="Courses retrieved successfully",
            data=serializer.data,
            status_code=200
        )

    elif request.method == 'POST':
        serializer = CourseSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return api_response(
                status="success",
                message="Course created successfully",
                data=serializer.data,
                status_code=201
            )
        return api_response(
            status="error",
            message="Invalid course data",
            error_code="INVALID_COURSE_DATA",
            data=serializer.errors,
            status_code=400
        )

@api_view(['GET', 'PUT', 'DELETE'])
def course_detail(request: Request, pk: int):
    """
    Handles retrieving (GET), updating (PUT), or deleting (DELETE) a specific course.
    """
    try:
        course = Course.objects.get(pk=pk)
    except Course.DoesNotExist:
        return api_response(
            status="error",
            message="Course not found",
            error_code="COURSE_NOT_FOUND",
            status_code=404
        )

    if request.method == 'GET':
        serializer = CourseSerializer(course)
        return api_response(
            status="success",
            message="Course retrieved successfully",
            data=serializer.data,
            status_code=200
        )

    elif request.method == 'PUT':
        serializer = CourseSerializer(course, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return api_response(
                status="success",
                message="Course updated successfully",
                data=serializer.data,
                status_code=200
            )
        return api_response(
            status="error",
            message="Invalid course data",
            error_code="INVALID_COURSE_DATA",
            data=serializer.errors,
            status_code=400
        )

    elif request.method == 'DELETE':
        course.delete()
        return api_response(
            status="success",
            message="Course deleted successfully",
            status_code=204
        )

@api_view(['GET', 'POST'])
def grade_list(request):
    """
    Handles listing all grades (GET) or creating a new grade (POST).
    """
    if request.method == 'GET':
        grades = Grade.objects.all()
        serializer = GradeSerializer(grades, many=True)
        return api_response(
            status="success",
            message="Grades retrieved successfully",
            data=serializer.data,
            status_code=200
        )

    elif request.method == 'POST':
        serializer = GradeSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return api_response(
                status="success",
                message="Grade created successfully",
                data=serializer.data,
                status_code=201
            )
        return api_response(
            status="error",
            message="Invalid grade data",
            error_code="INVALID_GRADE_DATA",
            data=serializer.errors,
            status_code=400
        )

@api_view(['GET', 'PUT', 'DELETE'])
def grade_detail(request, pk: int):
    """
    Handles retrieving (GET), updating (PUT), or deleting (DELETE) a specific grade.
    """
    try:
        grade = Grade.objects.get(pk=pk)
    except Grade.DoesNotExist:
        return api_response(
            status="error",
            message="Grade not found",
            error_code="GRADE_NOT_FOUND",
            status_code=404
        )

    if request.method == 'GET':
        serializer = GradeSerializer(grade)
        return api_response(
            status="success",
            message="Grade retrieved successfully",
            data=serializer.data,
            status_code=200
        )

    elif request.method == 'PUT':
        serializer = GradeSerializer(grade, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return api_response(
                status="success",
                message="Grade updated successfully",
                data=serializer.data,
                status_code=200
            )
        return api_response(
            status="error",
            message="Invalid grade data",
            error_code="INVALID_GRADE_DATA",
            data=serializer.errors,
            status_code=400
        )

    elif request.method == 'DELETE':
        grade.delete()
        return api_response(
            status="success",
            message="Grade deleted successfully",
            status_code=204
        )

@api_view(['POST'])
#@permission_classes([IsTeacher])
def create_grade(request):
    """
    Handles grade creation.
    Only accessible by users with the 'teacher' role.
    """
    serializer = GradeSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return api_response(
            status="success",
            message="Grade created successfully",
            data=serializer.data,
            status_code=201
        )
    return api_response(
        status="error",
        message="Invalid grade data",
        error_code="INVALID_GRADE_DATA",
        data=serializer.errors,
        status_code=400
    )

@api_view(['GET'])
def student_me(request):
    """
    Endpoint to fetch the logged-in student's data.
    """
    try:
        # Fetch the student record linked to the logged-in user
        student = request.user.student
        serializer = StudentSerializer(student)
        return api_response(
            status="success",
            message="Student data retrieved successfully",
            data=serializer.data,
            status_code=200
        )
    except Student.DoesNotExist:
        return api_response(
            status="error",
            message="Student record not found",
            error_code="STUDENT_NOT_FOUND",
            status_code=404
        )
