from rest_framework.views import exception_handler

from oauth.utils.responses import api_response


def custom_exception_handler(exc, context):
    """
    Custom exception handler for DRF to standardize error responses using `api_response`.
    """
    # Call REST Framework's default exception handler
    response = exception_handler(exc, context)

    if response is not None:
        # Handle different status codes
        if response.status_code == 404:
            return api_response(
                status="error",
                message="The requested resource was not found.",
                error_code="NOT_FOUND",
                status_code=404,
            )
        elif response.status_code == 401:
            return api_response(
                status="error",
                message="Authentication credentials were not provided.",
                error_code="AUTHENTICATION_ERROR",
                status_code=401,
            )
        elif response.status_code == 403:
            return api_response(
                status="error",
                message="Permission denied.",
                error_code="PERMISSION_DENIED",
                status_code=403,
            )
        else:
            # Generic error handler with safe fallback for message
            message = (
                response.data.get("detail", "An unexpected error occurred.")
                if response and response.data
                else "An unexpected error occurred."
            )
            return api_response(
                status="error",
                message=message,
                error_code="GENERIC_ERROR",
                status_code=response.status_code,
            )

    # Handle uncaught exceptions (e.g., 500 errors)
    return api_response(
        status="error",
        message="An internal server error occurred. Please contact support.",
        error_code="SERVER_ERROR",
        status_code=500,
    )
