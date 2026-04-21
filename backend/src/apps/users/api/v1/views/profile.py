from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.users.api.v1.serializers.profile import ChangePasswordSerializer, ProfileSerializer


class ProfileView(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request):
        serializer = ProfileSerializer(request.user)
        return Response(
            {"success": True, "message": "Profile fetched.", "data": serializer.data},
        )

    def patch(self, request):
        serializer = ProfileSerializer(request.user, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(
            {"success": True, "message": "Profile updated.", "data": serializer.data},
        )


class ChangePasswordView(APIView):
    permission_classes = (IsAuthenticated,)

    def patch(self, request):
        serializer = ChangePasswordSerializer(data=request.data, context={"request": request})
        serializer.is_valid(raise_exception=True)
        request.user.set_password(serializer.validated_data["new_password"])
        request.user.save()
        return Response(
            {"success": True, "message": "Password changed successfully."},
            status=status.HTTP_200_OK,
        )
