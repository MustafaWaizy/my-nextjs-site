# ===========================
# router_phase4.py (CLEAN VERSION — NO GPT)
# ===========================

from nlp_handler_phase4 import analyze_intent
from rule_responses_phase4 import get_response, faq_dict
from logger_phase4 import log_unknown_input
from sentence_transformers import SentenceTransformer, CrossEncoder
from fuzzywuzzy import fuzz
import torch

# ============ GLOBAL INITIALIZATION ============ #
model = None
cross_encoder = None  # Re-ranking model
faq_keys = list(faq_dict.keys())
faq_embeddings = None


def initialize_router():
    """
    Called at FastAPI startup to preload model, encode FAQ entries,
    and load the CrossEncoder for semantic re-ranking.
    """
    global model, faq_embeddings, cross_encoder
    print("[Phase4 Router] Initializing SentenceTransformer model...")
    model = SentenceTransformer("all-MiniLM-L6-v2")
    faq_embeddings = model.encode(faq_keys, convert_to_tensor=True)
    print(f"[Phase4 Router] Encoded {len(faq_keys)} FAQ keys.")

    print("[Phase4 Router] Loading CrossEncoder for re-ranking...")
    cross_encoder = CrossEncoder("cross-encoder/ms-marco-MiniLM-L-6-v2")
    print("[Phase4 Router] CrossEncoder ready.")


# ============ MATCHING STAGES ============ #
def get_semantic_match(text: str, top_n=5, threshold=0.6):
    """
    Returns the best semantic FAQ match using SentenceTransformer and
    re-ranks top candidates with CrossEncoder for better accuracy.
    """
    if model is None or faq_embeddings is None:
        return None, 0.0

    # Encode input
    input_embedding = model.encode(text, convert_to_tensor=True)
    cosine_scores = torch.nn.functional.cosine_similarity(input_embedding, faq_embeddings)
    top_indices = torch.argsort(cosine_scores, descending=True)[:top_n]

    # Prepare top candidates
    candidates = [faq_keys[idx] for idx in top_indices if cosine_scores[idx] >= threshold]
    if not candidates:
        return None, cosine_scores[top_indices[0]].item() if top_indices.numel() > 0 else 0.0

    # Re-rank using CrossEncoder
    if cross_encoder:
        pairs = [(text, c) for c in candidates]
        scores = cross_encoder.predict(pairs)
        best_idx = scores.argmax()
        best_match = candidates[best_idx]
        similarity = float(scores[best_idx])
    else:
        best_match = candidates[0]
        similarity = float(cosine_scores[top_indices[0]].item())

    if similarity >= threshold:
        return best_match, similarity
    return None, similarity


def get_fuzzy_match(text: str, threshold=65):
    best_key, best_score = None, 0
    for key in faq_keys:
        score = fuzz.token_sort_ratio(text.lower(), key.lower())
        if score > best_score:
            best_score = score
            best_key = key
    if best_score >= threshold:
        return best_key, best_score / 100.0
    return None, 0.0


def get_top_suggestions(text: str, top_n=3, threshold=0.2):
    """
    Returns top N FAQ suggestions based on CrossEncoder scores for more accurate fallback suggestions.
    """
    input_embedding = model.encode(text, convert_to_tensor=True)
    cosine_scores = torch.nn.functional.cosine_similarity(input_embedding, faq_embeddings)
    top_indices = torch.argsort(cosine_scores, descending=True)[:top_n * 2]  # get more for re-ranking

    candidates = [faq_keys[idx] for idx in top_indices if cosine_scores[idx] >= threshold]
    if not candidates:
        return [], 0.0

    if cross_encoder:
        pairs = [(text, c) for c in candidates]
        scores = cross_encoder.predict(pairs)
        sorted_idx = scores.argsort()[::-1][:top_n]
        suggestions = [candidates[i] for i in sorted_idx]
        top_score = float(scores[sorted_idx[0]]) if len(sorted_idx) > 0 else 0.0
    else:
        # fallback if cross encoder is missing
        sorted_idx = torch.argsort(cosine_scores[top_indices], descending=True)[:top_n]
        suggestions = [candidates[i] for i in sorted_idx]
        top_score = cosine_scores[top_indices[0]].item() if top_indices.numel() > 0 else 0.0

    return suggestions, top_score


# ============ MAIN ROUTER LOGIC ============ #
def route_message(user_input: str):
    """
    Hierarchical routing logic:
      1. Intent detection
      2. Semantic similarity (with CrossEncoder re-ranking)
      3. Fuzzy match
      4. Suggestion fallback (NO GPT)
    """
    print(f"\n[ROUTER] Received: {user_input}")

    # Step 1: NLP intent detection
    nlp_result = analyze_intent(user_input)
    intent = nlp_result["intent"]
    confidence = nlp_result["confidence"]
    print(f"[INTENT] {intent} (conf={confidence:.2f})")

    if confidence >= 0.75:
        reply = get_response(intent)
        if reply:
            return {
                "response": reply,
                "intent": intent,
                "method": "intent",
                "confidence": confidence,
                "suggestions": []
            }

    # Step 2: Semantic matching + CrossEncoder re-ranking
    semantic_key, semantic_conf = get_semantic_match(user_input, top_n=5, threshold=0.65)
    if semantic_key:
        reply = get_response(semantic_key)
        if reply:
            return {
                "response": reply,
                "intent": semantic_key,
                "method": "semantic_rerank",
                "confidence": semantic_conf,
                "suggestions": []
            }

    # Step 3: Fuzzy match fallback
    fuzzy_key, fuzzy_conf = get_fuzzy_match(user_input, threshold=70)
    if fuzzy_key and fuzzy_conf >= 0.7:
        reply = get_response(fuzzy_key)
        if reply:
            return {
                "response": reply,
                "intent": fuzzy_key,
                "method": "fuzzy",
                "confidence": fuzzy_conf,
                "suggestions": []
            }

    # Step 4: Suggestion fallback
    suggestions, fallback_confidence = get_top_suggestions(user_input, top_n=3, threshold=0.2)
    structured_suggestions = [{"text": s, "intent": s} for s in suggestions]

    # Log unknown input for future analysis
    log_unknown_input(
        user_input,
        suggestions=suggestions,
        source="suggestion_fallback",
        scores={
            "intent_conf": confidence,
            "semantic_conf": semantic_conf,
            "fuzzy_conf": fuzzy_conf,
            "fallback_conf": fallback_confidence
        }
    )

    return {
        "response": "Do you mean one of the following?",
        "intent": "unknown",
        "method": "suggestion_fallback",
        "confidence": fallback_confidence,
        "suggestions": structured_suggestions
    }
