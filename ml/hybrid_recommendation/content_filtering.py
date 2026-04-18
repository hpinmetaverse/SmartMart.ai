import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import linear_kernel

def build_content_matrix(data):
    """
    Creates a content dataframe from selected features and builds a TF-IDF 
    matrix along with a similarity matrix.
    """
    content_df = data[['Product ID', 'Product Name', 'Brand', 'Category', 'Color', 'Size']].copy()
    content_df['Content'] = content_df.apply(lambda row: ' '.join(row.dropna().astype(str)), axis=1)
    
    tfidf_vectorizer = TfidfVectorizer()
    content_matrix = tfidf_vectorizer.fit_transform(content_df['Content'])
    content_similarity = linear_kernel(content_matrix, content_matrix)
    return content_df, content_similarity

def get_content_based_recommendations(product_id, top_n, content_df, content_similarity):
    """
    Given a product ID, returns the top_n most similar product IDs based on content.
    """
    index = content_df[content_df['Product ID'] == product_id].index[0]
    similarity_scores = content_similarity[index]
    similar_indices = similarity_scores.argsort()[::-1][1:top_n+1]
    recommendations = content_df.loc[similar_indices, 'Product ID'].values
    return recommendations
