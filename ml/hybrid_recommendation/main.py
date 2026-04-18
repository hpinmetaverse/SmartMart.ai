import os
import json
import pandas as pd
from hybrid_recommendation.content_filtering import (
    build_content_matrix,
    get_content_based_recommendations,
)
from hybrid_recommendation.collaborative_filtering import (
    build_collaborative_model,
    get_collaborative_filtering_recommendations,
)
from hybrid_recommendation.metrics import (
    compute_metrics,
    precision_recall_at_k,
    evaluate_model,
)
from hybrid_recommendation.context_aware import get_context_aware_recommendations
from hybrid_recommendation.hybrid import get_hybrid_recommendations


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
    product_int = id_to_int.get(str(product_uuid))
    # Use a stable integer for user (hash mod 200 to keep within synthetic user space)
    user_int = abs(hash(user_uuid)) % 200 + 1

    if product_int is None:
        # Product not in training data — fall back to collaborative only
        collab_recs_int = get_collaborative_filtering_recommendations(
            user_int, top_n, algo, trainset
        )
        return [int_to_id[str(i)] for i in collab_recs_int if str(i) in int_to_id]

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
    return [int_to_id[str(i)] for i in hybrid_int if str(i) in int_to_id]
