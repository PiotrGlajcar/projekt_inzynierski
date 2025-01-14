from django.shortcuts import redirect
from django.contrib.auth import login, logout
from django.conf import settings
from oauth.utils.responses import api_response
from oauth.utils.users import process_usos_user
from oauth.services.usos import UsosAPI
from django.contrib.auth import get_user_model

# Initialize the UsosAPI instance
usos_api = UsosAPI(
    consumer_key=settings.USOS_CONSUMER_KEY,
    consumer_secret=settings.USOS_CONSUMER_SECRET,
    callback_url=settings.USOS_CALLBACK_URL,
    base_url="https://usosapi.polsl.pl"
)

def initiate_oauth(request):
    """
    Starts the OAuth process by fetching request tokens and redirecting to the USOS login page.
    """
    try:
        # Add the required scopes
        scopes = 'email|studies|personal'

        # Fetch request tokens with scopes
        tokens = usos_api.fetch_request_token(scopes=scopes)

        # Store tokens in the session
        request.session['oauth_token'] = tokens['oauth_token']
        request.session['oauth_token_secret'] = tokens['oauth_token_secret']

        # Generate the authorization URL
        authorization_url = usos_api.get_authorization_url(tokens['oauth_token'])
        return redirect(authorization_url)
    except Exception as e:
        return api_response(
            status="error",
            message="Failed to initiate OAuth",
            error_code="OAUTH_INIT_ERROR",
            data={"exception": str(e)},
            status_code=500
        )

def process_oauth_callback(request):
    """
    Handles the callback from USOS, retrieves user information, and returns a standardized response.
    """
    oauth_token = request.GET.get('oauth_token')
    oauth_verifier = request.GET.get('oauth_verifier')
    oauth_token_secret = request.session.get('oauth_token_secret')

    if not oauth_token or not oauth_verifier or not oauth_token_secret:
        return api_response(
            status="error",
            message="Missing OAuth tokens",
            error_code="MISSING_TOKENS",
            status_code=400
        )

    try:
        # Fetch access tokens
        access_tokens = usos_api.fetch_access_token(oauth_token, oauth_token_secret, oauth_verifier)
        request.session['access_token'] = access_tokens['oauth_token']
        request.session['access_token_secret'] = access_tokens['oauth_token_secret']

        # Fetch user information
        user_info = usos_api.get_usos_user_data(
            access_token=access_tokens['oauth_token'],
            access_token_secret=access_tokens['oauth_token_secret'],
            fields='id|first_name|last_name|email|student_number|student_status|staff_status'
        )

        # Debug inside process_oauth_callback
        user = process_usos_user(user_info)

        if not user:
            raise ValueError("process_usos_user returned None.")
        if not isinstance(user, get_user_model()):
            raise ValueError("process_usos_user returned an invalid object.")

        print(f"User retrieved: {user}, Role: {user.role}")


        # Log the user in to associate the session with the User object
        login(request, user)
        
        return redirect("http://localhost:5173/home-student")
        # (api_response(  
        #     status="success",
        #     message="User data retrieved successfully",
        #     data=user_info,
        #     status_code=200)
        # )

    except Exception as e:
        return api_response(
            status="error",
            message="OAuth callback failed",
            error_code="OAUTH_CALLBACK_ERROR",
            data={"exception": str(e)},
            status_code=500
        )

def logout_user(request):
    """
    Logs out the user by clearing session data and resetting authentication state.
    """
    logout(request)  # Clears the session and resets request.user
    return api_response(
        status="success",
        message="User logged out successfully",
        status_code=200
    )

