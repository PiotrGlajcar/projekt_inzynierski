from django.http import JsonResponse

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