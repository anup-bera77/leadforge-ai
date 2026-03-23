from agents.planner.planner import Planner
from agents.executor.executor import Executor
from services.tinyfish_client import TinyFishBrowser

from leads.models import Lead
from tasks.models import Task

# ✅ GLOBAL LOGS (for frontend activity)
GLOBAL_ACTIVITY_LOGS = []


class LeadScoutAgent:

    def __init__(self):
        self.planner = Planner()
        self.browser = TinyFishBrowser()
        self.executor = Executor(self.browser)

    def run(self, task_description):

        print("Starting task:", task_description)

        GLOBAL_ACTIVITY_LOGS.clear()

        GLOBAL_ACTIVITY_LOGS.append({
            "type": "START",
            "message": f"Task started: {task_description}"
        })

        # Create Task
        task = Task.objects.create(
            description=task_description,
            status="running"
        )

        # ─────────────────────────────────────────────
        # PLANNER
        # ─────────────────────────────────────────────
        try:
            plan = self.planner.create_plan(task_description)

            search_query = plan.get("search_query") or task_description
            target_leads = plan.get("target_leads", 5)

            print("Generated Plan:", plan)

            GLOBAL_ACTIVITY_LOGS.append({
                "type": "PLAN",
                "message": f"Plan ready → target {target_leads} leads"
            })

        except Exception as e:
            print("Planner failed:", e)
            search_query = task_description
            target_leads = 5

        # Safety constraints for volume
        if target_leads <= 0:
            target_leads = 5
        target_leads = min(target_leads, 20)

        # ─────────────────────────────────────────────
        # ⚡ DYNAMIC TIME CONTROL
        # ─────────────────────────────────────────────
        # Bound limits: min 20s, max 60s, scales by 5s per lead requested
        MAX_TIME = max(20, min(target_leads * 5, 60))
        max_sites = min(target_leads * 2, 6)

        print(f" Launching TinyFish autonomous agent (Time budget: {MAX_TIME}s)...")
        recent_companies = list(Lead.objects.values_list('company_name', flat=True).order_by('-id')[:50])
        blacklist_string = ", ".join(recent_companies) if recent_companies else "None"

        # ─────────────────────────────────────────────
        # 🤖 TINYFISH GOAL (WITH FALLBACK & SPEED RULES)
        # ─────────────────────────────────────────────
        enhanced_goal = f"""
TASK: {search_query}

You are a high-precision data extraction agent.

PROCESS:
1. Search for relevant companies based on the TASK.
2. Visit each company's official website.
3. Navigate to Contact / About / Footer pages.
4. Extract contact details carefully.

FALLBACK RULE (CRITICAL):
- If the TASK contains unrealistic, impossible, or historical parameters that yield zero exact search results, DO NOT stop or return an empty list.
- Instead, find the closest, most relevant modern equivalents available today and extract those instead.

BLACKLIST RULE (CRITICAL):
- Do NOT extract data for any of the following companies, as we already have them:
[{blacklist_string}]
- If you see these companies in the Google search results, SKIP them entirely and find different ones.

SPEED RULES:
- You have a strict execution time limit of {MAX_TIME} seconds.
- Visit at most {max_sites} websites.
- Stop early once enough companies are found.


DATA & QUALITY RULES:
- Always prioritize official website data
- Try HARD to find email
- If email not found, return ""
- Do NOT include descriptions or founders
- Skip companies with no useful contact info (email/phone/linkedin missing)
- Priority: Email > LinkedIn > Phone

STRICT OUTPUT RULES:
- Return ONLY raw JSON
- No markdown
- No explanation
- Return EXACTLY {target_leads} companies (or as close as possible within the time limit)

OUTPUT FORMAT:
{{
  "results": [
    {{
      "name": "Company Name",
      "location": "City, Country",
      "email": "contact@company.com",
      "phone": "",
      "linkedin": "",
      "website": "https://company.com"
    }}
  ]
}}
"""

        # ─────────────────────────────────────────────
        # RUN TINYFISH
        # ─────────────────────────────────────────────
        # Note: Make sure tinyfish_client.py accepts timeout_seconds if you pass it here!
        events = self.browser.run_agent(
            url="https://google.com",
            goal=enhanced_goal,
            timeout_seconds=MAX_TIME 
        )

        complete_event = None

        # ─────────────────────────────────────────────
        # PROCESS EVENTS
        # ─────────────────────────────────────────────
        for event in events:
            #  REMOVED the time.time() break logic so we don't discard valid data!
            
            if event.get("type") == "PROGRESS":
                msg = event.get("purpose")
                print("⚙️", msg)

                GLOBAL_ACTIVITY_LOGS.append({
                    "type": "PROGRESS",
                    "message": msg
                })

            if event.get("type") == "COMPLETE":
                complete_event = event

        # ─────────────────────────────────────────────
        #  FAIL CASE
        # ─────────────────────────────────────────────
        if not complete_event:
            print(" COMPLETE event NOT found")

            GLOBAL_ACTIVITY_LOGS.append({
                "type": "ERROR",
                "message": "Agent failed to complete or timed out"
            })

            task.status = "failed"
            task.save()
            return None

        # ─────────────────────────────────────────────
        #  EXTRACT RESULTS (DYNAMIC KEY SAFE)
        # ─────────────────────────────────────────────
        result_data = complete_event.get("result", {})
        startups = []

        # Find the first key that contains a list, regardless of what the AI named it
        for key, value in result_data.items():
            if isinstance(value, list):
                startups = value
                break

        #  Partial fallback warning
        if not startups or len(startups) < max(2, target_leads // 2):
            print(" Partial or empty results returned")

            GLOBAL_ACTIVITY_LOGS.append({
                "type": "WARNING",
                "message": f"Only {len(startups)} results found"
            })

        # ─────────────────────────────────────────────
        # SAVE TO DB (DEDUPLICATION SAFE)
        # ─────────────────────────────────────────────
        saved_count = 0

        for startup in startups:
            name = startup.get("name", "").strip()
            email = startup.get("email", "").strip()
            linkedin = startup.get("linkedin", "").strip()

            if not name:
                continue

            # Strict duplication checks
            exists = Lead.objects.filter(company_name__iexact=name).exists()
            email_exists = email and Lead.objects.filter(email__iexact=email).exists()
            linkedin_exists = linkedin and Lead.objects.filter(linkedin__iexact=linkedin).exists()

            if exists or email_exists or linkedin_exists:
                print(f"Skipping duplicate: {name}")
                continue

            Lead.objects.create(
                task=task,
                company_name=name,
                email=email,
                website=startup.get("website", ""),
                phone=startup.get("phone", ""),
                location=startup.get("location", ""),
                linkedin=linkedin
            )

            saved_count += 1

        # ─────────────────────────────────────────────
        # COMPLETE TASK
        # ─────────────────────────────────────────────
        task.status = "completed"
        task.save()

        GLOBAL_ACTIVITY_LOGS.append({
            "type": "COMPLETE",
            "message": f"{saved_count} unique leads saved"
        })

        print(f"Saved {saved_count} new leads to database")

        return startups