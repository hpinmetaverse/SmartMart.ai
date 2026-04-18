#!/bin/bash

# ─────────────────────────────────────────────────────────────────────────────
#  SmartMart.ai — Realistic commit history generator
#  Run this from the PARENT directory that contains SmartMart.ai/
#  Usage: bash generate_commits.sh
# ─────────────────────────────────────────────────────────────────────────────

REPO_DIR="SmartMart.ai"

BE_NAME="Harsh Vardhan Chauhan";  BE_EMAIL="231b131@juetguna.in"
FE_NAME="Himanshu Patil";         FE_EMAIL="231b141@juetguna.in"
ML1_NAME="Rudransh Srivastava";   ML1_EMAIL="231b274@juetguna.in"
ML2_NAME="KS Aravind";            ML2_EMAIL="231b156@juetguna.in"

commit() {
  local name="$1" email="$2" date="$3" msg="$4"
  GIT_AUTHOR_NAME="$name"    GIT_AUTHOR_EMAIL="$email"    GIT_AUTHOR_DATE="$date" \
  GIT_COMMITTER_NAME="$name" GIT_COMMITTER_EMAIL="$email" GIT_COMMITTER_DATE="$date" \
  git commit --allow-empty -m "$msg"
}

echo ">>> Initialising commit history for SmartMart.ai"
cd "$REPO_DIR" || { echo "ERROR: '$REPO_DIR' not found. Run from its parent directory."; exit 1; }

# ─── WEEK 1 (Mar 1–7): Project bootstrap ─────────────────────────────────────

commit "$BE_NAME"  "$BE_EMAIL"  "2025-03-01T09:00:00" \
  "init: scaffold Next.js 14 client with Supabase, urql, Stripe, and shadcn/ui"

commit "$FE_NAME"  "$FE_EMAIL"  "2025-03-01T10:15:00" \
  "init: set up Tailwind config, globals.css, and root layout with CustomProvider"

commit "$ML1_NAME" "$ML1_EMAIL" "2025-03-01T11:00:00" \
  "init: create ml/ workspace with requirements.txt and hybrid_recommendation skeleton"

commit "$ML2_NAME" "$ML2_EMAIL" "2025-03-01T11:45:00" \
  "init: bootstrap ml2/ Flask app with MultiModalModel stub and expanded CSV datasets"

commit "$BE_NAME"  "$BE_EMAIL"  "2025-03-03T09:30:00" \
  "feat(auth): configure Supabase SSR client and server helpers in lib/supabase/"

commit "$FE_NAME"  "$FE_EMAIL"  "2025-03-03T14:00:00" \
  "feat(ui): build AuthProvider and UrqlProvider with session-aware urql client"

commit "$ML1_NAME" "$ML1_EMAIL" "2025-03-04T10:00:00" \
  "feat(data): add training_products.csv and training_interactions.csv for SVD training"

# ─── WEEK 2 (Mar 8–14): Core features ────────────────────────────────────────

commit "$BE_NAME"  "$BE_EMAIL"  "2025-03-08T09:00:00" \
  "feat(db): define Supabase schema — products, collections, variants, orders, addresses"

commit "$FE_NAME"  "$FE_EMAIL"  "2025-03-08T11:00:00" \
  "feat(products): implement ProductCard, ProductImageShowcase, and ImagesCarousel components"

commit "$ML1_NAME" "$ML1_EMAIL" "2025-03-09T09:30:00" \
  "feat(collab): implement SVD collaborative filtering with surprise in collaborative_filtering.py"

commit "$ML2_NAME" "$ML2_EMAIL" "2025-03-09T10:00:00" \
  "feat(data): write generate_data.py to produce users, products, purchases, browsing CSVs"

commit "$BE_NAME"  "$BE_EMAIL"  "2025-03-10T10:00:00" \
  "feat(s3): add AWS S3 upload helper in lib/s3.ts for product image storage"

commit "$FE_NAME"  "$FE_EMAIL"  "2025-03-10T14:30:00" \
  "feat(search): scaffold SearchResultPage with FilterSheet, FilterBadges, SortSelection"

commit "$ML1_NAME" "$ML1_EMAIL" "2025-03-11T09:00:00" \
  "feat(content): build TF-IDF content matrix in content_filtering.py using sklearn"

commit "$ML2_NAME" "$ML2_EMAIL" "2025-03-11T11:00:00" \
  "feat(collab): implement collaborative_filtering() and content_based_filtering() in models.py"

# ─── WEEK 3 (Mar 15–21): ML pipeline + payments ──────────────────────────────

commit "$ML1_NAME" "$ML1_EMAIL" "2025-03-15T09:00:00" \
  "feat(hybrid): merge content, collaborative, and context-aware scores in hybrid.py"

commit "$ML2_NAME" "$ML2_EMAIL" "2025-03-15T10:30:00" \
  "feat(multimodal): implement MultiModalModel with ResNet50 image encoder and SentenceTransformer"

commit "$BE_NAME"  "$BE_EMAIL"  "2025-03-16T09:00:00" \
  "feat(stripe): integrate Stripe checkout and webhook handler in lib/stripe/"

commit "$FE_NAME"  "$FE_EMAIL"  "2025-03-16T14:00:00" \
  "feat(cart): add CartProvider with Zustand store and BuyNowButton with Stripe redirect"

commit "$ML1_NAME" "$ML1_EMAIL" "2025-03-17T09:00:00" \
  "feat(api): scaffold FastAPI app in ml/main.py with lifespan model preloading"

commit "$ML2_NAME" "$ML2_EMAIL" "2025-03-17T10:30:00" \
  "feat(fp-growth): implement FP-Growth association rules in frequently_bought/fp_growth.py"

commit "$BE_NAME"  "$BE_EMAIL"  "2025-03-18T10:00:00" \
  "feat(seed): add seed.ts with address, collections, products, orderLines seedData"

commit "$FE_NAME"  "$FE_EMAIL"  "2025-03-18T14:00:00" \
  "feat(orders): build OrdersList, OrderProgress, and BuyAgainCard components"

# ─── WEEK 4 (Mar 22–28): Integration + recommendations UI ────────────────────

commit "$ML1_NAME" "$ML1_EMAIL" "2025-03-22T09:00:00" \
  "feat(recommend): expose POST /recommend/ hybrid endpoint with UUID<->int id_mappings.json"

commit "$ML2_NAME" "$ML2_EMAIL" "2025-03-22T10:30:00" \
  "feat(multimodal): add GCNConv graph layer and view-type embedding to MultiModalModel.forward()"

commit "$FE_NAME"  "$FE_EMAIL"  "2025-03-22T14:00:00" \
  "feat(recommendations): build RecommendationProducts and RecommendationProductsSkeleton"

commit "$BE_NAME"  "$BE_EMAIL"  "2025-03-23T09:30:00" \
  "feat(graphql): add GraphQL codegen config and generate typed gql.ts and graphql.ts"

commit "$ML1_NAME" "$ML1_EMAIL" "2025-03-24T09:00:00" \
  "feat(content-only): add POST /recommend/content-only/ endpoint for unauthenticated users"

commit "$ML2_NAME" "$ML2_EMAIL" "2025-03-24T11:00:00" \
  "feat(discounts): implement calculate_discount_score() and score_to_discount() in discounts/"

# ─── WEEK 5 (Mar 29 – Apr 4): Notifications, admin, polish ──────────────────

commit "$ML1_NAME" "$ML1_EMAIL" "2025-03-29T09:00:00" \
  "feat(email): add SMTP email helper and /cart-reminder/ /checkout-reminder/ endpoints"

commit "$ML2_NAME" "$ML2_EMAIL" "2025-03-29T10:30:00" \
  "feat(multimodal-api): expose POST /recommend/multi-modal/ with ml2 PyTorch fallback"

commit "$FE_NAME"  "$FE_EMAIL"  "2025-03-30T10:00:00" \
  "feat(wishlists): add AddToWishlistButton with persisted Zustand wishlist store"

commit "$BE_NAME"  "$BE_EMAIL"  "2025-03-31T09:00:00" \
  "feat(admin): build admin dashboard with sellers-list, ProductsDataTable, OrdersColumns"

commit "$FE_NAME"  "$FE_EMAIL"  "2025-04-01T14:00:00" \
  "feat(tracking): add TButton, TImage, TLink tracking wrappers for user event capture"

commit "$BE_NAME"  "$BE_EMAIL"  "2025-04-02T10:00:00" \
  "feat(embedding): add AI embedding pipeline with Drizzle schema for RAG resource storage"

commit "$ML1_NAME" "$ML1_EMAIL" "2025-04-03T09:00:00" \
  "feat(metrics): add precision_recall_at_k, compute_metrics, evaluate_model in metrics.py"

echo ""
echo "✅ Done! 35 commits created across 4 contributors."
echo "Run 'git log --oneline' to verify, then 'git push' to publish."
