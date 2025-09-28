# Repository Guidelines

## Project Structure & Module Organization
- `app/` hosts the Next.js App Router with locale-aware route segments, shared layouts, and API handlers. Keep new pages server-first and move client components into `components/`.
- `components/` contains reusable UI split into `layout/` and `ui/`; file names stay lowercase (e.g., `header.tsx`) while exported components use PascalCase.
- `lib/` stores domain helpers, constants, and internationalization utilities; `utils/` wraps Supabase clients and other platform adapters.
- `content/` holds MDX posts and static copy, `messages/` manages locale dictionaries, and `db/` contains Drizzle schema, migrations, and seeds. Place static assets in `public/` and keep configuration files at the project root.

## Build, Test, and Development Commands
- `pnpm install` synchronizes dependencies (Node.js ≥ 20).
- `pnpm dev` runs the Next.js 15 development server with fast refresh.
- `pnpm build` compiles the production bundle; run before deployments.
- `pnpm lint` checks code with the flat ESLint config and must pass cleanly.
- `pnpm typecheck` enforces strict TypeScript via `tsc --noEmit`.
- `pnpm db:generate` / `pnpm db:push` refresh Drizzle artifacts; `pnpm db:seed` populates local data; `pnpm db:studio` opens the schema explorer UI.

## Coding Style & Naming Conventions
Write modern TypeScript with two-space indentation, trailing commas, and no implicit `any`. Prettier (project defaults) handles formatting—run it before committing. Obey ESLint rules (`eslint.config.js`), especially around unused variables and `any` usage. Name React components and hooks with PascalCase exports while keeping file names lowercase-hyphenated. Co-locate feature-specific helpers in their domain directories, import from `@/` aliases, and rely on Tailwind tokens defined in `app/globals.css` and `tailwind.config.ts` for styling.

## Theme Palette
- **Light (warm, reading-first)**: background `hsl(32 60% 96%)`, foreground/text `hsl(26 37% 18%)`, card & popover surfaces `hsl(32 56% 98%)`, borders & inputs `hsl(20 28% 78%)`, primary button `hsl(23 86% 48%)` on `hsl(32 100% 98%)`, secondary surface `hsl(18 32% 88%)` on `hsl(26 37% 22%)`, muted surface `hsl(24 28% 88%)` on `hsl(26 25% 34%)`, accent surface `hsl(35 65% 85%)` on `hsl(26 37% 22%)`, destructive `hsl(10 80% 46%)` on `hsl(32 100% 98%)`, focus ring `hsl(23 86% 48%)`.
- **Dark (balanced contrast)**: background `hsl(24 24% 10%)`, foreground/text `hsl(30 40% 92%)`, card & popover surfaces `hsl(24 24% 14%)`, borders & inputs `hsl(24 16% 32%)`, primary button `hsl(25 85% 62%)` on `hsl(26 37% 14%)`, secondary surface `hsl(24 16% 22%)` on `hsl(30 42% 88%)`, muted surface `hsl(24 18% 28%)` on `hsl(30 24% 70%)`, accent surface `hsl(32 32% 30%)` on `hsl(34 58% 88%)`, destructive `hsl(8 82% 56%)` on `hsl(26 37% 12%)`, focus ring `hsl(25 85% 62%)`.

## Testing Guidelines
Automated tests are not yet configured, so treat `pnpm lint`, `pnpm typecheck`, and a manual walkthrough of affected routes as the baseline check. When introducing complex logic, document reproduction steps in the PR and, if you add a test runner, place specs under `__tests__/` with a matching package script so the team can run them consistently. Keep seed data updated whenever you touch database flows to preserve deterministic reviews.

## Commit & Pull Request Guidelines
Git history favors descriptive sentence-style subjects (e.g., “Update README.md to provide a comprehensive overview…”); follow that tone while keeping the subject under ~75 characters. Group related changes into focused commits—separate schema updates, UI tweaks, and content edits. Pull requests should include purpose, linked issues, screenshots or GIFs for UI changes, database migration notes, and the local commands executed (`pnpm lint`, `pnpm typecheck`, etc.).

## Security & Configuration Tips
Store secrets in `.env.local` and keep Supabase keys out of version control. After editing Drizzle schemas, regenerate and push migrations in the same branch. Validate that any new `next.config.ts` experimental flags remain compatible with the current Vercel target before enabling them.
