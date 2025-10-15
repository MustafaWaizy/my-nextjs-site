import spacy
from spacy.pipeline.textcat import Config, single_label_bow_config
from spacy.training.example import Example
import random
import os
from intent_data_phase2 import TRAIN_DATA, INTENTS
from data_utils_phase2 import expand_negative_labels
from config_phase2 import EPOCHS, MODEL_OUTPUT_DIR

def train():
    # Prepare training data with negative labels expanded
    expanded_data = expand_negative_labels(TRAIN_DATA, INTENTS)

    # Create blank English model
    nlp = spacy.blank("en")

    # Configure and add text categorizer pipe
    config = Config().from_str(single_label_bow_config)
    textcat = nlp.add_pipe("textcat", config=config)

    # Add intent labels
    for intent in INTENTS:
        textcat.add_label(intent)

    # Initialize optimizer
    optimizer = nlp.initialize()

    print("\U0001F527 Starting training...")
    for epoch in range(EPOCHS):
        random.shuffle(expanded_data)
        losses = {}
        for text, annotations in expanded_data:
            doc = nlp.make_doc(text)
            example = Example.from_dict(doc, annotations)
            nlp.update([example], sgd=optimizer, losses=losses)
        print(f"✅ Epoch {epoch + 1}, Losses: {losses}")

    # Save model to disk
    os.makedirs(MODEL_OUTPUT_DIR, exist_ok=True)
    nlp.to_disk(MODEL_OUTPUT_DIR)
    print(f"📦 Model saved to: {MODEL_OUTPUT_DIR}")

if __name__ == "__main__":
    train()
