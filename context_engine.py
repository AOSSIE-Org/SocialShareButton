import re
from typing import Dict, Any, List, Optional, Tuple
import github_auth

class ContextEngine:
    """
    Issue Context Expansion Engine (Context Engine V1)
    Constructs the minimal, high-signal evidence set around a GitHub Issue
    by parsing and combining:
    - Current Issue Metadata
    - Maintainer Directives & Contributor Discussions
    - Linked PRs (Merged / Closed attempts & status)
    - Referenced Source Files & Docs
    """

    @staticmethod
    def extract_pr_references(text: str, current_issue_number: Optional[int] = None) -> List[int]:
        """
        Scans issue title, body, and comments for PR / Issue references like:
        - PR #143, #151, #143
        - pull/143, pulls/143
        - https://github.com/owner/repo/pull/143
        """
        if not text:
            return []

        patterns = [
            r'(?:PR|pr|Pull Request|pull|fixes|closes|refs)?\s*#(\d+)',
            r'github\.com\/[^\/]+\/[^\/]+\/pull\/(\d+)',
            r'pull\/(\d+)'
        ]

        found_numbers = set()
        for pat in patterns:
            matches = re.findall(pat, text, re.IGNORECASE)
            for m in matches:
                try:
                    num = int(m)
                    if current_issue_number is None or num != current_issue_number:
                        found_numbers.add(num)
                except ValueError:
                    pass

        return sorted(list(found_numbers))

    @staticmethod
    def categorize_comments(comments: List[Dict[str, Any]], issue_author: str = "") -> Tuple[List[Dict[str, Any]], List[Dict[str, Any]]]:
        """
        Separates issue comments into:
        1. Maintainer Directives (critical constraints/instructions)
        2. Contributor Discussions (general QA/discussion)
        """
        maintainer_directives = []
        contributor_discussions = []

        directive_keywords = ["don't", "dont", "do not", "must", "should", "ensure", "start with", "keep", "avoid", "note:", "rule"]

        for c in comments:
            author = c.get("user", {}).get("login", "Contributor")
            body = c.get("body", "").strip()
            
            is_maintainer = (
                author.lower() == issue_author.lower() or 
                author.lower() in ["maintainer", "owner", "admin", "lead"] or
                any(kw in body.lower() for kw in ["maintainer:", "admin:"])
            )

            is_directive = any(kw in body.lower() for kw in directive_keywords)

            comment_obj = {
                "author": author,
                "body": body,
                "is_maintainer": is_maintainer
            }

            if is_maintainer or is_directive:
                maintainer_directives.append(comment_obj)
            else:
                contributor_discussions.append(comment_obj)

        return maintainer_directives, contributor_discussions

    @classmethod
    def fetch_linked_prs(
        cls,
        access_token: Optional[str],
        owner: str,
        repo: str,
        pr_numbers: List[int],
        simulated_prs: Optional[Dict[int, Dict[str, Any]]] = None
    ) -> List[Dict[str, Any]]:
        """
        Fetches metadata for referenced PRs via GitHub API or simulation fallback.
        """
        linked_prs = []
        simulated_prs = simulated_prs or {}

        # Default Demo PRs for interactive testing (e.g. Issue #142)
        demo_prs = {
            143: {
                "number": 143,
                "title": "Refactor auth UI to modern layout",
                "state": "closed",
                "merged": False,
                "body": "Previous attempt at modernizing the auth UI. Closed because it broke mobile responsiveness on small screens.",
                "changed_files": ["src/components/AuthPanel.js", "src/styles/auth.css"],
                "html_url": f"https://github.com/{owner}/{repo}/pull/143"
            },
            151: {
                "number": 151,
                "title": "Introduce AuthPanel component structure",
                "state": "closed",
                "merged": True,
                "body": "Merged PR that introduced the modern modular AuthPanel structure used across authentication pages.",
                "changed_files": ["src/components/AuthPanel.js", "src/auth/oauth_handler.js"],
                "html_url": f"https://github.com/{owner}/{repo}/pull/151"
            }
        }

        for num in pr_numbers:
            # Check simulated/override PRs first
            if num in simulated_prs:
                linked_prs.append(simulated_prs[num])
                continue

            if num in demo_prs and (not access_token or owner in ["demo", "example", "test"]):
                linked_prs.append(demo_prs[num])
                continue

            # Live GitHub API lookup
            if access_token:
                pr_data = github_auth.fetch_pull_request(access_token, owner, repo, num)
                if pr_data:
                    files_data = github_auth.fetch_pull_request_files(access_token, owner, repo, num)
                    file_names = [f.get("filename") for f in files_data if "filename" in f]
                    
                    is_merged = pr_data.get("merged", False) or pr_data.get("merged_at") is not None
                    state_label = "merged" if is_merged else pr_data.get("state", "closed")

                    linked_prs.append({
                        "number": num,
                        "title": pr_data.get("title", f"PR #{num}"),
                        "state": state_label,
                        "merged": is_merged,
                        "body": pr_data.get("body", "") or "",
                        "changed_files": file_names,
                        "html_url": pr_data.get("html_url", f"https://github.com/{owner}/{repo}/pull/{num}")
                    })
            elif num in demo_prs:
                linked_prs.append(demo_prs[num])

        return linked_prs

    @classmethod
    def build_structured_context(
        cls,
        access_token: Optional[str],
        owner: str,
        repo: str,
        issue: Dict[str, Any],
        comments: List[Dict[str, Any]],
        fetched_files: Optional[Dict[str, str]] = None,
        simulated_prs: Optional[Dict[int, Dict[str, Any]]] = None
    ) -> Dict[str, Any]:
        """
        Assembles complete Context Engine V1 evidence set.
        """
        issue_number = issue.get("number")
        issue_title = issue.get("title", "")
        issue_body = issue.get("body", "")
        issue_author = issue.get("user", {}).get("login", "Maintainer")

        # 1. Combine all text to extract PR references
        combined_text = f"{issue_title}\n{issue_body}\n" + "\n".join([c.get("body", "") for c in comments])
        referenced_pr_numbers = cls.extract_pr_references(combined_text, current_issue_number=issue_number)

        # 2. Fetch Linked PR details
        linked_prs = cls.fetch_linked_prs(access_token, owner, repo, referenced_pr_numbers, simulated_prs=simulated_prs)

        # 3. Categorize Comments
        maintainer_directives, contributor_discussions = cls.categorize_comments(comments, issue_author=issue_author)

        # 4. Extract referenced files if not already provided
        if fetched_files is None:
            file_paths = github_auth.extract_referenced_files(combined_text)
            fetched_files = {}
            if access_token:
                for path in file_paths:
                    content = github_auth.fetch_repo_file_content(access_token, owner, repo, path)
                    if content:
                        fetched_files[path] = content[:3000]

        # 5. Format Structured Prompt Section for LLM
        formatted_evidence = cls.format_evidence_prompt(
            issue=issue,
            maintainer_directives=maintainer_directives,
            contributor_discussions=contributor_discussions,
            linked_prs=linked_prs,
            fetched_files=fetched_files or {}
        )

        return {
            "issue_number": issue_number,
            "issue_title": issue_title,
            "issue_body": issue_body,
            "issue_author": issue_author,
            "maintainer_directives": maintainer_directives,
            "contributor_discussions": contributor_discussions,
            "linked_prs": linked_prs,
            "fetched_files": fetched_files or {},
            "formatted_evidence": formatted_evidence
        }

    @staticmethod
    def format_evidence_prompt(
        issue: Dict[str, Any],
        maintainer_directives: List[Dict[str, Any]],
        contributor_discussions: List[Dict[str, Any]],
        linked_prs: List[Dict[str, Any]],
        fetched_files: Dict[str, str]
    ) -> str:
        """
        Formats structured evidence into a clean prompt block for LLM synthesis.
        """
        lines = []
        lines.append(f"=== CURRENT ISSUE #{issue.get('number')}: {issue.get('title')} ===")
        lines.append(f"Author: @{issue.get('user', {}).get('login', 'Maintainer')}")
        lines.append(f"Description:\n{issue.get('body', '*No body content*')}\n")

        if maintainer_directives:
            lines.append("=== MAINTAINER DIRECTIVES & KEY CONSTRAINTS ===")
            for d in maintainer_directives:
                lines.append(f"- @{d['author']}: {d['body']}")
            lines.append("")

        if contributor_discussions:
            lines.append("=== CONTRIBUTOR DISCUSSION THREAD ===")
            for c in contributor_discussions:
                lines.append(f"- @{c['author']}: {c['body']}")
            lines.append("")

        if linked_prs:
            lines.append("=== SURROUNDING HISTORICAL CONTEXT: LINKED PULL REQUESTS ===")
            for pr in linked_prs:
                status_str = "MERGED [SUCCESS]" if pr.get("merged") else f"{pr.get('state', 'CLOSED').upper()} [UNMERGED / PREVIOUS ATTEMPT]"
                lines.append(f"• PR #{pr['number']} ({status_str}): {pr['title']}")
                if pr.get("body"):
                    lines.append(f"  Context/Summary: {pr['body']}")
                if pr.get("changed_files"):
                    lines.append(f"  Files modified: {', '.join(pr['changed_files'])}")
            lines.append("")

        if fetched_files:
            lines.append("=== REPOSITORY FILES & DOCUMENTS ===")
            for fname, content in fetched_files.items():
                lines.append(f"--- File: {fname} ---")
                lines.append(content[:1500] + ("\n...[truncated]" if len(content) > 1500 else ""))
            lines.append("")

        return "\n".join(lines)
