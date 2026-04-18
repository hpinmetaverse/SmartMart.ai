"""
Generate the 5 CSV data files required by ml2/ multi-modal recommendation model.
Data is based on the 5 Supabase products + synthetic user interactions.
"""
import pandas as pd
import numpy as np
import os
import random
from datetime import datetime, timedelta

random.seed(42)
np.random.seed(42)

# ── Supabase products (hard-coded from DB) ────────────────────────────────
products_raw = [
    {"product_id": 1, "product_name": "Product 1", "description": "Modern bathroom essentials collection with premium quality fixtures and accessories for contemporary homes.", "category": "Mens", "price": 99.99, "rating": 4.0},
    {"product_id": 2, "product_name": "Product 2", "description": "Professional kitchen planning set with ergonomic tools and stylish storage solutions for modern cooking.", "category": "Kitchen", "price": 149.99, "rating": 3.5},
    {"product_id": 3, "product_name": "Product 3", "description": "Premium living room furniture collection featuring elegant designs and durable construction materials.", "category": "Mens", "price": 199.99, "rating": 5.0},
    {"product_id": 4, "product_name": "Product 4", "description": "Comfortable bedroom furnishing set with luxury bedding, ambient lighting fixtures and cozy accessories.", "category": "Kitchen", "price": 79.99, "rating": 2.0},
    {"product_id": 5, "product_name": "Product 5", "description": "Stylish bathroom renovation kit with modern marble fixtures, gold-accented hardware and glass enclosures.", "category": "Mens", "price": 129.99, "rating": 5.0},
]

# ── 1. products_expanded.csv ──────────────────────────────────────────────
products_df = pd.DataFrame(products_raw)
products_df.to_csv("products_expanded.csv", index=False)
print(f"✓ products_expanded.csv  ({len(products_df)} products)")

# ── 2. users_expanded.csv ─────────────────────────────────────────────────
users = []
first_names = ["Alice", "Bob", "Charlie", "Diana", "Eve", "Frank", "Grace",
               "Hank", "Ivy", "Jack", "Karen", "Leo", "Mia", "Noah", "Olivia",
               "Pete", "Quinn", "Rosa", "Sam", "Tara"]
for i in range(1, 21):
    name = first_names[i - 1]
    users.append({
        "user_id": i,
        "name": name,
        "email": f"{name.lower()}@example.com",
        "age": random.randint(18, 65),
        "gender": random.choice(["M", "F"]),
    })
users_df = pd.DataFrame(users)
users_df.to_csv("users_expanded.csv", index=False)
print(f"✓ users_expanded.csv     ({len(users_df)} users)")

# ── 3. product_images_expanded.csv ────────────────────────────────────────
image_keys = {
    1: "public/bathroom-planning.jpg",
    2: "public/kitchen-planning.jpg",
    3: "public/living-room-planning.jpg",
    4: "public/bedroom-planning.jpg",
    5: "public/bathroom-planning.jpg",  # Product 5 shares Product 1's image
}

# The ml2 model expects actual file paths for ResNet50 processing.
# We'll point to the images we already placed in client/public/media/public/
base_image_dir = os.path.join(os.path.dirname(__file__), "..", "client", "public", "media", "public")

image_rows = []
view_types = ["front", "side", "back", "full"]
for pid, key in image_keys.items():
    filename = key.split("/")[-1]  # e.g. "bathroom-planning.jpg"
    img_path = os.path.abspath(os.path.join(base_image_dir, filename))
    for vt_idx, vt in enumerate(view_types[:1]):  # Only front view for now (we have 1 image per product)
        image_rows.append({
            "product_id": pid,
            "image_path": img_path,
            "view_type": f"{pid}_{vt_idx + 1}_{vt}",
        })

images_df = pd.DataFrame(image_rows)
images_df.to_csv("product_images_expanded.csv", index=False)
print(f"✓ product_images_expanded.csv ({len(images_df)} entries)")

# ── 4. purchases_expanded.csv ─────────────────────────────────────────────
purchases = []
base_date = datetime(2025, 1, 1)
for _ in range(100):
    purchases.append({
        "user_id": random.randint(1, 20),
        "product_id": random.randint(1, 5),
        "purchase_date": (base_date + timedelta(days=random.randint(0, 365))).strftime("%Y-%m-%d"),
        "quantity": random.randint(1, 3),
    })
purchases_df = pd.DataFrame(purchases)
purchases_df.to_csv("purchases_expanded.csv", index=False)
print(f"✓ purchases_expanded.csv ({len(purchases_df)} purchases)")

# ── 5. browsing_history_expanded.csv ──────────────────────────────────────
browsing = []
for _ in range(200):
    browsing.append({
        "user_id": random.randint(1, 20),
        "product_id": random.randint(1, 5),
        "browse_date": (base_date + timedelta(days=random.randint(0, 365))).strftime("%Y-%m-%d"),
        "duration": round(random.uniform(5, 300), 1),  # seconds
    })
browsing_df = pd.DataFrame(browsing)
browsing_df.to_csv("browsing_history_expanded.csv", index=False)
print(f"✓ browsing_history_expanded.csv ({len(browsing_df)} entries)")

print("\n✅ All 5 CSV files generated successfully.")
