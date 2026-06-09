from django.db import models
from django.conf import settings

class TimeEntry(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='time_entries')
    machine = models.ForeignKey('Machine', on_delete=models.CASCADE, related_name='time_entries')
    element = models.ForeignKey('Element', on_delete=models.CASCADE, related_name='time_entries', null=True,blank=True)
    
    start_time = models.DateTimeField(verbose_name="Entry Time")
    end_time = models.DateTimeField(null=True, blank=True, verbose_name="Exit Time")
    amount_of_elements = models.PositiveIntegerField(default=1, verbose_name="Number of elements produced")

    def __str__(self):
        return f"Entry: {self.user.username} - {self.start_time.strftime('%Y-%m-%d')}"