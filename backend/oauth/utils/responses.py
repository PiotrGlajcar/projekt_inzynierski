from django.http import JsonResponse

def api_response(status, message, data=None, error_code=None, status_code=None):
    """
    Returns a standardized JSON response for all endpoints.

    Args:
        status (str): "success" or "error".
        message (str): A descriptive message about the outcome.
        data (dict, optional): Additional data to include in the response. Defaults to {}.
        error_code (str, optional): Machine-readable error code for frontend handling. 
                                    Defaults to None.
        status_code (int, optional): HTTP status code for the response. Automatically set 
                                     based on status if not provided.

    Returns:
        JsonResponse: A formatted JSON response.
    """

    # Validate status
    if status not in ["success", "error"]:
        raise ValueError("Invalid status. Must be 'success' or 'error'.")
    
    # Default data to an empty dictionary
    if data is None:
        data = {}

    # Map status to a default status code if not provided
    if status_code is None:
        status_code = 200 if status == "success" else 400
    
    response = {
        "status": status,
        "message": message,
        "data": data,
    }
  
    if error_code is not None:
        response["error_code"] = error_code

    return JsonResponse(response, status=status_code, content_type='application/json; charset=utf-8', json_dumps_params={"ensure_ascii": False})