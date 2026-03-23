from dotenv import load_dotenv
import os
from google import genai
import json
import re

load_dotenv()

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))


class Planner:

    # ─────────────────────────────────────────────
    # CLEAN JSON (ROBUST PARSING)
    # ─────────────────────────────────────────────
    def clean_json(self, text):
        text = text.strip()

        # Extract from ```json block
        md_match = re.search(r"```json\s*(\{.*?\})\s*```", text, re.DOTALL)
        if md_match:
            text = md_match.group(1)
        else:
            # Extract first JSON object
            brace_match = re.search(r"(\{.*\})", text, re.DOTALL)
            if brace_match:
                text = brace_match.group(1)

        try:
            return json.loads(text)
        except json.JSONDecodeError:
            return {
                "error": "Invalid JSON from LLM",
                "raw": text
            }

    # ─────────────────────────────────────────────
    # CREATE PLAN (CORE FUNCTION)
    # ─────────────────────────────────────────────
    def create_plan(self, task_description):

        prompt = f"""
You are an AI execution planner for a lead generation agent.

USER TASK:
"{task_description}"

YOUR JOB:
- Understand the user request
- Extract how many leads are required (default = 5)
- Generate a short and effective search query

Return ONLY JSON:

{{
  "search_query": "...",
  "target_leads": number
}}

RULES:
- Keep search query concise and optimized for Google
- Focus on real-world companies only
- If no number specified, use 5
- Do not include explanation or extra text
"""

        try:
            response = client.models.generate_content(
                model="gemini-2.5-flash",
                contents=prompt,
                config={
                    "temperature": 0.2,
                    "max_output_tokens": 200
                }
            )

            text = response.text
            plan_dict = self.clean_json(text)

        except Exception as e:
            # 🔥 Fallback if API fails
            return {
                "search_query": task_description,
                "target_leads": 5
            }

        # ─────────────────────────────────────────────
        # SAFETY HANDLING
        # ─────────────────────────────────────────────

        if "error" in plan_dict:
            return {
                "search_query": task_description,
                "target_leads": 5
            }

        search_query = plan_dict.get("search_query", task_description)
        target_leads = plan_dict.get("target_leads", 5)

        # Ensure integer
        try:
            target_leads = int(target_leads)
        except:
            target_leads = 5

        # Safety constraints
        if target_leads <= 0:
            target_leads = 5

        target_leads = min(target_leads, 20)  # cap for performance

        return {
            "search_query": search_query,
            "target_leads": target_leads
        }