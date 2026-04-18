def get_context_aware_recommendations(user_id, top_n, original_data):
    """
    Filters the original data based on the user's context (Gender, Device Type,
    and Location Country) and returns the top_n recommendations.
    """
    user_rows = original_data[original_data['User ID'] == user_id]
    if not user_rows.empty:
        user_profile = user_rows.iloc[0]
    else:
        return []  # User not found

    user_gender = user_profile["Gender"]
    user_device = user_profile["Device Type"]
    user_location = user_profile["Location Country"]

    filtered_df = original_data[
        (original_data["Gender"] == user_gender) &
        (original_data["Device Type"] == user_device) &
        (original_data["Location Country"] == user_location)
    ]
    
    return filtered_df['Product ID'].head(top_n).tolist()
