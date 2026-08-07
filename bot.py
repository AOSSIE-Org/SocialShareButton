import sys
import os
import argparse
import config
import github_auth
import knowledge_agent


def process_github_comment(
    access_token: str,
    owner: str,
    repo: str,
    issue_number: int,
    comment_body: str,
    comment_author: str = "Contributor"
) -> bool:
    """
    Headlessly processes an incoming GitHub comment containing @Knowledge.
    1. Reads Issue Context & Repository Files via GitHub REST API.
    2. Calls Mistral AI (mistral-small-2506) to synthesize answer.
    3. Posts comment directly back to GitHub Issue!
    """
    if "@Knowledge" not in comment_body and "@knowledge" not in comment_body:
        print("No @Knowledge mention found in comment. Skipping.")
        return False
        
    print(f"🤖 Processing @Knowledge request from @{comment_author} on {owner}/{repo} Issue #{issue_number}...")
    
    # 1. Fetch Issue Context
    issues = github_auth.fetch_repo_issues(access_token, owner, repo)
    target_issue = None
    for i in issues:
        if i.get("number") == issue_number:
            target_issue = i
            break
            
    if not target_issue:
        target_issue = {
            "number": issue_number,
            "title": f"Issue #{issue_number}",
            "body": comment_body,
            "user": {"login": comment_author}
        }
        
    # 2. Fetch Comments Thread
    comments = github_auth.fetch_issue_comments(access_token, owner, repo, issue_number)
    
    # 3. Generate Answer using Mistral AI (mistral-small-2506)
    result = knowledge_agent.generate_knowledge_answer(
        access_token=access_token,
        owner=owner,
        repo=repo,
        issue=target_issue,
        comments=comments,
        custom_query=comment_body
    )
    
    answer_text = result.get("answer", "")
    engine_used = result.get("engine", "Mistral AI")
    
    # Add signature footer
    formatted_reply = f"{answer_text}\n\n---\n*🤖 Answered by @Knowledge Bot using {engine_used}*"
    
    # 4. Post Reply directly back to GitHub Issue!
    print(f"💬 Posting reply back to GitHub Issue #{issue_number}...")
    success = github_auth.post_issue_comment(access_token, owner, repo, issue_number, formatted_reply)
    
    if success:
        print("🎉 Successfully posted response to GitHub!")
    else:
        print("❌ Failed to post response to GitHub.")
        
    return success


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Knowledge GitHub Bot CLI")
    parser.add_argument("--owner", required=True, help="GitHub repository owner")
    parser.add_argument("--repo", required=True, help="GitHub repository name")
    parser.add_argument("--issue", type=int, required=True, help="Issue number")
    parser.add_argument("--comment", required=True, help="Comment body containing @Knowledge")
    parser.add_argument("--token", help="GitHub OAuth or Personal Access Token (defaults to GITHUB_TOKEN env var)")
    
    args = parser.parse_args()
    
    token = args.token or os.getenv("GITHUB_TOKEN") or config.GITHUB_CLIENT_SECRET
    if not token:
        print("Error: GitHub Token required via --token or GITHUB_TOKEN environment variable.")
        sys.exit(1)
        
    process_github_comment(
        access_token=token,
        owner=args.owner,
        repo=args.repo,
        issue_number=args.issue,
        comment_body=args.comment
    )
