def calculate_discount_score(user, target_category=None):
    """
    Calculate a personalized discount score for a given user.
    """
    score = 0

    # Ensure lists exist (handle missing keys gracefully)
    purchase_history = user.get("purchase_history", []) or []
    browsing_history = user.get("browsing_history", []) or []

    # 1. Evaluate interest in a target category
    if target_category:
        if target_category in purchase_history:
            score += 20
        if target_category in browsing_history:
            score += 10

    # Additional engagement points
    score += len(purchase_history) * 5
    score += len(browsing_history) * 2

    # 2. Demographic adjustment
    age = user.get("age", 0)  # Default to 0 if missing
    score += 5 if age < 30 else 2

    # 3. Geographic adjustment
    location = user.get("location", "").upper()  # Normalize case
    score += 3 if location == "US" else 1

    return score


def score_to_discount(score):
    """Maps discount score to discount percentage."""
    if score < 20:
        return 5
    elif score < 40:
        return 10
    elif score < 60:
        return 15
    else:
        return 20


# # Example user object
# user = {
#     "user_id": 101,
#     "age": 25,
#     "location": "US",
#     "purchase_history": ["electronics", "books"],
#     "browsing_history": ["electronics", "clothing", "gadgets"]
# }

# # Specify the target product category for personalized interest
# target_category = 'electronics'

# # Calculate discount score and discount percentage
# discount_score = calculate_discount_score(user, target_category)
# personalized_discount = score_to_discount(discount_score)

# # Print results
# print(f"User ID: {user['user_id']}")
# print(f"Discount Score: {discount_score}")
# print(f"Personalized Discount: {personalized_discount}%")
