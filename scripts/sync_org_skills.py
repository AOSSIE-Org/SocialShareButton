import os
import shutil
import subprocess
import logging
import urllib.request
import zipfile
import tempfile
from pathlib import Path

script_dir = Path(__file__).resolve().parent
repo_root = script_dir.parent

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger("org-skills-sync")

# Global org-wide skills to keep in skills/shared
ORG_SKILLS = [
    "GIT-DIS-AIPolicy",
    "contributor-onboarding",
    "project-template",
    "mcp-integration",
    "GLOSSARY.md",
]

SKILLS_REPO_ZIP = "https://github.com/AOSSIE-Org/Skills/archive/refs/heads/main.zip"
TARGET_DIR = repo_root / "skills" / "shared"


def sync_org_skills():
    logger.info(f"Downloading org skills archive from {SKILLS_REPO_ZIP}...")

    with tempfile.TemporaryDirectory() as tmp_dir:
        tmp_path = Path(tmp_dir)
        zip_path = tmp_path / "skills.zip"
        urllib.request.urlretrieve(SKILLS_REPO_ZIP, zip_path)

        with zipfile.ZipFile(zip_path, "r") as zip_ref:
            zip_ref.extractall(tmp_path)

        extracted_dirs = [d for d in tmp_path.iterdir() if d.is_dir()]
        if not extracted_dirs:
            logger.error("Failed to extract skills archive.")
            return
        skills_root = extracted_dirs[0]

        if TARGET_DIR.exists():
            shutil.rmtree(TARGET_DIR)
        TARGET_DIR.mkdir(parents=True, exist_ok=True)

        copied_count = 0
        for item in ORG_SKILLS:
            src = skills_root / item
            dst = TARGET_DIR / item
            if src.exists():
                if src.is_dir():
                    shutil.copytree(src, dst)
                else:
                    shutil.copy2(src, dst)
                logger.info(f"Copied {item} -> skills/shared/{item}")
                copied_count += 1
            else:
                logger.warning(f"Item '{item}' not found in Skills repository.")

        logger.info(f"Successfully synced {copied_count} org-wide skills to {TARGET_DIR}")


if __name__ == "__main__":
    sync_org_skills()
