from rest_framework.permissions import IsAuthenticated
from rest_framework.viewsets import ModelViewSet

from apps.scans.api.v1.serializers.schedules import ScheduleSerializer
from apps.scans.models.scans import ScanSchedule
from apps.shared.pagination.custom import CustomPagination


class ScheduleViewSet(ModelViewSet):
    serializer_class = ScheduleSerializer
    pagination_class = CustomPagination
    permission_classes = [IsAuthenticated]
    filterset_fields = ("scan_type", "frequency", "is_active")

    def get_queryset(self):
        return ScanSchedule.objects.filter(user=self.request.user)
