# logger_phase4.py
import json
from datetime import datetime
from pathlib import Path

UNKNOWN_LOG_FILE = Path("unmatched_inputs.json")

def log_unknown_input(
    user_input: str,
    suggestions: list,
    source: str = "none",
    scores: dict = None,
    llm_response: str = None
):
    """
    Log unknown or low-confidence inputs for analysis and retraining.

    Args:
        user_input (str): The text from the user that failed to match.
        suggestions (list): A list of potential fallback FAQ keys.
        source (str): Which method produced the best (but insufficient) result.
                      One of ["intent", "semantic", "fuzzy", "llm", "none"].
        scores (dict): Optional dictionary of confidence scores from all models.
        llm_response (str): Optional GPT-4o-mini fallback output for reference.
    """
    log_entry = {
        "timestamp": datetime.now().isoformat(),
        "user_input": user_input,
        "method_used": source,
        "scores": scores or {},
        "suggestions": suggestions,
        "llm_response": llm_response
    }

    # Read existing data safely or initialize a new list
    if UNKNOWN_LOG_FILE.exists():
        try:
            with open(UNKNOWN_LOG_FILE, "r", encoding="utf-8") as f:
                data = json.load(f)
        except json.JSONDecodeError:
            data = []
    else:
        data = []

    # Append and rewrite file
    data.append(log_entry)
    with open(UNKNOWN_LOG_FILE, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2)

def get_unmatched_summary(limit=10):
    """
    Retrieve recent unmatched inputs for inspection.

    Args:
        limit (int): Number of recent entries to retrieve.

    Returns:
        list: Recent unmatched log entries.
    """
    if not UNKNOWN_LOG_FILE.exists():
        return []

    try:
        with open(UNKNOWN_LOG_FILE, "r", encoding="utf-8") as f:
            data = json.load(f)
    except json.JSONDecodeError:
        data = []

    return data[-limit:]
