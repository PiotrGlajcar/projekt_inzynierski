from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import Student, Course, Grade, User, Enrollment, Staff


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    """
    Custom User Admin for the grades.User model.
    """
    list_display = ('username', 'email', 'first_name', 'last_name', 'role', 'is_staff', 'is_active')
    list_filter = ('role', 'is_staff', 'is_superuser', 'is_active')

    fieldsets = (
        (None, {'fields': ('username', 'password')}),
        ('Personal info', {'fields': ('first_name', 'last_name', 'email')}),
        ('Roles and Permissions', {'fields': ('role', 'is_staff', 'is_superuser', 'is_active')}),
        ('Important dates', {'fields': ('last_login', 'date_joined')}),
    )

    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('username', 'first_name', 'last_name', 'password1', 'password2', 'email', 'role', 'is_staff', 'is_active')}
        ),
    )

    search_fields = ('username', 'email')
    ordering = ('username',)

@admin.register(Staff)
class StaffAdmin(admin.ModelAdmin):
    """
    Custom Admin for the Staff model.
    """
    list_display = ('user', 'user_email')
    search_fields = ('user__username', 'user__email', 'user__first_name', 'user__last_name')

    def user_email(self, obj):
        return obj.user.email
    user_email.short_description = 'Email'


@admin.register(Student)
class StudentAdmin(admin.ModelAdmin):
    """
    Custom Admin for the Student model.
    """
    list_display = ('user', 'user_email', 'student_number')
    search_fields = ('user__username', 'user__email', 'student_number')

    def user_email(self, obj):
        return obj.user.email
    user_email.short_description = 'Email'


@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    """
    Custom Admin for the Course model.
    """
    list_display = ('name', 'teacher')
    search_fields = ('name', 'teacher__user__first_name', 'teacher__user__last_name')
    list_filter = ('teacher',)


@admin.register(Enrollment)
class EnrollmentAdmin(admin.ModelAdmin):
    """
    Custom Admin for the Enrollment model.
    """
    list_display = ('student', 'course')
    search_fields = ('student__user__first_name', 'student__user__last_name', 'course__name')
    list_filter = ('course',)


@admin.register(Grade)
class GradeAdmin(admin.ModelAdmin):
    """
    Custom Admin for the Grade model.
    """
    list_display = ('enrollment', 'score', 'date_assigned')
    search_fields = ('enrollment__student__user__first_name', 'enrollment__course__name')
    list_filter = ('date_assigned',)
