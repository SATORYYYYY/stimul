from django.db import models
from django.contrib.auth.models import User

class Activity(models.Model):
    ACTIVITY_TYPES = [
        ('walk', 'Ходьба'),
        ('run', 'Бег'),
        ('gym', 'Тренажерный зал'),
        ('yoga', 'Йога'),
        ('other', 'Другое'),
    ]
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='activities')
    activity_type = models.CharField(max_length=20, choices=ACTIVITY_TYPES)
    duration = models.IntegerField(help_text="Длительность в минутах")  
    date = models.DateField(auto_now_add=False)
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    latitude = models.FloatField(null=True, blank=True)
    longitude = models.FloatField(null=True, blank=True)

    def __str__(self):
        return f"{self.user.username} - {self.activity_type} - {self.date}"
# Create your models here.
