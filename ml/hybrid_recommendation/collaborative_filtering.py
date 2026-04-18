from surprise import Dataset, Reader, SVD
from surprise.model_selection import train_test_split


def build_collaborative_model(data):
    """
    Builds and trains a collaborative filtering model using the SVD algorithm.
    Expects data with columns: 'User ID', 'Product ID', and 'Rating'.
    """
    reader = Reader(rating_scale=(1, 5))
    ratings_data = Dataset.load_from_df(
        data[["User ID", "Product ID", "Rating"]], reader
    )
    trainset, testset = train_test_split(ratings_data, test_size=0.25)
    algo = SVD()
    algo.fit(trainset)
    predictions = algo.test(testset)
    return algo, trainset, predictions


def get_collaborative_filtering_recommendations(user_id, top_n, algo, trainset):
    """
    Returns the top_n product recommendations for a given user based on the
    collaborative filtering model.
    """
    testset = trainset.build_anti_testset()
    # Filter to only include the target user
    testset = filter(lambda x: x[0] == user_id, testset)
    predictions = list(algo.test(testset))
    predictions.sort(key=lambda x: x.est, reverse=True)
    recommendations = [pred.iid for pred in predictions[:top_n]]
    return recommendations
