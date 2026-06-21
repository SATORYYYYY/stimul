from rest_framework import serializers
from .models import DailyChallenge
import random

class DailyChallengeSerializer(serializers.ModelSerializer):
    progress_percentage = serializers.ReadOnlyField()
    challenge_type_display = serializers.CharField(source='get_challenge_type_display', read_only=True)
    difficulty_display = serializers.CharField(source='get_difficulty_display', read_only=True)

    class Meta:
        model = DailyChallenge
        fields = [
            'id', 'user', 'challenge_type', 'challenge_type_display',
            'target_value', 'current_value', 'progress_percentage',
            'difficulty', 'difficulty_display', 'date', 'is_completed', 'is_active',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['user', 'created_at', 'updated_at']

class DailyChallengeCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = DailyChallenge
        fields = ['challenge_type', 'difficulty']

    def create(self, validated_data):
        user = self.context['request'].user
        challenge_type = validated_data['challenge_type']
        difficulty = validated_data['difficulty']

        # Генерация случайного значения на основе типа и сложности
        target_value = self.generate_target_value(challenge_type, difficulty)

        challenge = DailyChallenge.objects.create(
            user=user,
            challenge_type=challenge_type,
            difficulty=difficulty,
            target_value=target_value
        )
        return challenge

    def generate_target_value(self, challenge_type, difficulty):
        """Генерация случайного значения задания на основе типа и сложности"""
        difficulty_multipliers = {
            'easy': 0.7,
            'medium': 1.0,
            'hard': 1.3,
            'extreme': 1.6
        }

        base_values = {
            'steps': 8000,
            'water': 2000, # Увеличено базовое значение для воды (мл)
            'duration': 60, # Увеличено базовое значение для времени (минут)
            'calories': 400
        }

        multiplier = difficulty_multipliers.get(difficulty, 1.0)
        base = base_values.get(challenge_type, 100)

        # Добавляем случайность ±20%
        random_factor = random.uniform(0.8, 1.2)
        target = int(base * multiplier * random_factor)

        # Округляем до удобных значений
        if challenge_type == 'steps':
            return (target // 100) * 100  # Округляем до сотен
        elif challenge_type in ['water', 'duration']:
            return max(1, target)  # Минимум 1
        elif challenge_type == 'calories':
            return (target // 50) * 50  # Округляем до 50
        return target
