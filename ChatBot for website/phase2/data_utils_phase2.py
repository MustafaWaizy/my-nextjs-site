# data_utils.py

import random

def expand_negative_labels(train_data, intents):
    """
    For each training example, ensure all intents are labeled.
    If an intent is not present, set its label to 0.0 (negative).
    """
    for text, annotation in train_data:
        for intent in intents:
            if intent not in annotation["cats"]:
                annotation["cats"][intent] = 0.0
    return train_data

def shuffle_data(train_data):
    """
    Shuffle the training data in place.
    """
    random.shuffle(train_data)
