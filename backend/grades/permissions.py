from rest_framework.permissions import BasePermission

class IsSuperuser(BasePermission):
    """Allows full access to superusers."""
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.is_superuser

class IsSuperuserOrTeacher(BasePermission):
    """Allows access to superusers (Django Admins) and teachers."""
    def has_permission(self, request, view):
        return request.user.is_authenticated and (request.user.is_superuser or request.user.role == "teacher")

class IsSuperuserOrStudent(BasePermission):
    """Allows access to superusers (Django Admins) and students."""
    def has_permission(self, request, view):
        return request.user.is_authenticated and (request.user.is_superuser or request.user.role == "student")

# class IsTeacherOrStudent(BasePermission):
#     """Allows access to teachers and students, but NOT superusers."""
#     def has_permission(self, request, view):
#         return request.user.is_authenticated and request.user.role in ["teacher", "student"]
