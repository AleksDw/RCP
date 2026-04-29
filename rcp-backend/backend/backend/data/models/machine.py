from django.db import models

class Machine(models.Model):
    machine_name = models.CharField(max_length=255)
    
    id_type = models.ForeignKey('MachineType', on_delete=models.CASCADE, related_name='machines')
    
    def __str__(self):
        return self.machine_name