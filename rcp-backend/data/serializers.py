from data.models.timeEntry import TimeEntry
from data.models.machine import Machine
from data.models.machineType import MachineType
from data.models.element import Element
from rest_framework import serializers

class TimeEntrySerializer(serializers.ModelSerializer):
    user_name = serializers.SerializerMethodField()
    machine_name = serializers.CharField(source='machine.machine_name', read_only=True)

    element_name = serializers.SerializerMethodField()

    expected_minutes = serializers.SerializerMethodField()
    actual_minutes = serializers.SerializerMethodField()
    efficiency = serializers.SerializerMethodField()

    class Meta:
        model = TimeEntry
        fields = [
            'id',
            'user',
            'user_name',

            'machine',
            'machine_name',

            'element',
            'element_name',

            'start_time',
            'end_time',
            'amount_of_elements',

            'expected_minutes',
            'actual_minutes',
            'efficiency',
        ]
        read_only_fields = ['user']

    def get_user_name(self, obj):
        return f"{obj.user.first_name} {obj.user.last_name}"

    def get_element_name(self, obj):
        if not obj.element:
            return None
        return obj.element.element_name

    def get_expected_minutes(self, obj):
        if not obj.element:
            return None

        return obj.amount_of_elements * obj.element.estimated_time_per_item

    def get_actual_minutes(self, obj):
        if not obj.end_time:
            return None

        duration = obj.end_time - obj.start_time
        return round(duration.total_seconds() / 60, 2)

    def get_efficiency(self, obj):
        if not obj.end_time or not obj.element:
            return None

        actual = self.get_actual_minutes(obj)
        expected = self.get_expected_minutes(obj)

        if not actual or actual <= 0:
            return None

        return round((expected / actual) * 100, 2)

class MachineTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = MachineType
        fields = ['id', 'type_name']

class MachineSerializer(serializers.ModelSerializer):
    class Meta:
        model = Machine
        fields = ['id', 'machine_name', 'id_type']

class ElementSerializer(serializers.ModelSerializer):
    class Meta:
        model = Element
        fields = ['id', 'element_name', 'id_type', 'estimated_time_per_item']

    def validate_estimated_time_per_item(self, value):
        if value <= 0:
            raise serializers.ValidationError("Szacowany czas musi być liczbą całkowitą większą od 0.")
        return value
