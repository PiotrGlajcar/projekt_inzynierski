from django.urls import path
from .views import initiate_oauth, process_oauth_callback, logout_user

urlpatterns = [
    path('start/', initiate_oauth, name='oauth_start'),
    path('callback/', process_oauth_callback, name='oauth_callback'),
    path('logout/', logout_user, name='logout_user'),
]
