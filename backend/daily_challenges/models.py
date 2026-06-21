from django.db import models
from django.contrib.auth.models import User

class DailyChallenge(models.Model):
    DIFFICULTY_CHOICES = [
        ('easy', 'Легкая'),
        ('medium', 'Средняя'),
        ('hard', 'Тяжелая'),
        ('extreme', 'Экстремальная'),
    ]

    CHALLENGE_TYPE_CHOICES = [
        ('steps', 'Шаги'),
        ('water', 'Вода'),
        ('duration', 'Время тренировки'),
        ('calories', 'Калории'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='daily_challenges')
    challenge_type = models.CharField(max_length=20, choices=CHALLENGE_TYPE_CHOICES)
    target_value = models.IntegerField()
    current_value = models.IntegerField(default=0)
    difficulty = models.CharField(max_length=10, choices=DIFFICULTY_CHOICES, default='medium')
    date = models.DateField(auto_now_add=True)
    is_completed = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-date', '-created_at']
        verbose_name = 'Ежедневное задание'
        verbose_name_plural = 'Ежедневные задания'

    def __str__(self):
        return f'{self.user.username} - {self.get_challenge_type_display()}: {self.current_value}/{self.target_value}'

    @property
    def progress_percentage(self):
        if self.target_value == 0:
            return 0
        return min((self.current_value / self.target_value) * 100, 100)

    def complete(self):
        """Отметить задание как выполненное"""
        self.is_completed = True
        self.current_value = self.target_value
        self.save()
