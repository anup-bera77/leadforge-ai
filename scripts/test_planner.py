from google import genai
import os
import json
from dotenv import load_dotenv

load_dotenv()

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

response = client.models.generate_content(
    model="gemini-2.5-flash",
    contents="""
Convert this task into JSON steps for a web automation agent.

Task: Find 20 AI startups in Germany and extract their emails.

Return ONLY JSON steps.
"""
)

print(response.text)

def clean_json(text):
    text = text.strip()

    # remove ```json or ``` if present
    if text.startswith("```"):
        lines = text.splitlines()

        # remove first line (```json or ```)
        if lines[0].startswith("```"):
            lines = lines[1:]

        # remove last line if it is ```
        if lines and lines[-1].startswith("```"):
            lines = lines[:-1]

        text = "\n".join(lines)

    return text.strip()

clean_text = clean_json(response.text)

steps = json.loads(clean_text)

print(steps)