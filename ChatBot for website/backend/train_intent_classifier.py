load_ml_classifier()
import json
import pickle
from pathlib import Path
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, accuracy_score

# ========================
# Paths
# ========================
FAQ_JSON_PATH = Path("unity_faq_dict.json")
MODEL_PATH = Path("intent_classifier.pkl")
VECT_PATH = Path("tfidf_vectorizer.pkl")

# ========================
# Load FAQ
# ========================
if not FAQ_JSON_PATH.exists():
    raise FileNotFoundError(f"{FAQ_JSON_PATH} not found!")

with open(FAQ_JSON_PATH, "r", encoding="utf-8") as f:
    faq_data = json.load(f)

# Handle different FAQ formats
first_entry = faq_data[list(faq_data.keys())[0]]
if isinstance(first_entry, str):
    y = [faq_data[q] for q in faq_data.keys()]
elif isinstance(first_entry, dict) and "intent" in first_entry:
    y = [faq_data[q]["intent"] for q in faq_data.keys()]
else:
    raise ValueError("FAQ format unrecognized! Must be string or dict with 'intent'.")

X = list(faq_data.keys())
print(f"Loaded {len(X)} FAQ entries for training.")

# ========================
# Split for evaluation
# ========================
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.15, random_state=42)

# ========================
# TF-IDF Vectorization
# ========================
vectorizer = TfidfVectorizer(lowercase=True, ngram_range=(1,2))
X_train_tfidf = vectorizer.fit_transform(X_train)
X_test_tfidf = vectorizer.transform(X_test)

# ========================
# Train Logistic Regression
# ========================
clf = LogisticRegression(max_iter=500)
clf.fit(X_train_tfidf, y_train)

# ========================
# Evaluate
# ========================
y_pred = clf.predict(X_test_tfidf)
print("\n=== Classification Report ===")
print(classification_report(y_test, y_pred))
print("Accuracy:", accuracy_score(y_test, y_pred))

# ========================
# Save model and vectorizer
# ========================
with open(MODEL_PATH, "wb") as f:
    pickle.dump(clf, f)

with open(VECT_PATH, "wb") as f:
    pickle.dump(vectorizer, f)

print(f"\n✅ Saved ML classifier to {MODEL_PATH} and vectorizer to {VECT_PATH}")
