from rest_framework.permissions import BasePermission

class IsTeacher(BasePermission):
    """
    Custom permission to allow access only to teacher users.
    """
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'teacher'
