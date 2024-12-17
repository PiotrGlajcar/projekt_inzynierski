from rest_framework.decorators import api_view
from rest_framework.request import Request
from django.views.decorators.csrf import csrf_exempt
from oauth.utils.responses import api_response
from .models import Student, Course, Grade, Enrollment
from .serializers import StudentSerializer, CourseSerializer, GradeSerializer, UserSerializer, EnrollmentSerializer

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

# @api_view(['GET', 'POST'])
# def grade_list(request):
#     """
#     Handles listing all grades (GET) or creating a new grade (POST).
#     """
#     if request.method == 'GET':
#         grades = Grade.objects.all()
#         serializer = GradeSerializer(grades, many=True)
#         return api_response(
#             status="success",
#             message="Grades retrieved successfully",
#             data=serializer.data,
#             status_code=200
#         )

#     elif request.method == 'POST':
#         serializer = GradeSerializer(data=request.data)
#         if serializer.is_valid():
#             serializer.save()
#             return api_response(
#                 status="success",
#                 message="Grade created successfully",
#                 data=serializer.data,
#                 status_code=201
#             )
#         return api_response(
#             status="error",
#             message="Invalid grade data",
#             error_code="INVALID_GRADE_DATA",
#             data=serializer.errors,
#             status_code=400
#         )

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

@api_view(['POST'])
def enroll_in_course(request):
    """
    Allows a student to enroll in a course.
    """
    print(f"User: {request.user}, Authenticated: {request.user.is_authenticated}")
    # Ensure the user is authenticated
    if not request.user.is_authenticated:
        return api_response(
            status="error",
            message="Permission denied.",
            error_code="PERMISSION_DENIED",
            status_code=403
        )

    try:
        # Ensure the logged-in user is a student
        student = request.user.student
    except Student.DoesNotExist:
        return api_response(
            status="error",
            message="You must be a student to enroll in a course.",
            error_code="NOT_A_STUDENT",
            status_code=403
        )

    # Add the student's ID to the request data
    data = request.data.copy()
    data['student'] = student.id

    # Use the EnrollmentSerializer to validate and save the data
    serializer = EnrollmentSerializer(data=data)
    if serializer.is_valid():
        serializer.save()  # Save the new enrollment
        return api_response(
            status="success",
            message="Enrolled in course successfully.",
            data=serializer.data,
            status_code=201
        )

    # Return validation errors
    return api_response(
        status="error",
        message="Enrollment failed.",
        error_code="INVALID_ENROLLMENT",
        data=serializer.errors,
        status_code=400
    )

@api_view(['GET'])
def get_enrollments(request):
    """
    Fetch all enrollments for the logged-in student.
    """
    try:
        # Get the logged-in student
        student = request.user.student
    except Student.DoesNotExist:
        return api_response(
            status="error",
            message="You must be a student to view enrollments.",
            error_code="NOT_A_STUDENT",
            status_code=403
        )

    # Query enrollments for the logged-in student
    enrollments = Enrollment.objects.filter(student=student)

    # Serialize the data
    serializer = EnrollmentSerializer(enrollments, many=True)
    return api_response(
        status="success",
        message="Enrollments retrieved successfully.",
        data=serializer.data,
        status_code=200
    )

@api_view(['GET'])
def list_grades(request):
    """
    Retrieve grades for the logged-in student or all enrollments if staff.
    """
    user = request.user

    # Check if the user is authenticated
    if not user.is_authenticated:
        return api_response(
            status="error",
            message="Permission denied.",
            error_code="PERMISSION_DENIED",
            status_code=403
        )

    if hasattr(user, 'student'):
        # If the user is a student, return only their grades
        grades = Grade.objects.filter(enrollment__student=user.student)
    elif hasattr(user, 'staff'):
        # If the user is staff, return all grades
        grades = Grade.objects.all()
    else:
        return api_response(
            status="error",
            message="You must be a student or staff to view grades.",
            error_code="NOT_AUTHORIZED",
            status_code=403
        )

    serializer = GradeSerializer(grades, many=True)
    return api_response(
        status="success",
        message="Grades retrieved successfully.",
        data=serializer.data,
        status_code=200
    )

@api_view(['POST'])
def assign_grade(request):
    """
    Assign a grade to a student for a specific course enrollment.
    """
    user = request.user

    # Ensure the user is staff
    if not hasattr(user, 'staff'):
        return api_response(
            status="error",
            message="Only staff members can assign grades.",
            error_code="NOT_AUTHORIZED",
            status_code=403
        )

    # Serialize and validate the incoming data
    serializer = GradeSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return api_response(
            status="success",
            message="Grade assigned successfully.",
            data=serializer.data,
            status_code=201
        )

    return api_response(
        status="error",
        message="Grade assignment failed.",
        error_code="INVALID_GRADE",
        data=serializer.errors,
        status_code=400
    )