import os
from dotenv import load_dotenv

# Load environment variables from .env file if present
load_dotenv()

GITHUB_CLIENT_ID = os.getenv("GITHUB_CLIENT_ID", "")
GITHUB_CLIENT_SECRET = os.getenv("GITHUB_CLIENT_SECRET", "")
REDIRECT_URI = os.getenv("REDIRECT_URI", "http://localhost:8501")

# Mistral AI Configuration
MISTRAL_API_KEY = os.getenv("MISTRAL_API_KEY", "")
MISTRAL_MODEL = os.getenv("MISTRAL_MODEL", "mistral-small-2506")

def is_github_configured() -> bool:
    """Check if GitHub OAuth client ID and secret are configured."""
    return bool(GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET and 
                GITHUB_CLIENT_ID != "your_github_client_id_here" and 
                GITHUB_CLIENT_SECRET != "your_github_client_secret_here")

def is_mistral_configured() -> bool:
    """Check if Mistral API key is configured."""
    return bool(MISTRAL_API_KEY and MISTRAL_API_KEY != "your_mistral_api_key_here")
