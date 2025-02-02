from django.urls import path

from .views import (AssignmentDetailView, AssignmentListCreateView,
                    CourseDetailView, CourseListCreateView,
                    EnrollmentDetailView, EnrollmentListCreateView,
                    GradeDetailView, GradeListCreateView, StudentDetailView,
                    StudentListCreateView, TeacherDetailView, TeacherListView,
                    UserDetailView, UserListCreateView, users_me)

urlpatterns = [
    # Users
    path("users/me", users_me, name="users-me"),
    path("users/", UserListCreateView.as_view(), name="user_list_create"),
    path("users/<int:pk>/", UserDetailView.as_view(), name="user_detail"),
    # Students
    path("students/", StudentListCreateView.as_view(), name="student-list"),
    path("students/<int:pk>/", StudentDetailView.as_view(), name="student-detail"),
    # Teachers
    path("teachers/", TeacherListView.as_view(), name="teacher_list_create"),
    path("teachers/<int:pk>/", TeacherDetailView.as_view(), name="teacher_detail"),
    # Courses
    path("courses/", CourseListCreateView.as_view(), name="course-list"),
    path("courses/<int:pk>/", CourseDetailView.as_view(), name="course-detail"),
    # Enrollments
    path(
        "enrollments/",
        EnrollmentListCreateView.as_view(),
        name="enrollment_list_create",
    ),
    path(
        "enrollments/detail/", EnrollmentDetailView.as_view(), name="enrollment-detail"
    ),
    path(
        "enrollments/<int:pk>/",
        EnrollmentDetailView.as_view(),
        name="enrollment_detail",
    ),
    # Grades
    path("grades/", GradeListCreateView.as_view(), name="grade_list_create"),
    path("grades/<int:pk>/", GradeDetailView.as_view(), name="grade_detail"),
    # Assignments
    path(
        "assignments/",
        AssignmentListCreateView.as_view(),
        name="assignment_list_create",
    ),
    path(
        "assignments/<int:pk>/",
        AssignmentDetailView.as_view(),
        name="assignment_detail",
    ),
]
