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

class TimeEntry(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE, 
        related_name='time_entries'
    )
    
    date = models.DateField(auto_now_add=True) # Data utworzenia wpisu
    start_time = models.DateTimeField() # Kiedy pracownik kliknął "Rozpocznij pracę"
    end_time = models.DateTimeField(null=True, blank=True) # Kiedy kliknął "Zakończ". Puste póki pracuje!

    def __str__(self):
        return f"Wpis: {self.user.username} - {self.date}"