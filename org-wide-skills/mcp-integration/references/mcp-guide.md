# AOSSIE MCP Integration & Configuration Guide

To enable developer agents to automatically perform tasks (like browsing/testing UI and raising PRs), you must configure the following Model Context Protocol (MCP) servers on your client machine.

## 1. GitHub MCP Server
Allows the agent to search code, check issues, and manage pull requests.

### Configuration
Add this to your agent platform's configuration file (e.g., `claude_desktop_config.json` or `config.json` inside your IDE's settings):

```json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "your_github_token_here"
      }
    }
  }
}
```

### Key Tasks the Agent Can Perform:
1. **Auto-Assigned Check:** Verify if the user is assigned to the working issue.
2. **Retrieve Requirements:** Retrieve issues/PRs from `github.com/AOSSIE-Org/` and parse comments for updates.
3. **Auto-PR Generation:** Draft and submit pull requests once local tests pass.

---

## 2. Puppeteer MCP Server
Provides headless browser automation tools so the agent can load, click, and inspect the UI layout of AOSSIE frontend apps like `SocialShareButton`.

### Configuration
```json
{
  "mcpServers": {
    "puppeteer": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-puppeteer"]
    }
  }
}
```

### Key Tasks the Agent Can Perform:
1. **Interactive Testing:** Spin up `npm run dev`, navigate to `http://localhost:5173`, and visually audit the DOM.
2. **Screenshot Verification:** Capture screenshots of sharing modals to ensure alignment and styling look premium.
3. **Log Extraction:** Capture console errors/warnings during client integration.

---

## 3. Component Playgrounds / Storybook Integration

For frontend libraries, having a lightweight Storybook or preview app is incredibly powerful when paired with a Browser/Puppeteer MCP. It allows the agent to visually audit components for accessibility, layout breaks, and responsiveness.

### Key Tasks the Agent Can Perform:

1. **Accessibility Audits:** Analyze the accessibility tree, check color contrast ratios, and verify keyboard navigation.
1. **Accessibility Audits:** Analyze the accessibility tree, check color contrast ratios, and verify keyboard navigation.
2. **Responsive Design Verification:** Programmatically resize the viewport across mobile, tablet, and desktop widths to check for responsive layout breaks.
3. **Variant Visual Verification:** Interact with different component states/props (e.g., hover, disabled, active, light/dark themes) and capture visual screenshots of each state.

