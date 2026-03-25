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
from rest_framework import status
import traceback


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


# @api_view(['POST', 'GET'])
# 
@csrf_exempt
@api_view(['POST'])
def run_agent(request,*args, **kwargs):
    try:
        description = request.data.get("description")

        if not description:
            return Response({
                "error": "Description is required"
            }, status=400)

        print("🔥 INPUT:", description)

        # ❌ Removed classify_query (for now)

        print("🚀 Running agent...")

        # TEMP TEST RESPONSE
        result = [{"name": "Test Company"}]

        print("✅ RESULT:", result)

        return Response({
            "status": "success",
            "result": result
        })

    except Exception as e:
        import traceback
        print("❌ ERROR:", str(e))
        traceback.print_exc()

        return Response({
            "error": str(e)
        }, status=500)
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