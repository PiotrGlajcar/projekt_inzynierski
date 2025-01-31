from grades.models import Student, Teacher, User
from django.conf import settings

def process_usos_user(user_info):
    """
    Process data from USOS API and create/update User.

    Args:
        user_info (dict): Data fetched from USOS API.

    Returns:
        User: The Django User object linked to the USOS user.
    """
    email = user_info.get("email")
    first_name = user_info.get("first_name", "")
    last_name = user_info.get("last_name", "")
    student_number = user_info.get("student_number")
    student_status = user_info.get("student_status")
    staff_status = user_info.get("staff_status")

    # Create or update User record
    user, created = User.objects.get_or_create(
        email=email,
        defaults={
            "first_name": first_name,
            "last_name": last_name,
            "role": "unknown",
        },
    )

    # Update common fields if necessary
    user.first_name = first_name
    user.last_name = last_name

    # Set role based on status ONLY if role is "unknown" or user is new
    if created or user.role == "unknown":
        if staff_status == 2:
            user.role = "staff"
        elif student_status == 2:
            user.role = "student"
        else:
            user.role = "unknown"
    user.save()

    # Handle Student updates if role is "student"
    if user.role == "student":
        Student.objects.get_or_create(
            user=user,
            defaults={
                "student_number": student_number},
        )

    # Handle Staff role
    elif user.role == "staff":
        Teacher.objects.get_or_create(user=user)

    return user