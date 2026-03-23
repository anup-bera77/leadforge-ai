from django.http import JsonResponse
from django.http import HttpResponse
from .models import Lead
import csv


def get_leads(request):

    task_id = request.GET.get("task_id")
    if task_id:
        leads = Lead.objects.filter(task_id=task_id).order_by("-id")
    else:
        leads = Lead.objects.all().order_by("-id")

    data = []

    for lead in leads:
        data.append({
            "id": lead.id, 
            "company": lead.company_name,
            "location": lead.location,
            "email": lead.email,
            "phone": lead.phone,
            "linkedin": lead.linkedin
        })

    return JsonResponse(data, safe=False)


def export_leads(request):
    task_id = request.GET.get("task_id")

    leads = Lead.objects.filter(task_id=task_id)

    response = HttpResponse(content_type='text/csv')
    response['Content-Disposition'] = 'attachment; filename="leads.csv"'

    writer = csv.writer(response)
    writer.writerow(['Company', 'Email', 'Phone', 'Location', 'LinkedIn'])

    for lead in leads:
        writer.writerow([
            lead.company_name,
            lead.email,
            lead.phone,
            lead.location,
            lead.linkedin
        ])

    return response
