from data.models.timeEntry import TimeEntry
from data.models.machine import Machine
from data.models.machineType import MachineType
from rest_framework import serializers

class TimeEntrySerializer(serializers.ModelSerializer):
    class Meta:
        model = TimeEntry
        fields = ['id', 'user', 'machine', 'element', 'start_time', 'end_time', 'amount_of_elements']
        read_only_fields = ['user']

class MachineTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = MachineType
        fields = ['id', 'type_name']

class MachineSerializer(serializers.ModelSerializer):
    class Meta:
        model = Machine
        fields = ['id', 'machine_name', 'id_type']