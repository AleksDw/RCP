from django.db import models
from django.conf import settings

class UserMachine(models.Model):
    id_user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='assigned_machines')
    id_machine = models.ForeignKey('Machine', on_delete=models.CASCADE, related_name='assigned_users')

    def __str__(self):
        return f"User: {self.id_user.username} - Machine: {self.id_machine.machine_name}"