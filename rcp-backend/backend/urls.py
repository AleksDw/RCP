from django.contrib import admin
from django.urls import path, include
from accounts.views import CustomTokenObtainPairView, UserViewSet
from rest_framework.routers import DefaultRouter
from data.models.timeEntry import TimeEntry
from data.views import TimeEntryViewSet, MachineViewSet, MachineTypeViewSet, ElementViewSet
from rest_framework_simplejwt.views import TokenRefreshView
router = DefaultRouter()
router.register(r'users', UserViewSet, basename='user')
router.register(r'machine-types', MachineTypeViewSet, basename='machinetype')
router.register(r'machines', MachineViewSet, basename='machine')
router.register(r'time-entries', TimeEntryViewSet, basename='timeentry')
router.register(r'elements', ElementViewSet, basename='element') 

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    path('api/login/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]