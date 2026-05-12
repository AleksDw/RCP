from django.contrib import admin
from django.urls import path, include
from accounts.views import CustomTokenObtainPairView
from rest_framework.routers import DefaultRouter
from data.models.timeEntry import TimeEntry
from data.views import TimeEntryViewSet
from data.views import MachineViewSet, MachineTypeViewSet, ElementViewSet
router = DefaultRouter()
router.register(r'machine-types', MachineTypeViewSet, basename='machinetype')
router.register(r'machines', MachineViewSet, basename='machine')
router.register(r'time-entries', TimeEntryViewSet, basename='timeentry')
router.register(r'elements', ElementViewSet, basename='element')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    path('api/login/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
]