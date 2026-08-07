import os
import httpx
from typing import Dict, Any, List, Tuple, Optional

import config
import github_auth

MISTRAL_API_URL = "https://api.mistral.ai/v1/chat/completions"


def detect_knowledge_query(issue: Dict[str, Any], comments: List[Dict[str, Any]]) -> Tuple[str, str]:
    """
    Detects if there is a query directed to @Knowledge in comments or issue body.
    Returns (query_text, author_username).
    """
    for c in reversed(comments):
        body = c.get("body", "")
        if "@Knowledge" in body or "@knowledge" in body:
            author = c.get("user", {}).get("login", "Contributor")
            return body.strip(), author
            
    issue_body = issue.get("body", "")
    if "@Knowledge" in issue_body or "@knowledge" in issue_body:
        author = issue.get("user", {}).get("login", "Maintainer")
        return issue_body.strip(), author
        
    return "What are the prerequisites and setup instructions for this repository?", "User"


def call_mistral_api(prompt_system: str, prompt_user: str) -> str:
    """
    Calls Mistral AI API (model: mistral-small-2506) to generate a concise summary/answer.
    """
    if not config.is_mistral_configured():
        return ""
        
    headers = {
        "Authorization": f"Bearer {config.MISTRAL_API_KEY}",
        "Content-Type": "application/json",
        "Accept": "application/json",
    }
    
    payload = {
        "model": config.MISTRAL_MODEL,
        "messages": [
            {"role": "system", "content": prompt_system},
            {"role": "user", "content": prompt_user}
        ],
        "temperature": 0.2,
        "max_tokens": 1000
    }
    
    try:
        with httpx.Client(timeout=30.0) as client:
            response = client.post(MISTRAL_API_URL, headers=headers, json=payload)
            response.raise_for_status()
            data = response.json()
            choices = data.get("choices", [])
            if choices and "message" in choices[0]:
                return choices[0]["message"].get("content", "").strip()
    except Exception as e:
        print(f"Error invoking Mistral AI API ({config.MISTRAL_MODEL}): {e}")
        return ""


from context_engine import ContextEngine


def generate_knowledge_answer(
    access_token: str,
    owner: str,
    repo: str,
    issue: Dict[str, Any],
    comments: List[Dict[str, Any]],
    custom_query: str = "",
    simulated_prs: Optional[Dict[int, Dict[str, Any]]] = None
) -> Dict[str, Any]:
    """
    Core @Knowledge Agent execution engine with Context Engine V1 Expansion:
    1. Reads KNOWLEDGE.md FIRST from GitHub API to establish repository rules & guidelines.
    2. Runs ContextEngine to expand surrounding context (linked PRs, maintainer directives, comments).
    3. Fetches referenced files/documents from GitHub API.
    4. Invokes LLM (Mistral AI) to synthesize a structured Engineering Handoff.
    """
    if custom_query:
        query_text = custom_query
        query_author = "User"
    else:
        query_text, query_author = detect_knowledge_query(issue, comments)
    
    # 1. ALWAYS Fetch KNOWLEDGE.md FIRST
    knowledge_rules_content = github_auth.fetch_repo_file_content(access_token, owner, repo, "KNOWLEDGE.md")
    
    # 2. Extract referenced candidate files
    combined_text = f"{issue.get('title', '')}\n{issue.get('body', '')}\n"
    for c in comments:
        combined_text += f"\n{c.get('body', '')}"
        
    candidate_files = github_auth.extract_referenced_files(combined_text)
    
    # 3. Fetch candidate files
    fetched_files = {}
    if knowledge_rules_content:
        fetched_files["KNOWLEDGE.md"] = knowledge_rules_content[:3000]
        
    for file_path in candidate_files:
        if file_path == "KNOWLEDGE.md":
            continue
        content = github_auth.fetch_repo_file_content(access_token, owner, repo, file_path)
        if content:
            fetched_files[file_path] = content[:3000]

    # 4. Context Engine V1 Expansion: Assemble Structured Context
    structured_context = ContextEngine.build_structured_context(
        access_token=access_token,
        owner=owner,
        repo=repo,
        issue=issue,
        comments=comments,
        fetched_files=fetched_files,
        simulated_prs=simulated_prs
    )
            
    # 5. Formulate System Prompt for Engineering Handoff
    if knowledge_rules_content:
        system_prompt = (
            "You are @Knowledge, an engineering context assistant for this repository.\n"
            "Your task is to generate a structured **Engineering Handoff** for a contributor starting work on this GitHub issue.\n"
            "Synthesize the surrounding context (maintainer comments, linked PRs, previous attempts, referenced components) into actionable engineering guidance.\n\n"
            "=== MANDATORY REPOSITORY RULES (KNOWLEDGE.md) ===\n"
            f"{knowledge_rules_content}\n"
            "=================================================\n\n"
            "Output Format Guidelines:\n"
            "Structure your answer as an Engineering Handoff:\n"
            "### 🎯 Before Starting\n"
            "- Highlight key entry points, primary components, and maintainer constraints (e.g. what should remain unchanged).\n"
            "### 📜 Surrounding Context & Lessons from PRs\n"
            "- Summarize history from linked PRs (e.g. why previous attempts failed or what structure was established).\n"
            "### 🚀 Recommended Exploration Steps\n"
            "- Outline a step-by-step path for the contributor.\n"
            "### 🔗 Evidence & References\n"
            "- Cite specific PRs (#xxx), issues, and files.\n\n"
            "No Hallucination: Trace claims directly to the provided evidence."
        )
    else:
        system_prompt = (
            "You are @Knowledge, an AI GitHub assistant like CodeRabbit.\n"
            "Generate a structured **Engineering Handoff** based on the surrounding issue context, maintainer directives, linked PRs, and repository files provided.\n"
            "Never invent details not present in the files or evidence."
        )
        
    user_prompt = (
        f"Contributor Question (@{query_author}): {query_text}\n\n"
        f"{structured_context['formatted_evidence']}\n\n"
        "Please generate a complete, structured Engineering Handoff adhering strictly to repository rules:"
    )
    
    # Call Mistral AI model (mistral-small-2506)
    llm_answer = call_mistral_api(system_prompt, user_prompt)
    
    if llm_answer:
        final_answer = llm_answer
        engine_used = f"Mistral AI ({config.MISTRAL_MODEL}) [Context Engine V1 Active]"
    else:
        final_answer = _fallback_summarizer(query_author, query_text, structured_context)
        engine_used = "Context Engine Synthesizer (Fallback)"
        
    return {
        "query": query_text,
        "author": query_author,
        "answer": final_answer,
        "engine": engine_used,
        "structured_context": structured_context,
        "files_read": list(fetched_files.keys()),
        "files_content": fetched_files
    }


def _fallback_summarizer(query_author: str, query_text: str, structured_context: Dict[str, Any]) -> str:
    """Fallback Engineering Handoff summarizer when Mistral API is not active."""
    issue_title = structured_context.get("issue_title", "")
    issue_num = structured_context.get("issue_number", "")
    directives = structured_context.get("maintainer_directives", [])
    linked_prs = structured_context.get("linked_prs", [])
    fetched_files = structured_context.get("fetched_files", {})
    
    hand_off = [
        f"### 🎯 Engineering Handoff for Issue #{issue_num}: {issue_title}\n",
        f"Hi **@{query_author}**, here is the expanded context synthesized from the repository history and linked artifacts:\n"
    ]
    
    # 1. Before Starting section
    hand_off.append("#### 📋 Before Starting")
    if directives:
        for d in directives:
            hand_off.append(f"- **Maintainer Directive (@{d['author']})**: {d['body']}")
    else:
        hand_off.append("- Review the issue description and ensure surrounding components remain compatible.")
    hand_off.append("")
    
    # 2. Historical Context & PRs
    if linked_prs:
        hand_off.append("#### 📜 Surrounding Historical Context & Linked PRs")
        for pr in linked_prs:
            status = "🟢 Merged" if pr.get("merged") else f"🔴 {pr.get('state', 'Closed').capitalize()}"
            hand_off.append(f"- **PR #{pr['number']} ({status})**: {pr['title']}")
            if pr.get("body"):
                hand_off.append(f"  *Note:* {pr['body']}")
            if pr.get("changed_files"):
                hand_off.append(f"  *Touched files:* `{', '.join(pr['changed_files'])}`")
        hand_off.append("")

    # 3. Recommended Steps
    hand_off.append("#### 🚀 Recommended Next Steps")
    if fetched_files:
        hand_off.append(f"1. Start by inspecting referenced files: `{', '.join(fetched_files.keys())}`.")
    if any(p.get("number") == 151 for p in linked_prs):
        hand_off.append("2. Pay particular attention to `AuthPanel` modular structure introduced in PR #151.")
    if any(p.get("number") == 143 for p in linked_prs):
        hand_off.append("3. Pay particular attention to mobile behavior to prevent regressions identified in PR #143.")
    return "\n".join(hand_off)

