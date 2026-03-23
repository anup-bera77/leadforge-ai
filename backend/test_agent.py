import os
import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "core.core.settings")

django.setup()

from core.agents.agent import LeadScoutAgent

agent = LeadScoutAgent()

result = agent.run(
    "Find 5 AI startups in Germany and extract their emails"
)

print(result)