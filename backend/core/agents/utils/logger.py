# agents/utils/logger.py

import time

GLOBAL_ACTIVITY_LOGS = []

def log(message):
    GLOBAL_ACTIVITY_LOGS.append({
        "message": message,
        "time": time.strftime("%H:%M:%S")
    })