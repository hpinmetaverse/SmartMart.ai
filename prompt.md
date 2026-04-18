# Entropy — ML Integration: Phased Instructions for Claude Opus

## Context

You are fixing the Entropy e-commerce platform. The project has a fully working ML recommendation engine (FastAPI, SVD, TF-IDF, FP-Growth) in the `ml/` directory that has **never been connected to the Next.js frontend**. The frontend currently fakes recommendations by querying the first 4 products from the database, and fakes recommendation explanations using `charCodeAt()` arithmetic on product IDs.

Your job is to wire everything up. No new ML algorithms. Pure integration work.

**Read the full PRD (`Entropy_ML_Integration_PRD.docx`) before starting any phase.**

---

## Project Structure (critical paths)

```
Entropy_hackniche3-main/
├── ml/                                          ← FastAPI ML server (Python)
│   ├── main.py                                  ← FastAPI app, port 8000
│   ├── hybrid_recommendation/
│   │   ├── main.py                              ← generate_recommendations()
│   │   ├── collaborative_filtering.py           ← SVD model
│   │   ├── content_filtering.py                 ← TF-IDF model
│   │   ├── context_aware.py                     ← demographic filter
│   │   ├── hybrid.py                            ← merger
│   │   ├── metrics.py                           ← evaluation
│   │   ├── recommendation_explaination.py       ← Gemini explanation
│   │   └── fashion_products.csv                 ← 1000 product training data
│   ├── frequently_bought/
│   │   └── fp_growth.py                         ← FP-Growth association rules
│   ├── discounts/
│   │   └── personalized_discounts.py            ← discount scoring
│   ├── requirements.txt
│   └── .gitignore                               ← currently only ignores venv/
│
├── client/                                      ← Next.js 14 frontend
│   ├── src/
│   │   ├── app/
│   │   │   ├── (store)/
│   │   │   │   ├── page.tsx                     ← Home page
│   │   │   │   ├── shop/[slug]/page.tsx          ← Product detail page (BROKEN HERE)
│   │   │   │   ├── cart/page.tsx                ← Cart page (BROKEN HERE)
│   │   │   │   └── wish-list/page.tsx           ← Wishlist page (BROKEN HERE)
│   │   │   └── api/
│   │   │       ├── recommendation-reason/route.ts  ← Gemini explanation (BROKEN)
│   │   │       └── recommendations/route.ts        ← DOES NOT EXIST, must create
│   │   ├── features/products/components/
│   │   │   └── RecommendationProducts.tsx       ← BROKEN: returns same 4 products always
│   │   ├── components/
│   │   │   └── RecommendationReason.tsx         ← BROKEN: fake charCodeAt context
│   │   └── lib/
│   │       ├── supabase/
│   │       │   ├── client.ts                    ← Browser Supabase client
│   │       │   └── server.ts                    ← Server Supabase client (needs cookieStore)
│   │       └── env.mjs                          ← t3-oss env validation (add ML_API_URL here)
│   └── .env.local                               ← Add ML_API_URL here
```

---

## Key Facts Before You Start

1. **Supabase uses UUIDs** for product IDs (e.g. `47f47e49-f207-410b-9f0f-36b7a687b773`). The ML server currently expects **integers**. You must add a UUID↔integer mapping layer.

2. **The server-side Supabase client** requires `cookieStore` to be passed explicitly:
   ```typescript
   import { cookies } from 'next/headers';
   import createClient from '@/lib/supabase/server';
   const cookieStore = cookies();
   const supabase = createClient({ cookieStore });
   ```

3. **The browser-side Supabase client** is a singleton already exported as default from `@/lib/supabase/client`.

4. **Environment variables** are validated via `@t3-oss/env-nextjs` in `client/src/lib/env.mjs`. Any new server-side env var must be added there or it will throw at build time.

5. **`RecommendationProducts`** is used in 3 places: `cart/page.tsx`, `wish-list/page.tsx` (no current product context), and inline in `shop/[slug]/page.tsx` (has product context). The component must handle both cases.

6. **The product page (`shop/[slug]/page.tsx`)** is a Server Component. It currently embeds recommendations directly in the GraphQL query. You must strip that query field and replace the inline JSX with the updated `RecommendationProducts` component.

7. **`python-dotenv` is NOT in `ml/requirements.txt`**. Add it before using `load_dotenv()`.

8. **The ML server's `fashion_products.csv`** only has 1000 products and uses columns: `id` (UUID), `name`, `collection_id`, `tags`, `price`, `rating`. The TF-IDF content matrix needs columns named `Product ID`, `Product Name`, `Brand`, `Category`, `Color`, `Size` — you must rename/map these at preprocessing time.

9. **Do not touch `ml2/`** in this integration. It is out of scope (missing CSVs, PyTorch dependency hell).

10. **The `boughtTogether.tsx` component** already implements its own Supabase-native frequently-bought logic. Do NOT replace it with the FP-Growth endpoint — that is a separate future task.

---

## Phase 1 — Fix Security & Environment (ml/)

**Goal:** No credentials in source code. ML server loads everything from `.env`.

### Step 1.1 — Add python-dotenv to requirements.txt

Add to `ml/requirements.txt`:
```
python-dotenv==1.0.1
```

### Step 1.2 — Create ml/.env

Create `ml/.env` with these keys (values to be filled by the team):
```env
GEMINI_API_KEY=your_gemini_api_key_here
GMAIL_ADDRESS=your_gmail_address_here
GMAIL_APP_PASSWORD=your_gmail_app_password_here
ML_SERVER_PORT=8000
```

### Step 1.3 — Update ml/.gitignore

Replace the contents of `ml/.gitignore` with:
```
venv/
*.pyc
__pycache__/
.env
*.csv
id_mappings.json
```

> **Why add `*.csv`?** Training CSVs can be large and should be generated locally, not committed to the repo.

### Step 1.4 — Fix ml/hybrid_recommendation/recommendation_explaination.py

Replace the hardcoded API key with an environment variable load:

```python
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
```

### Step 1.5 — Fix ml/main.py credentials

At the top of `ml/main.py`, add:
```python
import os
from dotenv import load_dotenv
load_dotenv()

# Replace hardcoded values:
SENDER_EMAIL    = os.environ["GMAIL_ADDRESS"]
SENDER_PASSWORD = os.environ["GMAIL_APP_PASSWORD"]
```

Then replace all instances of `"surabhiwaingankar@gmail.com"` with `SENDER_EMAIL` and `"tbkx roos nvgw cuwk"` with `SENDER_PASSWORD` in the `send_email()` function.

### Verification for Phase 1

```bash
cd ml
grep -rn "AIzaSy\|tbkx\|surabhiwaingankar" . 
# Expected: zero results
```

---

## Phase 2 — Data Preparation (ml/)

**Goal:** Generate the training CSVs the ML models need, with a UUID↔integer mapping that survives server restarts.

### Step 2.1 — Create ml/scripts/prepare_training_data.py

Create directory `ml/scripts/` and add `prepare_training_data.py`:

```python
"""
One-time script to prepare ML training data.
Run from the ml/ directory: python scripts/prepare_training_data.py

Requires:
  - hybrid_recommendation/fashion_products.csv  (project-native, 1000 products)
  - myntra_sales.csv  (Kaggle: Myntra Sales Dataset by skmewati — place in ml/)

Produces:
  - hybrid_recommendation/training_products.csv  (content matrix input)
  - hybrid_recommendation/training_interactions.csv  (SVD training input)
  - id_mappings.json  (UUID <-> integer index for inference time)
"""

import pandas as pd
import json
import os

PRODUCTS_CSV     = "hybrid_recommendation/fashion_products.csv"
SALES_CSV        = "myntra_sales.csv"
OUT_PRODUCTS     = "hybrid_recommendation/training_products.csv"
OUT_INTERACTIONS = "hybrid_recommendation/training_interactions.csv"
MAPPINGS_FILE    = "id_mappings.json"


def main():
    # ── Load project products ──────────────────────────────────────────────
    products = pd.read_csv(PRODUCTS_CSV)
    print(f"Loaded {len(products)} products from {PRODUCTS_CSV}")

    # Assign integer indices (0-based) to each UUID
    products = products.reset_index(drop=True)
    products["int_id"] = products.index

    # Build bidirectional maps
    id_to_int = dict(zip(products["id"].astype(str), products["int_id"].astype(int)))
    int_to_id = dict(zip(products["int_id"].astype(int), products["id"].astype(str)))

    with open(MAPPINGS_FILE, "w") as f:
        json.dump({"id_to_int": id_to_int, "int_to_id": int_to_id}, f, indent=2)
    print(f"Saved ID mappings to {MAPPINGS_FILE}")

    # ── Build content training CSV ─────────────────────────────────────────
    # TF-IDF content_filtering.py expects these exact column names:
    # Product ID, Product Name, Brand, Category, Color, Size
    content = products[["int_id", "name", "collection_id", "tags"]].copy()
    content.columns = ["Product ID", "Product Name", "Category", "Color"]
    content["Brand"] = "Entropy"
    content["Size"]  = "M"
    content.to_csv(OUT_PRODUCTS, index=False)
    print(f"Saved content training data: {OUT_PRODUCTS}")

    # ── Build interaction training CSV ─────────────────────────────────────
    if not os.path.exists(SALES_CSV):
        print(f"\nWARNING: {SALES_CSV} not found.")
        print("Download from: https://www.kaggle.com/datasets/skmewati/myntra-sales-dataset")
        print("Place the CSV in the ml/ directory and re-run this script.\n")
        print("Generating SYNTHETIC interaction data as fallback...")
        _generate_synthetic_interactions(products, OUT_INTERACTIONS)
        return

    sales = pd.read_csv(SALES_CSV)
    print(f"Loaded {len(sales)} rows from {SALES_CSV}")
    print(f"Columns: {list(sales.columns)}")

    # Myntra Sales Dataset columns may vary — map to required schema
    # Required: User ID, Product ID (as integer), Rating
    col_map = {}
    for col in sales.columns:
        lc = col.lower().replace(" ", "_")
        if "user" in lc:         col_map[col] = "User ID"
        elif "product" in lc:    col_map[col] = "Product ID"
        elif "rating" in lc:     col_map[col] = "Rating"
    sales = sales.rename(columns=col_map)[["User ID", "Product ID", "Rating"]]

    # Map Myntra product IDs to our integer index space via modulo
    # (Myntra IDs won't match ours directly — we distribute them across our 1000 products)
    n_products = len(products)
    sales["Product ID"] = sales["Product ID"].astype(int) % n_products

    # Clip ratings to 1–5
    sales["Rating"] = sales["Rating"].clip(1, 5)

    sales.to_csv(OUT_INTERACTIONS, index=False)
    print(f"Saved interaction training data: {OUT_INTERACTIONS} ({len(sales)} rows)")


def _generate_synthetic_interactions(products, out_path):
    """
    Generates synthetic user-product interactions as a fallback.
    Uses product ratings from the product catalogue as a signal.
    Creates 5000 synthetic interaction rows across 200 synthetic users.
    """
    import numpy as np
    np.random.seed(42)

    n_users    = 200
    n_products = len(products)
    n_rows     = 5000

    user_ids    = np.random.randint(1, n_users + 1, size=n_rows)
    product_ids = np.random.randint(0, n_products, size=n_rows)
    # Base ratings on actual product rating, add noise
    base_ratings = products.loc[product_ids, "rating"].values.astype(float)
    noise        = np.random.uniform(-1.0, 1.0, size=n_rows)
    ratings      = np.clip(base_ratings + noise, 1, 5).round(1)

    interactions = pd.DataFrame({
        "User ID":    user_ids,
        "Product ID": product_ids,
        "Rating":     ratings,
    })
    interactions.to_csv(out_path, index=False)
    print(f"Saved SYNTHETIC interaction data: {out_path} ({len(interactions)} rows)")
    print("NOTE: Replace with real Myntra Sales data for production accuracy.")


if __name__ == "__main__":
    main()
```

### Step 2.2 — Run the script

```bash
cd ml
python scripts/prepare_training_data.py
```

Expected output:
```
Loaded 1000 products from hybrid_recommendation/fashion_products.csv
Saved ID mappings to id_mappings.json
Saved content training data: hybrid_recommendation/training_products.csv
# Either: Saved interaction training data (if Myntra CSV present)
# Or:     Saved SYNTHETIC interaction data (fallback)
```

### Verification for Phase 2

```bash
ls ml/hybrid_recommendation/training_products.csv    # exists
ls ml/hybrid_recommendation/training_interactions.csv # exists
ls ml/id_mappings.json                               # exists
python3 -c "import json; m=json.load(open('ml/id_mappings.json')); print(len(m['id_to_int']), 'products mapped')"
# Expected: 1000 products mapped
```

---

## Phase 3 — Update the ML Server to Handle UUIDs (ml/)

**Goal:** The FastAPI `/recommend/` endpoint accepts Supabase UUIDs and returns Supabase UUIDs. All integer↔UUID translation happens inside the ML server, invisible to the frontend.

### Step 3.1 — Update ml/hybrid_recommendation/main.py

Replace the `generate_recommendations` function to use the training CSVs and mapping file produced in Phase 2:

```python
import os
import json
import pandas as pd
from hybrid_recommendation.content_filtering import (
    build_content_matrix, get_content_based_recommendations,
)
from hybrid_recommendation.collaborative_filtering import (
    build_collaborative_model, get_collaborative_filtering_recommendations,
)
from hybrid_recommendation.context_aware import get_context_aware_recommendations
from hybrid_recommendation.hybrid import get_hybrid_recommendations
from hybrid_recommendation.metrics import compute_metrics, precision_recall_at_k, evaluate_model


def load_mappings() -> tuple[dict, dict]:
    """Load UUID <-> integer mappings from id_mappings.json."""
    mappings_path = os.path.join(os.path.dirname(__file__), "..", "id_mappings.json")
    with open(mappings_path) as f:
        m = json.load(f)
    return m["id_to_int"], m["int_to_id"]


def generate_recommendations(
    product_uuid: str,
    user_uuid: str,
    top_n: int,
    algo=None,
    trainset=None,
    content_df=None,
    content_similarity=None,
    original_data=None,
) -> list[str]:
    """
    Generate hybrid recommendations.

    Args:
        product_uuid: Supabase UUID of the product currently being viewed.
        user_uuid:    Supabase UUID of the current user (from auth).
        top_n:        Number of recommendations to return.
        algo, trainset, content_df, content_similarity, original_data:
                      Pre-loaded model artefacts (passed from FastAPI lifespan).

    Returns:
        List of Supabase product UUIDs (strings).
    """
    id_to_int, int_to_id = load_mappings()

    # Map UUIDs to integers
    product_int = id_to_int.get(product_uuid)
    # Use a stable integer for user (hash mod 200 to keep within synthetic user space)
    user_int = abs(hash(user_uuid)) % 200 + 1

    if product_int is None:
        # Product not in training data — fall back to collaborative only
        collab_recs_int = get_collaborative_filtering_recommendations(
            user_int, top_n, algo, trainset
        )
        return [int_to_id[i] for i in collab_recs_int if i in int_to_id]

    # Content-Based
    content_recs_int = get_content_based_recommendations(
        product_int, top_n, content_df, content_similarity
    )

    # Collaborative
    collab_recs_int = get_collaborative_filtering_recommendations(
        user_int, top_n, algo, trainset
    )

    # Context-Aware (uses original_data with integer Product IDs)
    context_recs_int = get_context_aware_recommendations(
        user_int, top_n, original_data
    )

    # Hybrid merge
    hybrid_int = get_hybrid_recommendations(
        top_n, content_recs_int, collab_recs_int, context_recs_int
    )

    # Map back to UUIDs — skip any integer not in mapping
    return [int_to_id[i] for i in hybrid_int if i in int_to_id]
```

### Step 3.2 — Update ml/main.py — Add lifespan startup & UUID endpoints

Replace the entire `ml/main.py` with the following (keep all existing endpoints, add lifespan and update the recommend endpoint):

```python
import os
import json
import pandas as pd
import uvicorn
import smtplib
from contextlib import asynccontextmanager
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from typing import List, Optional

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
    _models["original_data"] = data

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
    product_id: str   # Supabase UUID
    user_id: str      # Supabase auth UUID
    top_n: int = 5

class ExplainRequest(BaseModel):
    product_name: str

class DiscountRequest(BaseModel):
    user: dict

class EmailRequest(BaseModel):
    to_email: str
    subject: str
    body: str


# ── Endpoints ─────────────────────────────────────────────────────────────

@app.get("/", tags=["Health"])
async def root():
    return {"status": "ok", "models_loaded": bool(_models)}


@app.post("/recommend/", response_model=List[str], tags=["Recommendations"])
async def recommend(request: RecommendationRequest):
    """
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
    Accepts a Supabase product UUID, returns similar product UUIDs.
    """
    if not _models:
        raise HTTPException(status_code=503, detail="Models not yet loaded")

    import json
    with open("id_mappings.json") as f:
        mappings = json.load(f)
    id_to_int = mappings["id_to_int"]
    int_to_id = mappings["int_to_id"]

    product_int = id_to_int.get(product_id)
    if product_int is None:
        return []

    from hybrid_recommendation.content_filtering import get_content_based_recommendations
    recs_int = get_content_based_recommendations(
        product_int, top_n, _models["content_df"], _models["content_similarity"]
    )
    return [int_to_id[i] for i in recs_int if i in int_to_id]


@app.post("/user-explaination/", tags=["Explanations"])
async def user_recommendation(request: ExplainRequest):
    return {"recommendation": get_user_recommendation_explanation(request.product_name)}


@app.post("/seller-explaination/", tags=["Explanations"])
async def seller_recommendation(request: ExplainRequest):
    return {"recommendation": get_seller_recommendation_explanation(request.product_name)}


@app.get("/similar-products/", response_model=List[dict], tags=["Frequently Bought Together"])
async def similar_products():
    _, rules = analyze_association_rules("frequently_bought/ecommerce_fashion_data.csv")
    return rules.astype(str).to_dict(orient="records")


@app.post("/calculate-discount/", tags=["Discounts"])
async def calculate_discount(request: DiscountRequest):
    score  = calculate_discount_score(request.user)
    amount = score_to_discount(score)
    return {"discount": amount}


def send_email(to_email: str, subject: str, body: str):
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
    return send_email(request.to_email, request.subject, request.body)


@app.post("/cart-reminder/", tags=["Notifications"])
async def cart_reminder(to_email: str):
    return send_email(to_email, "Don't Forget Your Cart!", "You left items in your cart for more than 2 days. Complete your purchase before they run out!")


@app.post("/checkout-reminder/", tags=["Notifications"])
async def checkout_reminder(to_email: str):
    return send_email(to_email, "Complete Your Checkout!", "We noticed you were about to complete your purchase but didn't finish. Come back and complete it now!")


if __name__ == "__main__":
    port = int(os.environ.get("ML_SERVER_PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=False)
```

### Verification for Phase 3

```bash
cd ml
pip install -r requirements.txt
python main.py
# Wait for "ML models ready." in console

# In another terminal:
curl http://localhost:8000/
# Expected: {"status":"ok","models_loaded":true}

curl -X POST http://localhost:8000/recommend/ \
  -H "Content-Type: application/json" \
  -d '{"product_id":"47f47e49-f207-410b-9f0f-36b7a687b773","user_id":"test-user-123","top_n":4}'
# Expected: ["uuid1", "uuid2", "uuid3", "uuid4"]  — actual UUIDs from fashion_products.csv
```

---

## Phase 4 — Next.js API Route & Environment (client/)

**Goal:** Create the proxy API route that the frontend will call. The frontend never talks directly to port 8000.

### Step 4.1 — Add ML_API_URL to client/src/lib/env.mjs

Open `client/src/lib/env.mjs` and add `ML_API_URL` to the server schema:

```javascript
// client/src/lib/env.mjs
import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";
import "dotenv/config";

export const env = createEnv({
  server: {
    NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
    DATABASE_URL: z.string().min(1),
    ML_API_URL: z.string().url().default("http://localhost:8000"),  // ← ADD THIS
  },
  client: {},
  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
    ML_API_URL: process.env.ML_API_URL,             // ← ADD THIS
  },
  experimental__runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
    ML_API_URL: process.env.ML_API_URL,             // ← ADD THIS
  },
});
```

### Step 4.2 — Add ML_API_URL to client/.env.local

Add to `client/.env.local` (create the file if it does not exist):
```env
ML_API_URL=http://localhost:8000
```

### Step 4.3 — Create client/src/app/api/recommendations/route.ts

Create this file from scratch:

```typescript
// client/src/app/api/recommendations/route.ts
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import createSupabaseClient from "@/lib/supabase/server";
import { env } from "@/lib/env.mjs";

const ML_API_URL = env.ML_API_URL;

export async function GET(req: NextRequest) {
  const cookieStore = cookies();
  const supabase    = createSupabaseClient({ cookieStore });

  const { data: { user } } = await supabase.auth.getUser();
  const productId  = req.nextUrl.searchParams.get("productId");
  const topN       = parseInt(req.nextUrl.searchParams.get("topN") ?? "4", 10);

  // ── Fallback: no product context at all ──────────────────────────────
  if (!productId) {
    const { data } = await supabase
      .from("products")
      .select("id")
      .order("rating", { ascending: false })
      .limit(topN);
    return NextResponse.json({ ids: data?.map((p) => p.id) ?? [], source: "fallback_top_rated" });
  }

  // ── Unauthenticated: content-based only ──────────────────────────────
  if (!user) {
    try {
      const mlRes = await fetch(
        `${ML_API_URL}/recommend/content-only/?product_id=${productId}&top_n=${topN}`,
        { next: { revalidate: 300 } }   // cache for 5 minutes
      );
      if (!mlRes.ok) throw new Error(`ML server error: ${mlRes.status}`);
      const ids: string[] = await mlRes.json();
      return NextResponse.json({ ids, source: "content_based" });
    } catch (err) {
      console.error("[/api/recommendations] ML server unavailable:", err);
      const { data } = await supabase
        .from("products")
        .select("id")
        .order("rating", { ascending: false })
        .limit(topN);
      return NextResponse.json({ ids: data?.map((p) => p.id) ?? [], source: "fallback_top_rated" });
    }
  }

  // ── Authenticated: full hybrid recommendations ────────────────────────
  try {
    const mlRes = await fetch(`${ML_API_URL}/recommend/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ product_id: productId, user_id: user.id, top_n: topN }),
      cache: "no-store",   // personalised — never cache
    });
    if (!mlRes.ok) throw new Error(`ML server error: ${mlRes.status}`);
    const ids: string[] = await mlRes.json();
    return NextResponse.json({ ids, source: "hybrid_ml" });
  } catch (err) {
    console.error("[/api/recommendations] ML server unavailable, falling back:", err);
    // Graceful fallback: top-rated products from Supabase
    const { data } = await supabase
      .from("products")
      .select("id")
      .order("rating", { ascending: false })
      .limit(topN);
    return NextResponse.json({ ids: data?.map((p) => p.id) ?? [], source: "fallback_top_rated" });
  }
}
```

### Verification for Phase 4

Start the Next.js dev server (`npm run dev` in `client/`), then:

```bash
# With ML server running:
curl "http://localhost:3000/api/recommendations?productId=47f47e49-f207-410b-9f0f-36b7a687b773&topN=4"
# Expected: {"ids":["uuid1","uuid2","uuid3","uuid4"],"source":"content_based"} (unauthenticated)

# With ML server STOPPED (test graceful fallback):
curl "http://localhost:3000/api/recommendations?productId=47f47e49-f207-410b-9f0f-36b7a687b773&topN=4"
# Expected: {"ids":[...],"source":"fallback_top_rated"} — no 500 error
```

---

## Phase 5 — Fix RecommendationProducts.tsx (client/)

**Goal:** Replace the hardcoded `productsCollection(first: 4)` query with real ML recommendations from `/api/recommendations`.

### Step 5.1 — Rewrite RecommendationProducts.tsx

Replace the **entire contents** of `client/src/features/products/components/RecommendationProducts.tsx`:

```tsx
"use client";
import React, { useEffect, useState } from "react";
import Header from "@/components/layouts/Header";
import { ProductCard } from "@/features/products";
import ProductCardSkeleton from "./RecommendationProductsSkeleton";
import supabaseClient from "@/lib/supabase/client";

export type RecommendationProductsProps = React.HTMLAttributes<HTMLDivElement> & {
  currentProductId?: string;
};

function RecommendationProducts({ currentProductId }: RecommendationProductsProps) {
  const [products, setProducts]   = useState<any[]>([]);
  const [loading, setLoading]     = useState(true);

  useEffect(() => {
    let cancelled = false;

    const fetchRecommendations = async () => {
      setLoading(true);

      // Determine which product to seed recommendations from:
      // 1. Use the prop if on a product page
      // 2. Fall back to last-viewed product stored in localStorage
      // 3. If neither, pass no productId (API returns top-rated fallback)
      const productId =
        currentProductId ?? localStorage.getItem("lastViewedProductId") ?? undefined;

      const url = productId
        ? `/api/recommendations?productId=${productId}&topN=4`
        : `/api/recommendations?topN=4`;

      try {
        const res = await fetch(url);
        if (!res.ok) throw new Error("Recommendations API error");

        const { ids }: { ids: string[] } = await res.json();

        if (!ids || ids.length === 0) {
          if (!cancelled) { setProducts([]); setLoading(false); }
          return;
        }

        // Fetch full product data for the returned UUIDs
        const { data, error } = await supabaseClient
          .from("products")
          .select("id, name, slug, price, rating, stock, collection_id, featured_image_id, featured, badge, tags, images, totalComments, created_at")
          .in("id", ids);

        if (error) throw error;

        // Preserve the ML-recommended order (Supabase .in() does not guarantee order)
        const productMap = new Map((data ?? []).map((p: any) => [p.id, p]));
        const ordered    = ids.map((id) => productMap.get(id)).filter(Boolean);

        if (!cancelled) { setProducts(ordered); setLoading(false); }
      } catch (err) {
        console.error("[RecommendationProducts] Error:", err);
        if (!cancelled) { setProducts([]); setLoading(false); }
      }
    };

    fetchRecommendations();
    return () => { cancelled = true; };
  }, [currentProductId]);

  if (loading) {
    return (
      <Header heading="We Think You'll Love">
        <div className="container grid grid-cols-2 lg:grid-cols-4 gap-x-8">
          {[...Array(4)].map((_, i) => <ProductCardSkeleton key={i} />)}
        </div>
      </Header>
    );
  }

  if (products.length === 0) return null;

  return (
    <Header heading="We Think You'll Love">
      <div className="container grid grid-cols-2 lg:grid-cols-4 gap-x-8">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </Header>
  );
}

export default RecommendationProducts;
```

### Step 5.2 — Update shop/[slug]/page.tsx (Product Detail Page)

The product detail page currently has **two problems**:
1. It fetches recommendations inline via GraphQL (`recommendations: productsCollection(first: 4)`)
2. It renders them inline in the JSX instead of using the `RecommendationProducts` component

**Fix A:** Remove the `recommendations` field from the GraphQL query. Find and delete these lines:

```graphql
    recommendations: productsCollection(first: 4) {
      edges {
        node {
          id
          ...ProductCardFragment
        }
      }
    }
```

**Fix B:** Add `lastViewedProductId` tracking. Inside the `ProductDetailPage` Server Component, before the return statement, this is a Server Component so you cannot use `useEffect`. Instead, pass the product ID as a prop to `RecommendationProducts` which already handles it client-side.

**Fix C:** Replace the inline recommendations JSX block. Find:

```tsx
      {(
        <>
          <Header heading={`We Think You'll Love`} />
          <div className="container grid grid-cols-2 lg:grid-cols-4 gap-x-8 ">
            {data.recommendations &&
              data.recommendations.edges.map(({ node }) => (
                <div key={node.id} className="flex flex-col">
                  <ProductCard product={node} />
                  <div className="mt-2">
                    <RecommendationReason 
                      productId={node.id} 
                      currentProductId={id} 
                    />
                  </div>
                </div>
              ))}
          </div>
        </>
      )}
```

Replace with:

```tsx
      <RecommendationProducts currentProductId={id} />
```

**Fix D:** Add the import. At the top of the file, add:

```tsx
import RecommendationProducts from "@/features/products/components/RecommendationProducts";
```

And add a client-side component to track the last viewed product. Create a new tiny component:

**New file: `client/src/components/TrackLastViewed.tsx`**
```tsx
"use client";
import { useEffect } from "react";

export default function TrackLastViewed({ productId }: { productId: string }) {
  useEffect(() => {
    if (productId) {
      localStorage.setItem("lastViewedProductId", productId);
    }
  }, [productId]);
  return null;
}
```

Then add it to the product page JSX (inside `<Shell>`, before the grid):
```tsx
import TrackLastViewed from "@/components/TrackLastViewed";
// ...
<Shell>
  <TrackLastViewed productId={id} />
  {/* ... rest of page */}
```

### Verification for Phase 5

1. Start both the ML server and Next.js dev server.
2. Open two different browser windows logged in as two different users.
3. Navigate to the same product page in both.
4. The "We Think You'll Love" section should show **different products** for each user.
5. Check browser network tab: you should see a request to `/api/recommendations?productId=...`.
6. In the Next.js server console you should see `[/api/recommendations]` logs.

---

## Phase 6 — Fix RecommendationReason.tsx (client/)

**Goal:** Replace the fake charCodeAt context with real Supabase event data before calling Gemini.

### Step 6.1 — Update /api/recommendation-reason/route.ts

Replace the entire file contents:

```typescript
// client/src/app/api/recommendation-reason/route.ts
import { google } from "@ai-sdk/google";
import { streamText } from "ai";
import { cookies } from "next/headers";
import createSupabaseClient from "@/lib/supabase/server";

export async function POST(req: Request) {
  const { productName, currentProductName, productId } = await req.json();

  const cookieStore = cookies();
  const supabase    = createSupabaseClient({ cookieStore });
  const { data: { user } } = await supabase.auth.getUser();

  // ── Build REAL context from Supabase ──────────────────────────────────
  let realContext = {
    isInCart:        false,
    isInWishlist:    false,
    recentlyViewed:  false,
    recentEvents:    [] as string[],
  };

  if (user && productId) {
    const [cartRes, wishlistRes, eventsRes] = await Promise.all([
      supabase.from("carts").select("product_id").eq("user_id", user.id).eq("product_id", productId).maybeSingle(),
      supabase.from("wishlist").select("product_id").eq("user_id", user.id).eq("product_id", productId).maybeSingle(),
      supabase.from("events").select("type, product_id").eq("user_id", user.id).order("created_at", { ascending: false }).limit(10),
    ]);

    realContext.isInCart       = !!cartRes.data;
    realContext.isInWishlist   = !!wishlistRes.data;
    realContext.recentlyViewed = eventsRes.data?.some((e) => e.product_id === productId) ?? false;
    realContext.recentEvents   = eventsRes.data?.map((e) => e.type) ?? [];
  }

  // ── Build prompt from real context ───────────────────────────────────
  const contextLines: string[] = [];
  if (realContext.isInCart)       contextLines.push("This product is in the user's cart");
  if (realContext.isInWishlist)   contextLines.push("This product is in the user's wishlist");
  if (realContext.recentlyViewed) contextLines.push("User has previously viewed this product");
  if (realContext.recentEvents.includes("button_click"))  contextLines.push("User has clicked on fashion items recently");
  if (realContext.recentEvents.includes("image_hovered")) contextLines.push("User has shown visual interest in products");
  if (contextLines.length === 0)  contextLines.push("User is browsing the store");

  const result = streamText({
    model: google("gemini-2.0-flash-001"),
    system:
      "You are a helpful fashion recommendation assistant. Provide brief, specific reasons why products might be recommended to users based on their browsing or purchasing behaviour. Keep responses under 10 words. Be specific. No markdown.",
    messages: [{
      role: "user",
      content:
        `Why is "${productName}" recommended to someone viewing "${currentProductName}"?\n` +
        `Context: ${contextLines.join(". ")}.\n` +
        `Answer in under 10 words.`,
    }],
  });

  return result.toDataStreamResponse();
}
```

### Step 6.2 — Update RecommendationReason.tsx to pass productId

The component currently does not pass `productId` to the API route. Update the `fetchRecommendationReason` function to include it:

In `client/src/components/RecommendationReason.tsx`, replace the `fetch` call body:

```typescript
body: JSON.stringify({
  productName,
  currentProductName,
  productId,   // ← ADD THIS (it is already a prop on the component)
}),
```

Also remove the entire `generateUniqueContext` function and the `productAttributes` block — they are no longer used.

### Verification for Phase 6

1. Navigate to a product page.
2. Click "Why recommended?" on a recommendation card.
3. In the Supabase dashboard, check the `events` table — the context in the Gemini call should now reflect actual user events, not charCodeAt values.
4. If logged out, the explanation should still work (empty context, generic reason).

---

## Phase 7 — Final Integration Check

### Checklist

Run through every item before marking the integration complete:

- [ ] `grep -rn "AIzaSy\|tbkx roos\|surabhiwaingankar" ml/` returns **zero results**
- [ ] `ml/.env` exists and is listed in `ml/.gitignore`
- [ ] `id_mappings.json` exists in `ml/` and contains 1000 entries
- [ ] `training_products.csv` and `training_interactions.csv` exist in `ml/hybrid_recommendation/`
- [ ] ML server starts with `python main.py` from the `ml/` directory without errors
- [ ] `curl http://localhost:8000/` returns `{"status":"ok","models_loaded":true}`
- [ ] `ML_API_URL` is in `client/.env.local` and in `client/src/lib/env.mjs`
- [ ] `client/src/app/api/recommendations/route.ts` exists
- [ ] Two logged-in users see different recommendations on the same product page
- [ ] With ML server stopped, the frontend shows top-rated products (no error, no crash)
- [ ] `client/src/app/(store)/shop/[slug]/page.tsx` no longer contains `productsCollection(first: 4)` for recommendations
- [ ] `RecommendationReason.tsx` no longer contains `charCodeAt` or `generateUniqueContext`
- [ ] Network tab shows `/api/recommendations` requests (not direct calls to port 8000)
- [ ] `TrackLastViewed` component sets `lastViewedProductId` in localStorage on product pages
- [ ] Cart page and wishlist page `RecommendationProducts` component uses `lastViewedProductId` from localStorage

### Running Both Servers

```bash
# Terminal 1 — ML Server
cd ml
pip install -r requirements.txt
python main.py

# Terminal 2 — Next.js
cd client
npm run dev
```

---

## Common Errors & Fixes

| Error | Cause | Fix |
|-------|-------|-----|
| `KeyError: 'GEMINI_API_KEY'` on ML server start | `.env` file missing or not in `ml/` directory | Create `ml/.env` with correct keys |
| `ModuleNotFoundError: dotenv` | `python-dotenv` not installed | `pip install python-dotenv` or re-run `pip install -r requirements.txt` |
| `503 Models not yet loaded` from `/recommend/` | Request arrived before lifespan startup finished | Wait for "ML models ready." in ML server console |
| `TypeError: env.ML_API_URL is not defined` | Missing from `env.mjs` runtimeEnv | Add `ML_API_URL: process.env.ML_API_URL` to both `runtimeEnv` and `experimental__runtimeEnv` |
| Recommendations always same 4 products | `RecommendationProducts.tsx` not yet updated | Confirm Phase 5 changes are saved and dev server reloaded |
| `CORS error` in browser console | Frontend calling ML server directly | All ML calls must go through `/api/recommendations` — never expose port 8000 to browser |
| `id_mappings.json not found` | Phase 2 script not run yet | `cd ml && python scripts/prepare_training_data.py` |
| Empty recommendation list returned | Product UUID not in `id_mappings.json` | Re-run `prepare_training_data.py`; verify the UUID exists in `fashion_products.csv` |
