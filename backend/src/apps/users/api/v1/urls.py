from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView

from apps.users.api.v1.views.auth import LoginView, LogoutView, RegisterView
from apps.users.api.v1.views.profile import ChangePasswordView, ProfileView

urlpatterns = [
    path("register/", RegisterView.as_view(), name="auth-register"),
    path("login/", LoginView.as_view(), name="auth-login"),
    path("logout/", LogoutView.as_view(), name="auth-logout"),
    path("token/refresh/", TokenRefreshView.as_view(), name="auth-token-refresh"),
    path("me/", ProfileView.as_view(), name="auth-profile"),
    path("change-password/", ChangePasswordView.as_view(), name="auth-change-password"),
]
