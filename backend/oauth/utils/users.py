from grades.models import Student, Staff, User
from django.conf import settings

def process_usos_user(user_info):
    """
    Processes the data fetched from USOS API and updates/creates User.

    Args:
        user_info (dict): Data fetched from USOS API.

    Returns:
        User: The Django User object linked to the USOS user.
    """
    usos_id = user_info.get("id")
    first_name = user_info.get("first_name", "")
    last_name = user_info.get("last_name", "")
    email = user_info.get("email")
    student_number = user_info.get("student_number")
    student_status = user_info.get("student_status")
    staff_status = user_info.get("staff_status")

    # Create or update User record
    user, created = User.objects.get_or_create(
        username=usos_id,
        defaults={
            "email": email,
            "first_name": first_name,
            "last_name": last_name,
            "role": "unknown",
        },
    )

    # Update common fields if necessary
    user.first_name = first_name
    user.last_name = last_name
    user.email = email

    # Set role based on status
    if staff_status == 2:
        user.role = "staff"
    elif student_status == 2:
        user.role = "student"
    else:
        user.role = "unknown"
    user.save()

    # Save only if there are changes
    if user.role != "unknown" or created:
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
        Staff.objects.get_or_create(user=user)

    return user