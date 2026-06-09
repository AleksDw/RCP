from django.db import models

class MachineType(models.Model):
    type_name = models.CharField(max_length=255)
    
    def __str__(self):
        return self.type_name