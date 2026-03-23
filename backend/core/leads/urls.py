from django.urls import path
from .views import get_leads, export_leads

urlpatterns = [
    path('', get_leads),              # /leads
    path('export', export_leads),    
]