from router_phase4 import route_message, initialize_router

# Step 1: Initialize semantic models (SentenceTransformer + CrossEncoder)
initialize_router()

# Step 2: Test a list of sample user messages
test_messages = [
    "Hi there!",
    "I want to volunteer with Unity to Serve.",
    "Can I get your contact info?",
    "Tell me about your mission.",
    "goodbye!",
    "Who can I contact to help out?",
    "I’d like to get involved in volunteering.",
    "How do I join the team?",
    "What is Unity to Serve's goal?",
    "What's up?"
]

# Step 3: Route messages through the bot
for msg in test_messages:
    print("\nUser:", msg)
    result = route_message(msg)
    print("Bot Response:", result["response"])
    print("Intent Detected:", result["intent"])
    print("Confidence:", round(result["confidence"], 2))
    if result["suggestions"]:
        print("Suggestions:", [s["text"] for s in result["suggestions"]])
