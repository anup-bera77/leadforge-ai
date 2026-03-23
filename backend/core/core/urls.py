"""
URL configuration for core project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.http import JsonResponse

from django.urls import path,include
from tasks.views import create_task,get_tasks
from leads.views import get_leads
from tasks.views import run_agent
from tasks.views import get_activity
from leads.views import export_leads

def home(request):
    return JsonResponse({
        "message": "LeadScout AI Agent API is running 🚀"
    })

urlpatterns = [
    path('', home),
    path('admin/', admin.site.urls),
    path('tasks/', include('tasks.urls')),
    path('leads/', include('leads.urls')),
]
