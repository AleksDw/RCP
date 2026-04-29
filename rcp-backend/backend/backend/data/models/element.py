from django.contrib.auth.models import AbstractUser
from django.db import models
from django.conf import settings
class Element(models.Model):
    element_name = models.CharField(max_length=255)
    id_type = models.ForeignKey('MachineType', on_delete=models.CASCADE, related_name='elements')
    estimated_time_per_item = models.IntegerField()

    def __str__(self):
        return self.element_name