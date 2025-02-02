from django.urls import path

from .views.oauth import initiate_oauth, logout_user, process_oauth_callback

urlpatterns = [
    path("start/", initiate_oauth, name="oauth_start"),
    path("callback/", process_oauth_callback, name="oauth_callback"),
    path("logout/", logout_user, name="logout_user"),
]
