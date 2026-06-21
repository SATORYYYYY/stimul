from rest_framework import generics, permissions, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.utils import timezone
from datetime import date, timedelta
from .models import DailyChallenge
from .serializers import DailyChallengeSerializer, DailyChallengeCreateSerializer


class DailyChallengeListView(generics.ListCreateAPIView):
    serializer_class = DailyChallengeSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return DailyChallenge.objects.filter(user=user).order_by('-date', '-created_at')

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return DailyChallengeCreateSerializer
        return DailyChallengeSerializer


class DailyChallengeDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = DailyChallengeSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return DailyChallenge.objects.filter(user=self.request.user)


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def update_challenge_progress(request, pk):
    """Обновление прогресса задания"""
    try:
        challenge = DailyChallenge.objects.get(pk=pk, user=request.user)
        increment = request.data.get('increment', 1)

        challenge.current_value += increment
        if challenge.current_value >= challenge.target_value:
            challenge.is_completed = True
            challenge.current_value = challenge.target_value

        challenge.save()
        serializer = DailyChallengeSerializer(challenge)
        return Response(serializer.data)
    except DailyChallenge.DoesNotExist:
        return Response({'error': 'Задание не найдено'}, status=status.HTTP_404_NOT_FOUND)


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def complete_challenge(request, pk):
    """Завершение задания"""
    try:
        challenge = DailyChallenge.objects.get(pk=pk, user=request.user)
        challenge.complete()
        serializer = DailyChallengeSerializer(challenge)
        return Response(serializer.data)
    except DailyChallenge.DoesNotExist:
        return Response({'error': 'Задание не найдено'}, status=status.HTTP_404_NOT_FOUND)


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def get_todays_challenges(request):
    """Получить задания на сегодня"""
    today = date.today()
    challenges = DailyChallenge.objects.filter(
        user=request.user,
        date=today,
        is_active=True
    ).order_by('-created_at')
    serializer = DailyChallengeSerializer(challenges, many=True)
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def generate_daily_challenge(request):
    """Сгенерировать случайное ежедневное задание"""
    import random

    challenge_types = ['steps', 'water', 'duration', 'calories']
    difficulties = ['easy', 'medium', 'hard', 'extreme']

    # Выбираем случайный тип и сложность с весами
    challenge_type = random.choices(
        challenge_types,
        weights=[40, 20, 25, 15],  # Шаги чаще всего
        k=1
    )[0]

    difficulty = random.choices(
        difficulties,
        weights=[30, 40, 20, 10],  # Средняя сложность чаще
        k=1
    )[0]

    data = {
        'challenge_type': challenge_type,
        'difficulty': difficulty
    }

    serializer = DailyChallengeCreateSerializer(
        data=data,
        context={'request': request}
    )

    if serializer.is_valid():
        challenge = serializer.save()
        response_serializer = DailyChallengeSerializer(challenge)
        return Response(response_serializer.data, status=status.HTTP_201_CREATED)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
