import pandas as pd
import random

# Define categories
categories = [
    "Men's Clothing",
    "Women's Clothing",
    "Shoes",
    "Accessories",
    "Kids' Clothing",
    "Watches",
]

# Define common item pairs (frequently bought together)
popular_combinations = [
    ["Men's Clothing", "Watches"],
    ["Women's Clothing", "Accessories"],
    ["Kids' Clothing", "Shoes"],
    ["Shoes", "Accessories"],
]

# Generate synthetic transactions
num_transactions = 1000  # Number of transactions
transactions = []

for transaction_id in range(1, num_transactions + 1):
    num_items = random.randint(1, 3)  # Each transaction has 1 to 3 items
    items = random.sample(categories, num_items)

    # 40% chance of adding a popular combination
    if random.random() < 0.4:
        items.extend(random.choice(popular_combinations))

    items = list(set(items))  # Remove duplicates within the transaction

    for item in items:
        transactions.append([transaction_id, item])

# Convert to DataFrame
df = pd.DataFrame(transactions, columns=["Transaction_ID", "Item"])

# Save as CSV file
df.to_csv("ecommerce_fashion_data.csv", index=False)

print("Dataset generated and saved as 'ecommerce_fashion_data.csv'")
