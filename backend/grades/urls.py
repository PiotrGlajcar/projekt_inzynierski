from django.urls import path
from . import views

urlpatterns = [
    # Students
    path('students/', views.student_list, name='student-list'),
    path('students/<int:pk>/', views.student_detail, name='student-detail'),
    path('students/me/', views.student_me, name='student-me'),

    # Courses
    path('courses/', views.course_list, name='course-list'),
    path('courses/<int:pk>/', views.course_detail, name='course-detail'),

    # Grades
    path('grades/', views.grade_list, name='grade-list'),
    path('grades/<int:pk>/', views.grade_detail, name='grade-detail'),
    path('grades/create/', views.create_grade, name='create-grade'),
]
