from django.contrib.auth import authenticate, get_user_model
from rest_framework import generics, status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken

from apps.users.api.v1.serializers.auth import LoginSerializer, RegisterSerializer

User = get_user_model()


class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer
    permission_classes = (AllowAny,)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        tokens = user.tokens()
        return Response(
            {
                "success": True,
                "message": "Registration successful.",
                "data": {
                    "user": {
                        "id": user.id,
                        "email": user.email,
                        "username": user.username,
                    },
                    **tokens,
                },
            },
            status=status.HTTP_201_CREATED,
        )


class LoginView(APIView):
    permission_classes = (AllowAny,)
    serializer_class = LoginSerializer

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = authenticate(
            request,
            email=serializer.validated_data["email"],
            password=serializer.validated_data["password"],
        )
        if user is None:
            return Response(
                {"success": False, "message": "Invalid email or password."},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        tokens = user.tokens()
        return Response(
            {
                "success": True,
                "message": "Login successful.",
                "data": {
                    "user": {
                        "id": user.id,
                        "email": user.email,
                        "username": user.username,
                        "role": user.role,
                    },
                    **tokens,
                },
            },
        )


class LogoutView(APIView):
    def post(self, request):
        try:
            refresh_token = request.data.get("refresh")
            if refresh_token:
                token = RefreshToken(refresh_token)
                token.blacklist()
            return Response(
                {"success": True, "message": "Logged out successfully."},
                status=status.HTTP_200_OK,
            )
        except Exception:
            return Response(
                {"success": True, "message": "Logged out."},
                status=status.HTTP_200_OK,
            )
