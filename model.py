from transformers import pipeline

# Use a lightweight model for CPU
model_name = "t5-small"  # Smaller and faster than Phi-2
career_suggestion_model = pipeline("text2text-generation", model=model_name)

# Load saved resume data from the console output
def load_resume_data(file_path="chat_data/chat_127.0.0.1.txt"):
    """Reads the saved resume data from the text file (console output)."""
    try:
        with open(file_path, "r", encoding="utf-8") as file:
            resume_info = file.read()
        return resume_info
    except Exception as e:
        print(f"Error reading file: {e}")
        return None

# Generate Career Recommendations
def generate_career_recommendations():
    """Reads saved resume data and generates career suggestions."""
    
    resume_info = load_resume_data()
    if not resume_info:
        print("No resume data found.")
        return
    
    # Prompt for AI model
    prompt = f"""
    Based on the following resume information:
    {resume_info}
    
    Suggest 3 best career paths for this candidate and briefly explain why they are a good fit.
    """
    
    # AI Model generates recommendations
    response = career_suggestion_model(prompt, max_length=100, do_sample=True)
    print("\n🔍 **Career Recommendations:**\n")
    print(response[0]["generated_text"])

# Run the function to generate recommendations
generate_career_recommendations()
