from typing import Dict, Any, List, Optional
import urllib.parse
import httpx
from config import GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET, REDIRECT_URI

GITHUB_AUTH_URL = "https://github.com/login/oauth/authorize"
GITHUB_TOKEN_URL = "https://github.com/login/oauth/access_token"
GITHUB_API_BASE = "https://api.github.com"


def get_authorization_url(state: str = "knowledge_auth_state", scope: str = "read:user repo") -> str:
    """
    Constructs the GitHub OAuth authorization URL.
    
    Flow step: Knowledge -> Connect GitHub -> GitHub Authorization Page
    """
    params = {
        "client_id": GITHUB_CLIENT_ID,
        "redirect_uri": REDIRECT_URI,
        "scope": scope,
        "state": state,
        "allow_signup": "true",
    }
    return f"{GITHUB_AUTH_URL}?{urllib.parse.urlencode(params)}"


def exchange_code_for_token(code: str) -> Optional[str]:
    """
    Exchanges authorization code from GitHub callback for an access token.
    
    Flow step: GitHub -> Return to Knowledge with code -> Fetch Token
    """
    payload = {
        "client_id": GITHUB_CLIENT_ID,
        "client_secret": GITHUB_CLIENT_SECRET,
        "code": code,
        "redirect_uri": REDIRECT_URI,
    }
    headers = {"Accept": "application/json"}
    
    try:
        with httpx.Client(timeout=10.0) as client:
            response = client.post(GITHUB_TOKEN_URL, data=payload, headers=headers)
            response.raise_for_status()
            data = response.json()
            return data.get("access_token")
    except Exception as e:
        print(f"Error exchanging code for token: {e}")
        return None


def _get_headers(access_token: Optional[str]) -> Dict[str, str]:
    headers = {
        "Accept": "application/vnd.github.v3+json",
        "User-Agent": "Knowledge-App",
    }
    if access_token:
        headers["Authorization"] = f"Bearer {access_token}"
    return headers


def fetch_github_user(access_token: str) -> Optional[Dict[str, Any]]:
    """
    Fetches the authenticated user's profile details from GitHub API.
    """
    headers = _get_headers(access_token)
    
    try:
        with httpx.Client(timeout=10.0) as client:
            response = client.get(f"{GITHUB_API_BASE}/user", headers=headers)
            response.raise_for_status()
            return response.json()
    except Exception as e:
        print(f"Error fetching GitHub user profile: {e}")
        return None


def fetch_user_repositories(access_token: str, visibility: str = "all") -> List[Dict[str, Any]]:
    """
    Fetches the repositories accessible to the authorized user.
    """
    headers = _get_headers(access_token)
    params = {
        "sort": "updated",
        "direction": "desc",
        "per_page": 100,
        "visibility": visibility
    }
    
    try:
        with httpx.Client(timeout=10.0) as client:
            response = client.get(f"{GITHUB_API_BASE}/user/repos", headers=headers, params=params)
            response.raise_for_status()
            return response.json()
    except Exception as e:
        print(f"Error fetching repositories: {e}")
        return []


def fetch_repo_issues(access_token: str, owner: str, repo: str) -> List[Dict[str, Any]]:
    """
    Fetches issues for a given repository.
    """
    headers = _get_headers(access_token)
    params = {"state": "all", "sort": "updated", "direction": "desc", "per_page": 30}
    
    try:
        with httpx.Client(timeout=10.0) as client:
            response = client.get(f"{GITHUB_API_BASE}/repos/{owner}/{repo}/issues", headers=headers, params=params)
            response.raise_for_status()
            # Filter out pull requests (GitHub API returns PRs in issues endpoint if 'pull_request' key is present)
            issues = [i for i in response.json() if "pull_request" not in i]
            return issues
    except Exception as e:
        print(f"Error fetching issues for {owner}/{repo}: {e}")
        return []


def fetch_issue_comments(access_token: str, owner: str, repo: str, issue_number: int) -> List[Dict[str, Any]]:
    """
    Fetches comments for a specific repository issue.
    """
    headers = _get_headers(access_token)
    
    try:
        with httpx.Client(timeout=10.0) as client:
            response = client.get(
                f"{GITHUB_API_BASE}/repos/{owner}/{repo}/issues/{issue_number}/comments",
                headers=headers
            )
            response.raise_for_status()
            return response.json()
    except Exception as e:
        print(f"Error fetching comments for issue #{issue_number}: {e}")
        return []


def fetch_repo_file_content(access_token: str, owner: str, repo: str, file_path: str) -> Optional[str]:
    """
    Fetches and decodes base64 raw text content of a file from GitHub repository.
    """
    import base64
    headers = _get_headers(access_token)
    
    try:
        with httpx.Client(timeout=10.0) as client:
            response = client.get(
                f"{GITHUB_API_BASE}/repos/{owner}/{repo}/contents/{file_path}",
                headers=headers
            )
            response.raise_for_status()
            data = response.json()
            if "content" in data and data.get("encoding") == "base64":
                decoded_bytes = base64.b64decode(data["content"])
                return decoded_bytes.decode("utf-8", errors="replace")
            return None
    except Exception as e:
        print(f"Error fetching file {file_path} from {owner}/{repo}: {e}")
        return None


def extract_referenced_files(text: str) -> List[str]:
    """
    Scans text (issue body/comments) for mentioned file paths using regex rules.
    Matches formats like: README.md, requirements.txt, config.py, `path/to/file.ext`, docs/file.md
    """
    import re
    if not text:
        return []
        
    pattern = r'\b([a-zA-Z0-9_\-\/\.]+\.(?:md|txt|py|json|yml|yaml|env|toml|js|ts|html|css))\b'
    matches = re.findall(pattern, text)
    
    # Standard ground truth docs to check by default if present
    defaults = ["KNOWLEDGE.md", "README.md", "CONTRIBUTING.md", "requirements.txt", "config.py", ".env.example"]
    
    unique_files = list(set(matches + defaults))
    return unique_files


def post_issue_comment(access_token: str, owner: str, repo: str, issue_number: int, comment_body: str) -> bool:
    """
    Posts a comment to a GitHub issue on behalf of the authorized user/bot.
    POST /repos/{owner}/{repo}/issues/{issue_number}/comments
    """
    headers = _get_headers(access_token)
    payload = {"body": comment_body}
    
    try:
        with httpx.Client(timeout=10.0) as client:
            response = client.post(
                f"{GITHUB_API_BASE}/repos/{owner}/{repo}/issues/{issue_number}/comments",
                headers=headers,
                json=payload
            )
            response.raise_for_status()
            return True
    except Exception as e:
        print(f"Error posting comment to issue #{issue_number}: {e}")
        if hasattr(e, 'response') and e.response is not None:
            print(f"Response details: {e.response.text}")
        return False


def fetch_pull_request(access_token: str, owner: str, repo: str, pr_number: int) -> Optional[Dict[str, Any]]:
    """
    Fetches details for a specific Pull Request from GitHub API.
    GET /repos/{owner}/{repo}/pulls/{pull_number}
    """
    headers = _get_headers(access_token)
    
    try:
        with httpx.Client(timeout=10.0) as client:
            response = client.get(
                f"{GITHUB_API_BASE}/repos/{owner}/{repo}/pulls/{pr_number}",
                headers=headers
            )
            response.raise_for_status()
            return response.json()
    except Exception as e:
        print(f"Error fetching PR #{pr_number} for {owner}/{repo}: {e}")
        return None


def fetch_pull_request_files(access_token: str, owner: str, repo: str, pr_number: int) -> List[Dict[str, Any]]:
    """
    Fetches list of files modified by a specific Pull Request.
    GET /repos/{owner}/{repo}/pulls/{pull_number}/files
    """
    headers = _get_headers(access_token)
    
    try:
        with httpx.Client(timeout=10.0) as client:
            response = client.get(
                f"{GITHUB_API_BASE}/repos/{owner}/{repo}/pulls/{pr_number}/files",
                headers=headers
            )
            response.raise_for_status()
            return response.json()
    except Exception as e:
        print(f"Error fetching files for PR #{pr_number} in {owner}/{repo}: {e}")
        return []


