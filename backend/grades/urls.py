from django.urls import path
from . import views

urlpatterns = [
    # Students
    path('students/', views.student_list, name='student-list'),
    path('students/<int:pk>/', views.student_detail, name='student-detail'),

    #Users
    path('users/me', views.users_me, name='users-me'),

    # Courses
    path('courses/', views.course_list, name='course-list'),
    path('courses/<int:pk>/', views.course_detail, name='course-detail'),

    #Enrollments
    path('enroll/', views.enroll_in_course, name='enroll'),
    path('enrollments/', views.get_enrollments, name='enrollments'),

    # Grades
    path('grades/', views.list_grades, name='grade-list'),
    path('grades/assign', views.assign_grade, name='grade-assignment'),
    path('grades/<int:pk>/', views.grade_detail, name='grade-detail'),
    path('grades/create/', views.create_grade, name='create-grade'),
]