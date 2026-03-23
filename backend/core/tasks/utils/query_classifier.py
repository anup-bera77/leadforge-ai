from google import genai
import os
import json
from dotenv import load_dotenv

load_dotenv()

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

def classify_query(query: str):
    try:
        prompt = f"""
Classify the following user query:

"{query}"

Return ONLY JSON:
{{
  "type": "REALISTIC" or "UNREALISTIC",
  "reason": "short reason"
}}
"""

        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt
        )

        text = response.text.strip()

        try:
            return json.loads(text)
        except:
            return {
                "type": "REALISTIC",
                "reason": "Could not parse response"
            }

    except Exception as e:
        return {
            "type": "REALISTIC",
            "reason": f"Error: {str(e)}"
        }