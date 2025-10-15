# rule_responses_phase4.py
import json
import os

faq_file_path = os.path.join(os.path.dirname(__file__), 'unity_faq_dict.json')

with open(faq_file_path, 'r', encoding='utf-8') as f:
    faq_dict = json.load(f)

def get_response(intent: str):
    """
    Return the FAQ response for a given intent key.
    """
    return faq_dict.get(intent)
