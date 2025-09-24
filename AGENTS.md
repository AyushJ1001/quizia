# Repository Guidelines

## Project Structure & Module Organization
- CLI entrypoint: `index.tsx` wires the command via `meow` and renders `App`.
- UI composition: `main.tsx` applies gradients and mounts shared Ink components.
- Component library: keep interactive pieces under `components/` (existing `quiz.tsx`).
- Content store: quiz data lives in `data/` JSON files that mirror the `ww1.json` shape.
- Root config: Bun, TypeScript, and project metadata stay alongside `package.json`, `bun.lock`, and `tsconfig.json`.

## Build, Test, and Development Commands
- `bun install` — install or update dependencies (use Bun exclusively per `CLAUDE.md`).
- `bun run index.tsx` — execute the CLI locally for smoke testing and demos.
- `bun run dev` — mirrors the direct command, useful for habitually running via package scripts.
- `bun test` — reserved for future automated suites; prefer Bun’s built-in runner over Jest or Vitest.

## Coding Style & Naming Conventions
- Language stack is TypeScript + JSX; keep Ink-rendering files as `.tsx`.
- Follow tab indentation and concise JSX blocks to match existing formatting.
- Export shared components with PascalCase (`Quiz`, `Questions`); store data files as lowercase kebab or thematic names (`ww1.json`).
- Leverage Bun APIs when file or network utilities are needed instead of Node-specific packages.

## Testing Guidelines
- Until automated coverage lands, run `bun run index.tsx` and walk through each prompt after every change.
- When logic grows, place Bun test modules under a future `__tests__/` directory and run them with `bun test`.
- Capture manual verification steps in PR descriptions so reviewers can replay the scenario.

## Commit & Pull Request Guidelines
- Use short, imperative commit messages (e.g., `Add artillery round selection prompt`).
- Reference issues where relevant and document both behavior updates and manual checks in PR summaries.
- Attach terminal recordings or screenshots for visual output changes, enabling reviewers to validate Ink layouts without running the CLI.

## Bun-Specific Practices
- Prefer `bun run <script>` in documentation and scripts; avoid npm/yarn equivalents.
- Remember Bun auto-loads `.env`, so extra tooling like `dotenv` is unnecessary.
- Reach for Bun-provided modules (`Bun.file`, `Bun.serve`, `bun:sqlite`) if the project expands beyond the current CLI scope.
