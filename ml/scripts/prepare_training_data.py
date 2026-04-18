"""
One-time script to prepare ML training data.
Run from the ml/ directory: python scripts/prepare_training_data.py

Requires:
  - hybrid_recommendation/fashion_products.csv  (project-native, 1000 products)

Produces:
  - hybrid_recommendation/training_products.csv  (content matrix input)
  - hybrid_recommendation/training_interactions.csv  (SVD training input)
  - id_mappings.json  (UUID <-> integer index for inference time)
"""

import pandas as pd
import json
import os
import numpy as np

PRODUCTS_CSV     = "hybrid_recommendation/fashion_products.csv"
OUT_PRODUCTS     = "hybrid_recommendation/training_products.csv"
OUT_INTERACTIONS = "hybrid_recommendation/training_interactions.csv"
MAPPINGS_FILE    = "id_mappings.json"


def main():
    # ── Load project products ──────────────────────────────────────────────
    products = pd.read_csv(PRODUCTS_CSV)
    print(f"Loaded {len(products)} products from {PRODUCTS_CSV}")
    print(f"Columns: {list(products.columns)}")

    # The CSV already has integer Product IDs (1-based).
    # We use these as-is for the ML models.
    # The id_mappings.json will map Supabase UUIDs -> these integers at runtime.
    # For now, we create a self-mapping so the ML server can start.
    # The actual UUID mapping will be populated when Supabase product UUIDs are available.

    product_ids = products["Product ID"].unique().tolist()
    n_products = len(product_ids)

    # Build bidirectional maps (str keys for JSON compatibility)
    # For now: integer -> integer (will be UUID -> integer in production)
    id_to_int = {str(pid): int(pid) for pid in product_ids}
    int_to_id = {str(pid): str(pid) for pid in product_ids}

    with open(MAPPINGS_FILE, "w") as f:
        json.dump({"id_to_int": id_to_int, "int_to_id": int_to_id}, f, indent=2)
    print(f"Saved ID mappings to {MAPPINGS_FILE} ({n_products} products)")

    # ── Build content training CSV ─────────────────────────────────────────
    # The CSV already has the TF-IDF required columns:
    # Product ID, Product Name, Brand, Category, Color, Size
    content = products[["Product ID", "Product Name", "Brand", "Category", "Color", "Size"]].copy()
    content.to_csv(OUT_PRODUCTS, index=False)
    print(f"Saved content training data: {OUT_PRODUCTS} ({len(content)} rows)")

    # ── Build interaction training CSV ─────────────────────────────────────
    # The CSV already contains User ID, Product ID, and Rating columns
    interactions = products[["User ID", "Product ID", "Rating"]].copy()

    # Clip ratings to 1–5
    interactions["Rating"] = interactions["Rating"].clip(1, 5).round(1)

    # Augment with additional synthetic interactions for better SVD training
    # The existing 1000 rows are sparse; add more variety
    np.random.seed(42)
    n_extra = 4000
    extra_user_ids = np.random.randint(1, 201, size=n_extra)
    extra_product_ids = np.random.choice(product_ids, size=n_extra)
    # Base ratings on existing product ratings, add noise
    base_ratings = []
    rating_lookup = dict(zip(products["Product ID"], products["Rating"]))
    for pid in extra_product_ids:
        base_ratings.append(rating_lookup.get(pid, 3.0))
    base_ratings = np.array(base_ratings, dtype=float)
    noise = np.random.uniform(-1.0, 1.0, size=n_extra)
    extra_ratings = np.clip(base_ratings + noise, 1, 5).round(1)

    extra_df = pd.DataFrame({
        "User ID": extra_user_ids,
        "Product ID": extra_product_ids,
        "Rating": extra_ratings,
    })

    interactions = pd.concat([interactions, extra_df], ignore_index=True)
    interactions.to_csv(OUT_INTERACTIONS, index=False)
    print(f"Saved interaction training data: {OUT_INTERACTIONS} ({len(interactions)} rows)")


if __name__ == "__main__":
    main()
