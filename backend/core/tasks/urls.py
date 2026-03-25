from django.urls import path
from .views import run_agent
from tasks.views import get_activity
from .views import get_tasks
from .views import classify_query_view

urlpatterns = [
    path('tasks/run-agent/', run_agent),
    path('activity/', get_activity),
    path('', get_tasks),
    path("tasks/classify-query", classify_query_view),
]