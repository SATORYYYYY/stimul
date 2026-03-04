from django.db import models
from django.contrib.auth.models import User

class Goal(models.Model):
    GOAL_TYPES = [
        ('steps', 'Шаги'),
        ('duration', 'Минуты активности'),
        ('calories', 'Калории'),
        ('water', 'Вода'),
        ('custom', 'Своя цель'),
    ]
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='goals')
    title = models.CharField(max_length=200)  
    goal_type = models.CharField(max_length=20, choices=GOAL_TYPES)
    target_value = models.FloatField(help_text="Целевое значение")
    current_value = models.FloatField(default=0.0, help_text="Текущий прогресс")
    unit = models.CharField(max_length=20, default="шаги")  
    start_date = models.DateField(auto_now_add=True)
    end_date = models.DateField(null=True, blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.title} ({self.target_value} {self.unit})"
# Create your models here.
