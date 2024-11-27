from django.http import JsonResponse
from django.contrib.auth import get_user_model
from grades.models import Student

def api_response(status, message, data=None, error_code=None, status_code=200):
    """
    Returns a standardized JSON response for all endpoints.

    Args:
        status (str): "success" or "error".
        message (str): A descriptive message about the outcome.
        data (dict, optional): Additional data to include in the response. Defaults to None.
        error_code (str, optional): Machine-readable error code for frontend handling. 
                                    Defaults to None.
        status_code (int): HTTP status code for the response. Defaults to 200.

    Returns:
        JsonResponse: A formatted JSON response.
    """
    response = {
        "status": status,  # "success" or "error"
        "message": message,
    }
    if data is not None:
        response["data"] = data
    if error_code is not None:
        response["error_code"] = error_code
    return JsonResponse(response, status=status_code)

def process_usos_user(user_info):
    """
    Processes the data fetched from USOS API and updates/creates User.

    Args:
        user_info (dict): Data fetched from USOS API.

    Returns:
        User: The Django User object linked to the USOS user.
    """
    usos_id = user_info.get("id")
    first_name = user_info.get("first_name")
    last_name = user_info.get("last_name")
    email = user_info.get("email")
    student_number = user_info.get("student_number")
    student_status = user_info.get("student_status")
    staff_status = user_info.get("staff_status")

    # Get the custom User model
    user = get_user_model()

    # Create or update User record
    user, created = user.objects.get_or_create(
        usos_id=usos_id,
        defaults={
            "username": usos_id,
            "email": email,
            "role": "unknown",
        },
    )

    # Update user if necessary
    if user.email != email:
        user.email = email
    user.set_role(student_status=student_status, staff_status=staff_status)

    # Save only if there are changes
    if user.role != "unknown" or created:
        user.save()

    # Handle Student updates if role is "student"
    if user.role == "student":
        student, _ = Student.objects.get_or_create(
            user=user,
            defaults={
                "name": first_name,
                "last_name": last_name,
                "student_number": student_number,
            },
        )
        if (
            student.name != first_name
            or student.last_name != last_name
            or student.student_number != student_number
        ):
            student.name = first_name
            student.last_name = last_name
            student.student_number = student_number
            student.save()

        return user
