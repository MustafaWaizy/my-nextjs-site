import spacy
from config_phase2 import MODEL_OUTPUT_DIR

def test_model():
    nlp = spacy.load(MODEL_OUTPUT_DIR)
    
    test_texts = [
        "I want to donate.",
        "Can I volunteer?",
        "Do you work with Afghan refugees?",
        "How can I talk to someone?",
        "What is your mission?"
    ]
    
    print("\n🔍 Testing model predictions...")
    for text in test_texts:
        doc = nlp(text)
        print(f"\nInput: {text}")
        for label, score in doc.cats.items():
            print(f"  {label}: {score:.3f}")

if __name__ == "__main__":
    test_model()
