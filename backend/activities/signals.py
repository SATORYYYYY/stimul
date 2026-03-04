from django.db.models.signals import post_save
from django.dispatch import receiver
from django.db.models import Sum 
from .models import Activity
from goals.models import Goal

@receiver(post_save, sender=Activity)
def update_goals(sender, instance, created, **kwargs):
    if created:
        user = instance.user
        active_goals = Goal.objects.filter(user=user, is_active=True)
        for goal in active_goals:
            if goal.goal_type == 'duration':
                total_duration = Activity.objects.filter(user=user, date=instance.date).aggregate(total=Sum('duration'))['total'] or 0
                goal.current_value = total_duration
                goal.save()
