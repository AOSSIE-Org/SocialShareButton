# Code-to-Structure Mapping

> **Agent Instruction:** Before creating, moving, or deleting any file, consult this mapping. If a directory isn't listed here, do NOT create it without explicit maintainer approval.
>
> **Bold terms** are defined in [GLOSSARY.md](../../org-wide-skills/GLOSSARY.md); look them up there for the full meaning.

## Directory Map

| Directory       | Purpose                                         | Tech            |
| --------------- | ----------------------------------------------- | --------------- |
| `src/`          | Core library source code and wrapper components | JS / CSS / TS   |
| `public/`       | SVG assets and logos                            | Static SVGs     |
| `landing-page/` | Documentation site codebase                     | React / HTML    |
| `docs/`         | Static user documentation                       | Markdown        |
| `.github/`      | Issues/PR templates and workflows               | Markdown / YAML |

## Key Files

| File                                 | Purpose                                                   |
| ------------------------------------ | --------------------------------------------------------- |
| `src/social-share-button.js`         | Core vanilla JS logic for the component class             |
| `src/social-share-button.css`        | Stylesheet governing themes and modal UI                  |
| `src/social-share-analytics.js`      | Module tracking sharing callbacks and click telemetry     |
| `src/social-share-button-react.jsx`  | React wrapper implementation                              |
| `src/social-share-button-preact.jsx` | Preact wrapper implementation                             |
| `src/social-share-button-qwik.tsx`   | Qwik wrapper implementation                               |
| `index.html`                         | Vanilla HTML local demo and developer test harness        |
| `package.json`                       | Project scripts, dev dependencies, package configurations |
| `eslint.config.js`                   | Linting rules for the codebase                            |

## Rules

- Any new social platforms must be added directly to the core lists in `src/social-share-button.js` (with corresponding SVGs if needed).
- Never place user-specific CSS rules inside `src/social-share-button.css`. All formatting should be modular.
- Do NOT create a `dist/` or `build/` directory for the core library. Users fetch raw assets from the CDN or use npm modules directly.
