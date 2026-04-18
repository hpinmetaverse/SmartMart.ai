def get_hybrid_recommendations(top_n, content_recs, collab_recs, context_recs):
    """
    Combines content-based and collaborative filtering recommendations,
    removes duplicates, and returns the top_n hybrid recommendations.
    """
    hybrid_recommendations = list(set(list(content_recs) + list(collab_recs) + list(context_recs)))
    return hybrid_recommendations[:top_n]
