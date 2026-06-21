from django.urls import path
from . import views

urlpatterns = [
    path('', views.DailyChallengeListView.as_view(), name='daily_challenges'),
    path('<int:pk>/', views.DailyChallengeDetailView.as_view(), name='daily_challenge_detail'),
    path('<int:pk>/progress/', views.update_challenge_progress, name='update_progress'),
    path('<int:pk>/complete/', views.complete_challenge, name='complete_challenge'),
    path('today/', views.get_todays_challenges, name='todays_challenges'),
    path('generate/', views.generate_daily_challenge, name='generate_challenge'),
]