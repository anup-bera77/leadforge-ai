from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.http import JsonResponse
from tasks.models import Task
from agents.agent import LeadScoutAgent
import json
from django.views.decorators.csrf import csrf_exempt
from agents.agent import GLOBAL_ACTIVITY_LOGS
from rest_framework.decorators import api_view
from .utils.query_classifier import classify_query


@api_view(["POST"])
def create_task(request):

    description = request.data.get("description")

    task = Task.objects.create(description=description)

    agent = LeadScoutAgent()

    result = agent.run(description)

    task.status = "completed"
    task.save()

    return Response({
        "task_id": task.id,
        "status": task.status,
        "result": result
    })


@csrf_exempt
def run_agent(request):

    if request.method == "POST":

        body = json.loads(request.body)
        description = body.get("description")
        classification = classify_query(description)
        agent = LeadScoutAgent()
        result = agent.run(description)

        from tasks.models import Task
        task = Task.objects.latest("id")

        return JsonResponse({
            "status": "success",
            "result": result,
            "task_id": task.id,
            "total_found": len(result),
            "query_type": classification["type"], 
            "query_reason": classification["reason"] , 
        })
    
@api_view(["GET"])
def get_tasks(request):
    tasks = Task.objects.all().order_by('-id')[:20]

    data = []
    for t in tasks:
        data.append({
            "id": t.id,
            "description": t.description,
            "status": t.status,
            "created_at": t.created_at
        })

    return JsonResponse(data, safe=False)

def classify_query_view(request):
    try:
        body = json.loads(request.body)
        query = body.get("query", "")

        result = classify_query(query)

        return JsonResponse(result)

    except Exception as e:
        return JsonResponse({
            "type": "REALISTIC",
            "reason": "Error processing query"
        })
    


def get_activity(request):
    return JsonResponse(GLOBAL_ACTIVITY_LOGS, safe=False)