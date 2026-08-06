# Next.js & React Architecture Standards

## Next.js Rules

- **App Router:** Use the App Router (`app/` directory) for Next.js 13+ projects, unless explicitly told the project uses Pages router in `.agent/core/architecture.md`.
- **RSC Default:** Default to Server Components. Only use `"use client"` when interactivity (state, effects, event listeners) is strictly required. Push `"use client"` down the component tree as far as possible.
- **Data Fetching:** Fetch data in Server Components, not Client Components, unless it's user-specific reactive data.

## React Component Rules

- **Modularity:** Keep components small and reusable in `components/`. Use index exports.
- **Pure Functions:** Components should be pure functions of their props where possible.
- **State Management:** Prefer React Context API or standard hooks over global state managers (like Redux or Zustand) unless the project specifically dictates otherwise.

## Styling

- **Tailwind CSS:** Use Tailwind CSS utility classes unless the project defines a different styling solution. Avoid large custom CSS files.
- **Naming Conventions:** Use lowercase kebab-case for custom class names if unavoidable.
