# CLAUDE.md

Guidance for Claude Code when working in this repository.

## Testing / running the app

Do not start the dev server, install browser drivers (e.g. Playwright/Chromium), or otherwise run/test the application yourself. The user tests changes manually. Verification should stop at static checks: `npm run lint`, `npm run build` / `tsc --noEmit`.
