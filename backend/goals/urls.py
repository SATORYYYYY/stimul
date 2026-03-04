from django.urls import path
from . import views

urlpatterns = [
    path('', views.GoalListCreateView.as_view(), name='goal-list'),
    path('<int:pk>/', views.GoalDetailView.as_view(), name='goal-detail'),
]