from django.contrib import admin
from .models import Student, Course, Grade
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User

admin.site.register(Student)
admin.site.register(Course)
admin.site.register(Grade)


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    """
    Custom User Admin for the grades.User model.
    """
    # Specify fields to display in the list view
    list_display = ('username', 'email', 'role', 'usos_id', 'is_staff', 'is_active')
    list_filter = ('role', 'is_staff', 'is_superuser', 'is_active')

    # Define fields for the user detail view
    fieldsets = (
        (None, {'fields': ('username', 'password')}),
        ('Personal info', {'fields': ('email', 'first_name', 'last_name')}),
        ('Roles and Permissions', {'fields': ('role', 'is_staff', 'is_superuser', 'is_active', 'groups', 'user_permissions')}),
        ('Important dates', {'fields': ('last_login', 'date_joined')}),
    )

    # Fields used when creating a user
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('username', 'email', 'password1', 'password2', 'role', 'is_staff', 'is_active')}
        ),
    )

    search_fields = ('username', 'email')
    ordering = ('username',)
