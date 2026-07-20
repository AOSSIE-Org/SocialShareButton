import os
import sys
import subprocess
import logging
from pathlib import Path

script_dir = Path(__file__).resolve().parent
repo_root = script_dir.parent

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger("subtree-sync")

SUBTREES = {
    "org-skills": {
        "url": "https://github.com/AOSSIE-Org/Skills.git",
        "prefix": "skills/shared",
        "branch": "main",
    }
}


def run_command(cmd: list[str], cwd: Path) -> tuple[int, str]:
    """Run a shell command and return returncode and output."""
    logger.info(f"Running: {' '.join(cmd)}")
    result = subprocess.run(cmd, cwd=str(cwd), capture_output=True, text=True)
    if result.returncode != 0:
        logger.error(f"Command failed with code {result.returncode}:\n{result.stderr}")
    else:
        logger.info(result.stdout.strip())
    return result.returncode, result.stdout + result.stderr


def get_head_commit() -> str:
    """Get the current HEAD commit hash."""
    code, out = run_command(["git", "rev-parse", "HEAD"], repo_root)
    return out.strip() if code == 0 else ""


def has_context_changes(old_commit: str, new_commit: str, prefix: str) -> bool:
    """Check if AGENTS.md or .agent/ in prefix has non-zero line changes between commits."""
    cmd = [
        "git",
        "diff",
        "--numstat",
        old_commit,
        new_commit,
        "--",
        f"{prefix}/AGENTS.md",
        f"{prefix}/.agent",
    ]
    code, out = run_command(cmd, repo_root)
    if code != 0 or not out.strip():
        return False

    total_changes = 0
    for line in out.strip().splitlines():
        parts = line.split()
        if len(parts) >= 2:
            try:
                added = int(parts[0]) if parts[0] != "-" else 0
                deleted = int(parts[1]) if parts[1] != "-" else 0
                total_changes += (added + deleted)
            except ValueError:
                pass
    return total_changes > 0


def sync_subtrees():
    os.chdir(repo_root)

    for name, meta in SUBTREES.items():
        url = meta["url"]
        prefix = meta["prefix"]
        branch = meta.get("branch", "main")
        prefix_path = repo_root / prefix
        is_new_subtree = not (prefix_path.exists() and any(prefix_path.iterdir()))

        if not is_new_subtree:
            logger.info(f"Subtree '{prefix}' exists. Pulling updates from {url}...")
            cmd = [
                "git",
                "subtree",
                "pull",
                f"--prefix={prefix}",
                url,
                branch,
                "--squash",
                "-m",
                f"sync: update {name} subtree in {prefix}",
            ]
        else:
            logger.info(f"Subtree '{prefix}' does not exist. Adding subtree from {url}...")
            cmd = [
                "git",
                "subtree",
                "add",
                f"--prefix={prefix}",
                url,
                branch,
                "--squash",
                "-m",
                f"sync: add {name} subtree in {prefix}",
            ]

        old_head = get_head_commit()
        code, out = run_command(cmd, repo_root)
        if code == 0:
            new_head = get_head_commit()
            if old_head and new_head and old_head != new_head:
                if is_new_subtree:
                    logger.info(f"Subtree '{prefix}' newly added. Keeping initial commit.")
                else:
                    if not has_context_changes(old_head, new_head, prefix):
                        logger.info(
                            f"No non-zero line changes in AGENTS.md or .agent/ for {name}. Resetting commit."
                        )
                        run_command(["git", "reset", "--hard", old_head], repo_root)
                    else:
                        logger.info(
                            f"Non-zero line changes confirmed in AGENTS.md or .agent/ for {name}. Keeping commit."
                        )
        else:
            logger.error(f"Failed to sync subtree for {name}")


if __name__ == "__main__":
    sync_subtrees()
