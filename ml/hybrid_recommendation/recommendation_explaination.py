import os
from dotenv import load_dotenv
from google import genai
from google.genai import types

load_dotenv()
_API_KEY = os.environ["GEMINI_API_KEY"]

def get_user_recommendation_explanation(product_name: str) -> str:
    sys_instruct = (
        "You are an AI assistant specializing in personalized product recommendations. "
        "You explain why a product is recommended based on user preferences in a very "
        "concise and engaging manner."
    )
    client = genai.Client(api_key=_API_KEY)
    response = client.models.generate_content(
        model="gemini-2.0-flash",
        config=types.GenerateContentConfig(system_instruction=sys_instruct),
        contents=[f"Explain why {product_name} is recommended to the user."]
    )
    return response.text

def get_seller_recommendation_explanation(product_name: str) -> str:
    sys_instruct = (
        "You are an AI assistant providing explanation to sellers on why a product "
        "is recommended to users in very concise manner."
    )
    client = genai.Client(api_key=_API_KEY)
    response = client.models.generate_content(
        model="gemini-2.0-flash",
        config=types.GenerateContentConfig(system_instruction=sys_instruct),
        contents=[f"Explain why {product_name} is being recommended."]
    )
    return response.text