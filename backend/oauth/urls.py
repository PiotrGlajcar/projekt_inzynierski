from django.urls import path
from .views import get_request_token, oauth_callback, logout_view

urlpatterns = [
    path('start/', get_request_token, name='oauth_start'),
    path('callback/', oauth_callback, name='oauth_callback'),
    path('logout/', logout_view, name='logout'),
]
