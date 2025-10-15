# nlp_handler_phase4.py
import re
import spacy
from spacy.matcher import PhraseMatcher, Matcher
from functools import lru_cache
from typing import Dict, Any
import pickle
from pathlib import Path
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
import json

# ========================
# Load spaCy model
# ========================
try:
    nlp = spacy.load("en_core_web_md")
except OSError:
    print("[INFO] spaCy model not found, downloading 'en_core_web_md'...")
    from spacy.cli import download
    download("en_core_web_md")
    nlp = spacy.load("en_core_web_md")

# ========================
# PhraseMatcher for simple phrases
# ========================
phrase_matcher = PhraseMatcher(nlp.vocab, attr="LOWER")
INTENT_PATTERNS = {
    "greeting": ["hello", "hi", "hey", "good morning", "good evening", "howdy", "greetings"],
    "goodbye": ["bye", "goodbye", "see you", "take care"],
    "thanks": ["thank you", "thanks", "appreciate it"],
    "chitchat": ["how are you", "what's up", "how’s it going", "tell me a joke"]
}
for intent, phrases in INTENT_PATTERNS.items():
    phrase_matcher.add(intent, [nlp.make_doc(p) for p in phrases])

# ========================
# Matcher for token patterns
# ========================
matcher = Matcher(nlp.vocab)
matcher.add("volunteer_info", [[{"LOWER": "volunteer"}]])
matcher.add("mission_overview", [[{"LOWER": "mission"}]])
matcher.add("contact_info", [[{"LOWER": "contact"}]])
matcher.add("contact_info", [[{"LOWER": "email"}]])

# ========================
# Regex patterns for common phrases
# ========================
REGEX_PATTERNS = {
    "volunteer_info": [r"\bjoin\b", r"\bhelp out\b", r"\bget involved\b"],
    "contact_info": [r"\bwho can I contact\b", r"\bemail\b", r"\breach\b"],
    "mission_overview": [r"what is your mission\b", r"tell me about your goal"]
}

# ========================
# Text utilities
# ========================
def normalize_text(text: str) -> str:
    text = re.sub(r"[^\w\s.,!?'-]", "", text)
    text = re.sub(r"\s+", " ", text).strip()
    return text.lower()

def keyword_confidence(text: str, keywords: list) -> float:
    tokens = set(text.split())
    overlap = len(tokens.intersection(set(k.lower() for k in keywords)))
    return round(overlap / max(len(tokens), 1), 2)

# ========================
# ML classifier globals
# ========================
MODEL_PATH = Path("intent_classifier.pkl")
VECT_PATH = Path("tfidf_vectorizer.pkl")
FAQ_JSON_PATH = Path("unity_faq_dict.json")

clf_model = None
tfidf_vectorizer = None

# ========================
# Train ML classifier
# ========================
def train_ml_classifier():
    if not FAQ_JSON_PATH.exists():
        print(f"[WARNING] {FAQ_JSON_PATH} not found. Cannot train ML classifier.")
        return

    with open(FAQ_JSON_PATH, "r", encoding="utf-8") as f:
        faq_data = json.load(f)

    X = list(faq_data.keys())
    y = [faq_data[q]["intent"] for q in X]

    vectorizer = TfidfVectorizer(lowercase=True, ngram_range=(1,2))
    X_tfidf = vectorizer.fit_transform(X)

    clf = LogisticRegression(max_iter=500)
    clf.fit(X_tfidf, y)

    with open(MODEL_PATH, "wb") as f:
        pickle.dump(clf, f)
    with open(VECT_PATH, "wb") as f:
        pickle.dump(vectorizer, f)

    print(f"[INFO] ML classifier trained and saved to {MODEL_PATH} / {VECT_PATH}")

# ========================
# Load or train ML classifier
# ========================
def load_ml_classifier():
    global clf_model, tfidf_vectorizer
    if MODEL_PATH.exists() and VECT_PATH.exists():
        with open(MODEL_PATH, "rb") as f:
            clf_model = pickle.load(f)
        with open(VECT_PATH, "rb") as f:
            tfidf_vectorizer = pickle.load(f)
        print("[INFO] ML classifier loaded into memory.")
    else:
        print("[WARNING] ML classifier not found. Training a new model...")
        train_ml_classifier()
        if MODEL_PATH.exists() and VECT_PATH.exists():
            with open(MODEL_PATH, "rb") as f:
                clf_model = pickle.load(f)
            with open(VECT_PATH, "rb") as f:
                tfidf_vectorizer = pickle.load(f)
            print("[INFO] ML classifier trained and loaded.")

# Load ML classifier at module import
load_ml_classifier()

# ========================
# Main NLU analyzer
# ========================
@lru_cache(maxsize=256)
def analyze_intent(user_input: str) -> Dict[str, Any]:
    cleaned = normalize_text(user_input)
    doc = nlp(cleaned)

    # 1. PhraseMatcher
    matches = phrase_matcher(doc)
    if matches:
        intent = nlp.vocab.strings[matches[0][0]]
        return {"text": user_input, "cleaned": cleaned, "intent": intent, "confidence": 0.9,
                "tokens": [t.text for t in doc], "language": doc.lang_ if hasattr(doc, "lang_") else "en"}

    # 2. Matcher
    matches = matcher(doc)
    if matches:
        intent = nlp.vocab.strings[matches[0][0]]
        return {"text": user_input, "cleaned": cleaned, "intent": intent, "confidence": 0.85,
                "tokens": [t.text for t in doc], "language": doc.lang_ if hasattr(doc, "lang_") else "en"}

    # 3. Regex patterns
    for intent, patterns in REGEX_PATTERNS.items():
        for pattern in patterns:
            if re.search(pattern, cleaned):
                return {"text": user_input, "cleaned": cleaned, "intent": intent, "confidence": 0.8,
                        "tokens": [t.text for t in doc], "language": doc.lang_ if hasattr(doc, "lang_") else "en"}

    # 4. ML classifier (if loaded)
    if clf_model and tfidf_vectorizer:
        X = tfidf_vectorizer.transform([cleaned])
        pred = clf_model.predict(X)[0]
        proba = clf_model.predict_proba(X).max()
        return {"text": user_input, "cleaned": cleaned, "intent": pred, "confidence": float(proba),
                "tokens": [t.text for t in doc], "language": doc.lang_ if hasattr(doc, "lang_") else "en"}

    # 5. Keyword fallback
    if "mission" in cleaned:
        intent, conf = "mission_overview", keyword_confidence(cleaned, ["mission", "serve", "goal"])
    elif "join" in cleaned or "volunteer" in cleaned:
        intent, conf = "volunteer_info", keyword_confidence(cleaned, ["join", "volunteer", "help"])
    elif "contact" in cleaned or "email" in cleaned:
        intent, conf = "contact_info", keyword_confidence(cleaned, ["contact", "email", "reach"])
    else:
        intent, conf = "unknown", 0.3

    return {"text": user_input, "cleaned": cleaned, "intent": intent, "confidence": conf,
            "tokens": [t.text for t in doc], "language": doc.lang_ if hasattr(doc, "lang_") else "en"}

# ========================
# Direct test
# ========================
if __name__ == "__main__":
    tests = [
        "Hi there!",
        "I want to volunteer with Unity to Serve.",
        "Can I get your contact info?",
        "Tell me about your mission.",
        "goodbye!",
        "Who can I contact to help out?",
        "I’d like to get involved in volunteering."
    ]
    for t in tests:
        print(f"\nUser: {t}")
        print(analyze_intent(t))
