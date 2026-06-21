from django.contrib import admin
from .models import DailyChallenge

@admin.register(DailyChallenge)
class DailyChallengeAdmin(admin.ModelAdmin):
    list_display = ['user', 'challenge_type', 'target_value', 'current_value', 'difficulty', 'date', 'is_completed']
    list_filter = ['challenge_type', 'difficulty', 'date', 'is_completed']
    search_fields = ['user__username', 'challenge_type']
    readonly_fields = ['created_at', 'updated_at', 'progress_percentage']
    date_hierarchy = 'date'

    fieldsets = (
        ('Основная информация', {
            'fields': ('user', 'challenge_type', 'difficulty')
        }),
        ('Значения', {
            'fields': ('target_value', 'current_value', 'progress_percentage')
        }),
        ('Статус', {
            'fields': ('is_completed', 'is_active', 'date')
        }),
        ('Метаданные', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
