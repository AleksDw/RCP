from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

from data.models.timeEntry import TimeEntry
from data.models.machine import Machine
from data.models.machineType import MachineType
from data.models.element import Element

from .serializers import (
    TimeEntrySerializer,
    MachineSerializer,
    MachineTypeSerializer,
    ElementSerializer
)

class TimeEntryViewSet(viewsets.ModelViewSet):
    serializer_class = TimeEntrySerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        if user.role == 'employer':
            return TimeEntry.objects.all()
        return TimeEntry.objects.filter(user=user)
        
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class MachineTypeViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = MachineType.objects.all()
    serializer_class = MachineTypeSerializer

class MachineViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Machine.objects.all()
    serializer_class = MachineSerializer
    
class ElementViewSet(viewsets.ModelViewSet):
    queryset = Element.objects.all()
    serializer_class = ElementSerializer
    permission_classes = [IsAuthenticated]