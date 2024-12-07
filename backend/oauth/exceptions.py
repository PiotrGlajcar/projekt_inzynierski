from rest_framework.views import exception_handler
from oauth.utils.responses import api_response

def custom_exception_handler(exc, context):
    """
    Custom exception handler for DRF to standardize error responses.
    """
    # Call REST Framework's default exception handler
    response = exception_handler(exc, context)

    if response is not None:
        if response.status_code == 401:
            # Handle authentication errors
            return api_response(
                status="error",
                message="Authentication credentials were not provided.",
                error_code="AUTHENTICATION_ERROR",
                status_code=401
            )
        elif response.status_code == 403:
            # Handle permission errors
            return api_response(
                status="error",
                message="Permission denied.",
                error_code="PERMISSION_DENIED",
                status_code=403
            )
    return response
