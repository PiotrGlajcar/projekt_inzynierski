from requests_oauthlib import OAuth1Session
from django.shortcuts import redirect
from django.http import JsonResponse
from django.conf import settings

def get_request_token(request):
    """
    Directly redirects the user to the USOS login page to authorize.
    """
    usos = OAuth1Session(
        settings.USOS_CONSUMER_KEY,
        client_secret=settings.USOS_CONSUMER_SECRET,
        callback_uri=settings.USOS_CALLBACK_URL,
    )

    # Fetch the request token
    fetch_response = usos.fetch_request_token(settings.USOS_REQUEST_TOKEN_URL)
    request.session['oauth_token'] = fetch_response.get('oauth_token')
    request.session['oauth_token_secret'] = fetch_response.get('oauth_token_secret')

    # Generate the authorization URL and redirect the user
    authorization_url = usos.authorization_url(settings.USOS_AUTHORIZE_URL)
    return redirect(authorization_url)

def oauth_callback(request):
    """
    Handles the callback from USOS and retrieves user information with basic error handling.
    """
    oauth_token = request.GET.get('oauth_token')
    oauth_verifier = request.GET.get('oauth_verifier')
    oauth_token_secret = request.session.get('oauth_token_secret')

    # Check if required tokens are present
    if not oauth_token or not oauth_verifier or not oauth_token_secret:
        return JsonResponse({'error': 'Missing OAuth tokens'}, status=400)

    try:
        # Initialize OAuth session
        usos = OAuth1Session(
            settings.USOS_CONSUMER_KEY,
            client_secret=settings.USOS_CONSUMER_SECRET,
            resource_owner_key=oauth_token,
            resource_owner_secret=oauth_token_secret,
            verifier=oauth_verifier,
        )

        # Fetch access tokens
        oauth_tokens = usos.fetch_access_token(settings.USOS_ACCESS_TOKEN_URL)
        request.session['access_token'] = oauth_tokens['oauth_token']
        request.session['access_token_secret'] = oauth_tokens['oauth_token_secret']

        # Fetch user information
        response = usos.get('https://usosapi.polsl.pl/services/users/user')
        if response.status_code != 200:
            return JsonResponse({'error': 'Failed to fetch user info', 'details': response.text}, status=response.status_code)

        # Parse and return the user info directly
        user_info = response.json()  # This assumes the API returns a valid JSON object
        return JsonResponse(user_info)

    except Exception as e:
        # Catch any exceptions and return an error response
        return JsonResponse({'error': 'OAuth callback failed', 'exception': str(e)}, status=500)

def logout_view(request):
    """
    Clears session data and logs the user out.
    """
    request.session.flush()  # Clears all session data
    return JsonResponse({'message': 'User logged out successfully'}, status=200)
