from django.contrib.auth.models import AbstractUser
from django.db import models
from django.conf import settings
class CustomUser(AbstractUser):
    ROLE_CHOICES = (
        ('employee', 'Pracownik'),
        ('employer', 'Pracodawca'),
        ('technical', 'technik'),
    )
    
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='employee')

    def __str__(self):
        return f"{self.username} ({self.get_role_display()})"
