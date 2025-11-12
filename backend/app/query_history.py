# Simple in-memory storage for query history
# Format: {user_id: [list of queries]}
query_history = {}

def add_query_to_history(user_id: int, query: str):
    """Add a query to user's history (keep last 10)"""
    if user_id not in query_history:
        query_history[user_id] = []
    
    query_history[user_id].insert(0, query)  # Add to beginning
    
    # Keep only last 10 queries
    if len(query_history[user_id]) > 10:
        query_history[user_id] = query_history[user_id][:10]

def get_user_query_history(user_id: int):
    """Get user's query history"""
    return query_history.get(user_id, [])