# AOSSIE Skills Ecosystem - Interactive Simulation

This folder contains a mock visual dashboard demonstrating how the closed-loop **AOSSIE Skills Ecosystem** operates organization-wide. It showcases the interactions between:
1. **Per-Repository Skills** (project local context in `.agent/` and `AGENTS.md`)
2. **Skills Core** (org-wide shared skills core in `skills/` repository)
3. **Skill Bot** (the Discord developer assistant)
4. **PR Dashboard** (the conflict-detection dashboard for maintainers)
5. **Skill Updater** (the knowledge evolution pipeline running BERTopic clustering)

This simulation is designed for showcase presentations, workshops, and marketing demos.

---

## How to Run

You can start the simulator locally in one of several ways:

### 1. One-Click Execution (Windows)
Simply double-click the **`run.bat`** file in this directory.
- It will automatically check for Node.js/npx or Python.
- It will start a local HTTP server serving the skills workspace on port 8000.
- It will open the simulation dashboard in your default browser.

### 2. Node.js / npm
If you prefer Node.js, run the following commands in this directory:
```bash
npm install
npm start
```
This will start `http-server` on port 8080 and automatically open the simulation page.

### 3. Python Local Server
Run Python's built-in HTTP server from the **parent directory** (`skills/` root):
```bash
python -m http.server 8000
```
Then navigate to:
[http://localhost:8000/InteractiveSimulation/index.html](http://localhost:8000/InteractiveSimulation/index.html)

### 4. Direct File Opening
You can double-click `index.html` to open it in your browser.
*(Note: FontAwesome and Google Fonts require internet access to load icons/typography. A local server is recommended for the best experience).*
