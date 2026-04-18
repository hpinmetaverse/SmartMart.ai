import pandas as pd
from fastapi import FastAPI
from typing import List, Dict
from mlxtend.frequent_patterns import fpgrowth, association_rules

app = FastAPI()


def analyze_association_rules(file_path, min_support=0.05, min_lift=1):
    """
    Analyzes frequent itemsets and association rules using the FP-Growth algorithm.
    """
    # Load dataset
    df = pd.read_csv(file_path)

    # Convert dataset into a transactional format
    basket = (
        df.groupby(["Transaction_ID", "Item"])["Item"]
        .count()
        .unstack()
        .reset_index()
        .fillna(0)
    )

    # Convert to 1/0 binary format
    basket.set_index("Transaction_ID", inplace=True)
    basket = basket.applymap(lambda x: 1 if x > 0 else 0)

    # Apply FP-Growth algorithm
    frequent_itemsets = fpgrowth(basket, min_support=min_support, use_colnames=True)

    # Generate association rules
    rules = association_rules(frequent_itemsets, metric="lift", min_threshold=min_lift)

    return (
        frequent_itemsets,
        rules[["antecedents", "consequents", "support", "confidence", "lift"]],
    )


