from django.urls import path
from .views import (
    users_me,
    UserListCreateView,
    UserDetailView,
    StudentListCreateView,
    StudentDetailView,
    TeacherListView,
    TeacherDetailView,
    CourseListCreateView,
    CourseDetailView,
    EnrollmentListCreateView,
    EnrollmentDetailView,
    GradeListCreateView,
    GradeDetailView,
    AssignmentListCreateView,
    AssignmentDetailView,
    RequiredGradeListCreateView,
    RequiredGradeDetailView,
    GroupListCreateView,
    GroupDetailView,
)



urlpatterns = [
    #Users
    path('users/me', users_me, name='users-me'),
    path('users/', UserListCreateView.as_view(), name='user_list_create'),
    path('users/<int:pk>/', UserDetailView.as_view(), name='user_detail'),

    # Students
    path('students/', StudentListCreateView.as_view(), name='student-list'),
    path('students/<int:pk>/', StudentDetailView.as_view(), name='student-detail'),
    
    # Teachers
    path('teachers/', TeacherListView.as_view(), name='teacher_list_create'),
    path('teachers/<int:pk>/', TeacherDetailView.as_view(), name='teacher_detail'),

    # Courses
    path('courses/', CourseListCreateView.as_view(), name='course-list'),
    path('courses/<int:pk>/', CourseDetailView.as_view(), name='course-detail'),

    # Enrollments
    path('enrollments/', EnrollmentListCreateView.as_view(), name='enrollment_list_create'),
    path('enrollments/<int:pk>/', EnrollmentDetailView.as_view(), name='enrollment_detail'),

    # Grades
    path('grades/', GradeListCreateView.as_view(), name='grade_list_create'),
    path('grades/<int:pk>/', GradeDetailView.as_view(), name='grade_detail'),

    # Assignments
    path('assignments/', AssignmentListCreateView.as_view(), name='assignment_list_create'),
    path('assignments/<int:pk>/', AssignmentDetailView.as_view(), name='assignment_detail'),

    # Required Grades
    path('required-grades/', RequiredGradeListCreateView.as_view(), name='required_grade_list_create'),
    path('required-grades/<int:pk>/', RequiredGradeDetailView.as_view(), name='required_grade_detail'),

    # Groups
    path('groups/', GroupListCreateView.as_view(), name='group-list-create'),
    path('groups/<int:pk>/', GroupDetailView.as_view(), name='group-detail'),
]