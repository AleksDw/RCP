from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

from data.models.timeEntry import TimeEntry
from data.models.machine import Machine
from data.models.machineType import MachineType

from .serializers import (
    TimeEntrySerializer,
    MachineSerializer,
    MachineTypeSerializer
)

class TimeEntryViewSet(viewsets.ModelViewSet):
    serializer_class = TimeEntrySerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        return TimeEntry.objects.filter(user=user)
        
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class MachineTypeViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = MachineType.objects.all()
    serializer_class = MachineTypeSerializer

class MachineViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Machine.objects.all()
    serializer_class = MachineSerializer