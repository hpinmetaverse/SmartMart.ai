import os
import sys
import json
import pandas as pd
import numpy as np
import uvicorn
import smtplib
from contextlib import asynccontextmanager
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from typing import List, Optional

import torch

# Add ml2/ to path so we can import its MultiModalModel
ML2_DIR = os.path.join(os.path.dirname(__file__), "..", "ml2")
sys.path.insert(0, ML2_DIR)

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

from hybrid_recommendation.recommendation_explaination import (
    get_seller_recommendation_explanation,
    get_user_recommendation_explanation,
)
from hybrid_recommendation.main import generate_recommendations
from hybrid_recommendation.content_filtering import build_content_matrix
from hybrid_recommendation.collaborative_filtering import build_collaborative_model
from frequently_bought.fp_growth import analyze_association_rules
from discounts.personalized_discounts import calculate_discount_score, score_to_discount

load_dotenv()

SENDER_EMAIL    = os.environ["GMAIL_ADDRESS"]
SENDER_PASSWORD = os.environ["GMAIL_APP_PASSWORD"]

# ── Global model state (populated at startup) ─────────────────────────────
_models = {}


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Train and cache all ML models at server startup."""
    print("Loading ML models...")
    products_csv     = "hybrid_recommendation/training_products.csv"
    interactions_csv = "hybrid_recommendation/training_interactions.csv"

    data     = pd.read_csv(products_csv)
    interactions = pd.read_csv(interactions_csv)

    # Build content matrix
    content_df, content_similarity = build_content_matrix(data)
    _models["content_df"]         = content_df
    _models["content_similarity"] = content_similarity

    # Train SVD on interaction data
    algo, trainset, predictions = build_collaborative_model(interactions)
    _models["algo"]      = algo
    _models["trainset"]  = trainset

    # Keep original data for context-aware filtering
    # Augment with demographic stub columns if missing
    for col in ["Gender", "Device Type", "Location Country"]:
        if col not in data.columns:
            data[col] = "unknown"
    # Also need User ID for context-aware filtering
    if "User ID" not in data.columns:
        data["User ID"] = 0
    _models["original_data"] = data

    # ── Load ml2 Multi-Modal Model ────────────────────────────────────────
    try:
        from models import MultiModalModel, collaborative_filtering as ml2_collab, \
            content_based_filtering as ml2_content, hybrid_recommendation as ml2_hybrid

        ml2_products  = pd.read_csv(os.path.join(ML2_DIR, "products_expanded.csv"))
        ml2_users     = pd.read_csv(os.path.join(ML2_DIR, "users_expanded.csv"))
        ml2_images    = pd.read_csv(os.path.join(ML2_DIR, "product_images_expanded.csv"))
        ml2_purchases = pd.read_csv(os.path.join(ML2_DIR, "purchases_expanded.csv"))
        ml2_browsing  = pd.read_csv(os.path.join(ML2_DIR, "browsing_history_expanded.csv"))

        num_users    = ml2_users["user_id"].nunique()
        num_products = ml2_products["product_id"].nunique()
        mm_model     = MultiModalModel(num_users, num_products)
        mm_model.eval()

        _models["mm_model"]      = mm_model
        _models["ml2_products"]  = ml2_products
        _models["ml2_users"]     = ml2_users
        _models["ml2_images"]    = ml2_images
        _models["ml2_purchases"] = ml2_purchases
        _models["ml2_browsing"]  = ml2_browsing
        _models["ml2_collab"]    = ml2_collab
        _models["ml2_content"]   = ml2_content
        _models["ml2_hybrid"]    = ml2_hybrid
        print("Multi-modal model (ml2) loaded.")
    except Exception as e:
        print(f"⚠ Multi-modal model (ml2) not loaded: {e}")

    print("ML models ready.")
    yield
    print("ML server shutting down.")


app = FastAPI(
    title="Entropy Product Recommendation API",
    description="Hybrid ML recommendation engine for the Entropy fashion marketplace.",
    version="2.0.0",
    lifespan=lifespan,
)


# ── Request / Response Models ─────────────────────────────────────────────

class RecommendationRequest(BaseModel):
    """
    **Request Model: Product Recommendations**

    *Used to generate product recommendations based on a given product ID and user ID.*

    **Attributes:**
    - `product_id` (*str*): Supabase UUID of the product.
    - `user_id` (*str*): Supabase auth UUID of the user.
    - `top_n` (*int, optional*): Number of recommendations to return (default: 5).
    """
    product_id: str   # Supabase UUID
    user_id: str      # Supabase auth UUID
    top_n: int = 5

class ExplainRequest(BaseModel):
    """
    **Request Model: Recommendation Explanation**

    *Used to retrieve an explanation for why a product is recommended.*

    **Attributes:**
    - `product_name` (*str*): Name of the product for which an explanation is needed.
    """
    product_name: str

class DiscountRequest(BaseModel):
    """
    **Request Model: Discount Calculation**

    *Represents user data required for computing a personalized discount.*

    **Attributes:**
    - `user` (*dict*): Dictionary containing user details for discount computation.
    """
    user: dict

class EmailRequest(BaseModel):
    """
    **Request Model: Email Notification**

    *Used to send emails to users for cart reminders and checkout abandonment alerts.*

    **Attributes:**
    - `to_email` (*str*): Recipient's email address.
    - `subject` (*str*): Subject of the email.
    - `body` (*str*): Email message content.
    """
    to_email: str
    subject: str
    body: str


# ── Endpoints ─────────────────────────────────────────────────────────────

@app.get("/", tags=["Health"])
async def root():
    """
    **API Health Check**

    *Verifies if the API is running correctly and models are loaded.*
    """
    return {"status": "ok", "models_loaded": bool(_models)}


@app.post("/recommend/", response_model=List[str], tags=["Recommendations"])
async def recommend(request: RecommendationRequest):
    """
    **Product Recommendations**

    Returns top_n Supabase product UUIDs recommended for a given user + product.
    Authenticated users get full hybrid recommendations.
    """
    if not _models:
        raise HTTPException(status_code=503, detail="Models not yet loaded")

    recommendations = generate_recommendations(
        product_uuid=request.product_id,
        user_uuid=request.user_id,
        top_n=request.top_n,
        algo=_models["algo"],
        trainset=_models["trainset"],
        content_df=_models["content_df"],
        content_similarity=_models["content_similarity"],
        original_data=_models["original_data"],
    )
    return recommendations


@app.post("/recommend/content-only/", response_model=List[str], tags=["Recommendations"])
async def recommend_content_only(product_id: str, top_n: int = 5):
    """
    Content-based recommendations only. Used for unauthenticated users.
    Accepts a product ID (UUID or integer string), returns similar product IDs.
    """
    if not _models:
        raise HTTPException(status_code=503, detail="Models not yet loaded")

    with open("id_mappings.json") as f:
        mappings = json.load(f)
    id_to_int = mappings["id_to_int"]
    int_to_id = mappings["int_to_id"]

    product_int = id_to_int.get(str(product_id))
    if product_int is None:
        return []

    from hybrid_recommendation.content_filtering import get_content_based_recommendations
    recs_int = get_content_based_recommendations(
        product_int, top_n, _models["content_df"], _models["content_similarity"]
    )
    return [int_to_id[str(i)] for i in recs_int if str(i) in int_to_id]


@app.post("/recommend/multi-modal/", response_model=List[str], tags=["Recommendations"])
async def recommend_multi_modal(product_id: str, user_id: int = 1, top_n: int = 4):
    """
    **Multi-Modal Recommendations (ml2)**

    Uses PyTorch MultiModalModel (ResNet50 image + SentenceTransformer text + GCN graph)
    to generate rich product recommendations.
    Falls back to ml2's hybrid recommendation if multi-modal fails.
    """
    if "mm_model" not in _models:
        raise HTTPException(status_code=503, detail="Multi-modal model not loaded")

    mm_model     = _models["mm_model"]
    ml2_products = _models["ml2_products"]
    ml2_images   = _models["ml2_images"]

    try:
        # Clamp user_id to valid range
        num_users = _models["ml2_users"]["user_id"].nunique()
        safe_user_id = max(1, min(user_id, num_users))

        product_ids_tensor = torch.LongTensor(ml2_products["product_id"].values) - 1
        texts = ml2_products["description"].tolist()

        with torch.no_grad():
            outputs = mm_model(
                torch.LongTensor([safe_user_id - 1]),
                product_ids_tensor,
                texts,
                edge_index=None,
                product_images_df=ml2_images,
            )

        # Score = mean across embedding dimensions
        scores = outputs.mean(dim=1).cpu().numpy()

        # Map to product IDs, exclude the queried product, sort by score
        scored = list(zip(ml2_products["product_id"].values, scores))
        scored = [(pid, s) for pid, s in scored if str(pid) != str(product_id)]
        scored.sort(key=lambda x: x[1], reverse=True)

        return [str(pid) for pid, _ in scored[:top_n]]

    except Exception as e:
        # Fallback to ml2 hybrid
        try:
            ml2_hybrid  = _models["ml2_hybrid"]
            purchases   = _models["ml2_purchases"]
            browsing    = _models["ml2_browsing"]
            recs = ml2_hybrid(user_id, purchases, browsing, ml2_products)
            result_ids = recs["product_id"].head(top_n).astype(str).tolist()
            return [pid for pid in result_ids if pid != str(product_id)]
        except Exception:
            raise HTTPException(status_code=500, detail=f"Multi-modal error: {str(e)}")


@app.post("/user-explaination/", tags=["Explanations"])
async def user_recommendation(request: ExplainRequest):
    """
    **User Recommendation Explanation**

    *Provides a user-friendly explanation for why a product is recommended.*
    """
    return {
        "recommendation": get_user_recommendation_explanation(request.product_name),
    }


@app.post("/seller-explaination/", tags=["Explanations"])
async def seller_recommendation(request: ExplainRequest):
    """
    **Seller Recommendation Explanation**

    *Provides an explanation for sellers on why a product is recommended.*
    """
    return {
        "recommendation": get_seller_recommendation_explanation(request.product_name),
    }


@app.get("/similar-products/", response_model=List[dict], tags=["Frequently Bought Together"])
async def similar_products():
    """
    **Frequently Bought-Together Products**

    *Fetches association rules for frequently bought-together products.*
    """
    _, rules = analyze_association_rules("frequently_bought/ecommerce_fashion_data.csv")
    return rules.astype(str).to_dict(orient="records")


@app.post("/calculate-discount/", tags=["Discounts"])
async def calculate_discount(request: DiscountRequest):
    """
    **Personalized Discount Calculation**

    *Computes a personalized discount based on user profile data.*
    """
    discount_score = calculate_discount_score(request.user)
    discount_amount = score_to_discount(discount_score)
    return {"discount": discount_amount}


def send_email(to_email: str, subject: str, body: str):
    """
    **Helper Function: Send Email**

    *Sends an email notification to the user.*
    """
    msg             = MIMEMultipart()
    msg["From"]     = SENDER_EMAIL
    msg["To"]       = to_email
    msg["Subject"]  = subject
    msg.attach(MIMEText(body, "plain"))
    try:
        server = smtplib.SMTP("smtp.gmail.com", 587)
        server.starttls()
        server.login(SENDER_EMAIL, SENDER_PASSWORD)
        server.sendmail(SENDER_EMAIL, to_email, msg.as_string())
        server.quit()
        return {"message": "Email sent successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Email sending failed: {str(e)}")


@app.post("/send-email/", tags=["Notifications"])
async def send_email_notification(request: EmailRequest):
    """
    **Send Custom Email Notification**

    *Sends an email to the user with custom subject and body content.*
    """
    return send_email(request.to_email, request.subject, request.body)


@app.post("/cart-reminder/", tags=["Notifications"])
async def cart_reminder(to_email: str):
    """
    **Cart Abandonment Reminder**

    *Sends an email reminder to users who have items in their cart for more than 2 days.*
    """
    return send_email(to_email, "Don't Forget Your Cart!", "You left items in your cart for more than 2 days. Complete your purchase before they run out!")


@app.post("/checkout-reminder/", tags=["Notifications"])
async def checkout_reminder(to_email: str):
    """
    **Checkout Abandonment Reminder**

    *Sends an email to users who quit at the checkout stage without completing the purchase.*
    """
    return send_email(to_email, "Complete Your Checkout!", "We noticed you were about to complete your purchase but didn't finish. Come back and complete it now!")


if __name__ == "__main__":
    port = int(os.environ.get("ML_SERVER_PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=False)
