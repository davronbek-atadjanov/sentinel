from rest_framework import serializers
from apps.notifications.models.notifications import Notification

class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = (
            "id",
            "level",
            "title",
            "description",
            "is_read",
            "meta_data",
            "created_at",
            "updated_at",
        )
        read_only_fields = fields
