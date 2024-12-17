from requests_oauthlib import OAuth1Session

class UsosAPI:
    """
    A helper class to interact with the USOS API.
    """
    def __init__(self, consumer_key, consumer_secret, callback_url, base_url):
        """
        Initialize the UsosAPI with necessary credentials and base URL.

        Args:
            consumer_key (str): The consumer key for OAuth.
            consumer_secret (str): The consumer secret for OAuth.
            callback_url (str): The callback URL after OAuth authentication.
            base_url (str): The base URL of the USOS API (e.g., "https://usosapi.polsl.pl").
        """
        self.consumer_key = consumer_key
        self.consumer_secret = consumer_secret
        self.callback_url = callback_url
        self.base_url = base_url

    def get_oauth_session(self, resource_owner_key=None, resource_owner_secret=None, verifier=None):
        """
        Create and return an OAuth1Session for making requests.

        Args:
            resource_owner_key (str, optional): The user's OAuth token.
            resource_owner_secret (str, optional): The user's OAuth token secret.
            verifier (str, optional): The OAuth verifier if available.

        Returns:
            OAuth1Session: The authenticated session.
        """
        return OAuth1Session(
            client_key=self.consumer_key,
            client_secret=self.consumer_secret,
            resource_owner_key=resource_owner_key,
            resource_owner_secret=resource_owner_secret,
            callback_uri=self.callback_url,
            verifier=verifier
        )

    def fetch_request_token(self, scopes=None):
        """
        Fetch an OAuth request token from the USOS API.

        Args:
            scopes (str, optional): A string of scopes separated by '|' (e.g., 'email|studies').

        Returns:
            dict: A dictionary containing the `oauth_token` and `oauth_token_secret`.
        """
        session = self.get_oauth_session()

        # Append scopes to the request URL if provided
        request_token_url = f"{self.base_url}/services/oauth/request_token"
        if scopes:
            request_token_url += f"?scopes={scopes}"

        response = session.fetch_request_token(request_token_url)
        return response

    def get_authorization_url(self, oauth_token):
        """
        Generate the URL where the user can authorize the app.

        Args:
            oauth_token (str): The OAuth token.

        Returns:
            str: The authorization URL.
        """
        session = self.get_oauth_session(resource_owner_key=oauth_token)
        return session.authorization_url(f"{self.base_url}/services/oauth/authorize")

    def fetch_access_token(self, oauth_token, oauth_token_secret, verifier):
        """
        Fetch the access token using the verifier.

        Args:
            oauth_token (str): The OAuth token.
            oauth_token_secret (str): The OAuth token secret.
            verifier (str): The OAuth verifier.

        Returns:
            dict: A dictionary containing the access token and token secret.
        """
        session = self.get_oauth_session(
            resource_owner_key=oauth_token,
            resource_owner_secret=oauth_token_secret,
            verifier=verifier
        )
        response = session.fetch_access_token(f"{self.base_url}/services/oauth/access_token")
        return response

    def get_usos_user_data(self, access_token, access_token_secret, fields=None):
        """
        Fetch user information from the USOS API.

        Args:
            access_token (str): The user's access token.
            access_token_secret (str): The user's access token secret.
            fields (str, optional): Specific fields to request, e.g., 'id|first_name|last_name|email'.

        Returns:
            dict: The user's information.
        """
        session = self.get_oauth_session(
            resource_owner_key=access_token,
            resource_owner_secret=access_token_secret
        )
        params = {'fields': fields} if fields else {}
        response = session.get(f"{self.base_url}/services/users/user", params=params)
        response.raise_for_status()
        return response.json()
