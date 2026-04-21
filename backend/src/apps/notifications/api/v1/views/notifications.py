from rest_framework import status
from rest_framework.decorators import action
from rest_framework.mixins import ListModelMixin, DestroyModelMixin
from rest_framework.response import Response
from rest_framework.viewsets import GenericViewSet

from apps.notifications.api.v1.serializers.notifications import NotificationSerializer
from apps.notifications.models.notifications import Notification
from apps.shared.pagination.custom import CustomPagination

class NotificationViewSet(ListModelMixin, DestroyModelMixin, GenericViewSet):
    serializer_class = NotificationSerializer
    pagination_class = CustomPagination
    filterset_fields = ("level", "is_read")
    search_fields = ("title", "description")
    ordering_fields = ("created_at", "level")

    def get_queryset(self):
        return Notification.objects.filter(user=self.request.user)

    @action(detail=False, methods=["post"], url_path="mark-read")
    def mark_all_read(self, request):
        qs = self.get_queryset().filter(is_read=False)
        updated_count = qs.update(is_read=True)
        return Response({
            "success": True,
            "message": f"Marked {updated_count} notifications as read."
        })

    @action(detail=True, methods=["post"], url_path="read")
    def mark_read(self, request, pk=None):
        notification = self.get_object()
        notification.is_read = True
        notification.save()
        return Response({
            "success": True,
            "data": self.get_serializer(notification).data
        })

    @action(detail=False, methods=["get"], url_path="stats")
    def stats(self, request):
        qs = self.get_queryset()
        total = qs.count()
        unread = qs.filter(is_read=False).count()
        
        # Calculate level counts
        from django.db.models import Count
        by_level = qs.values("level").annotate(count=Count("id"))

        return Response({
            "success": True,
            "data": {
                "total": total,
                "unread": unread,
                "by_level": {item["level"]: item["count"] for item in by_level}
            }
        })
