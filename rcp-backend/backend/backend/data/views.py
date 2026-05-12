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
        return TimeEntry.objects.filter(user=user)
        
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class MachineTypeViewSet(viewsets.ModelViewSet):
    queryset = MachineType.objects.all()
    serializer_class = MachineTypeSerializer
    permission_classes = [IsAuthenticated]

class MachineViewSet(viewsets.ModelViewSet):
    queryset = Machine.objects.all()
    serializer_class = MachineSerializer
    permission_classes = [IsAuthenticated]

class ElementViewSet(viewsets.ModelViewSet):
    queryset = Element.objects.all()
    serializer_class = ElementSerializer
    permission_classes = [IsAuthenticated]