# config.py

# Number of training epochs
EPOCHS = 40

# Output directory to save the trained model
MODEL_OUTPUT_DIR = "nlp/chatbot_intent_model"

# spaCy pipeline configuration (using built-in BOW textcat config)
# You can expand or customize this dictionary if needed
SPACY_PIPELINE_CONFIG = {
    "pipeline": ["textcat"],
    "textcat": {
        "architecture": "simple_cnn",
        "exclusive_classes": True,
        "ngram_size": 1,
        "no_output_layer": False,
    }
}
