from django.urls import path

from apps.shared.api.v1.views.dashboard import DashboardOverviewView

urlpatterns = [
    path("overview/", DashboardOverviewView.as_view(), name="dashboard-overview"),
]
