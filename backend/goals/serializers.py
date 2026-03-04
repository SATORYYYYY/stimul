from rest_framework import serializers
from .models import Goal

class GoalSerializer(serializers.ModelSerializer):
    class Meta:
        model = Goal
        fields = '__all__'
        read_only_fields = ('user',)
        extra_kwargs = {
            'end_date': {'allow_null': True, 'required': False}
        }