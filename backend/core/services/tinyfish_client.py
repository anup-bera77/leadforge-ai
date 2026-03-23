import os
import requests
from dotenv import load_dotenv
import json

load_dotenv()


class TinyFishBrowser:

    def __init__(self):
        self.api_key = os.getenv("TINYFISH_API_KEY")
        self.base_url = "https://agent.tinyfish.ai/v1"

    def run_agent(self, url, goal, timeout_seconds=None):
        payload = {
            "url": url,
            "goal": goal
        }

        headers = {
            "X-API-Key": self.api_key,
            "Content-Type": "application/json"
        }

        try:
            response = requests.post(
                f"{self.base_url}/automation/run-sse",
                json=payload,
                headers=headers,
                stream=True,
                timeout=(15, timeout_seconds or 60)  #  request timeout control
            )
        except requests.exceptions.Timeout:
            print("TinyFish request timed out")
            return []

        events = []

        try:
            for line in response.iter_lines():

                if line:
                    decoded = line.decode("utf-8").strip()

                    if decoded.startswith("data:"):
                        json_str = decoded[5:].strip()

                        try:
                            obj = json.loads(json_str)
                            events.append(obj)

                        except json.JSONDecodeError:
                            continue

        except requests.exceptions.ChunkedEncodingError:
            print("Stream closed early, using collected data.")

        except requests.exceptions.Timeout:
            print("Stream timeout reached")

        except Exception as e:
            print("TinyFish stream error:", e)

        return events