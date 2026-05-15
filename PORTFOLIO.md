# Portfolio Notes

This repo is a rebranded MaxQ portfolio build based on the upstream
`bearlike/Assistant` project. The resume-safe way to describe it is as a fork
or customized implementation, with the offline demo mode as the feature you
added.

## Demo

```bash
cd apps/mewbo_console
npm install
npm run dev:demo
```

The demo mode runs entirely in the browser with seeded sessions, events, tools,
projects, plugins, notifications, settings, and git diff data.

## Resume Bullet

- Built MaxQ, a multi-agent AI orchestration console using React, TypeScript, Vite, and TanStack Query; engineered a browser-only offline demo mode for portfolio walkthroughs; integrated Groq's LLaMA 3.3 70B API for real-time inference; deployed live on Vercel.

## Tech stack

- React
- TypeScript
- Vite
- TanStack Query
- Groq API
- LiteLLM
- Flask
- Docker

## Interview Talking Points

- Why a mock API mode matters: it removes API keys, Docker, MongoDB, and Python
  setup from the demo path while preserving the console's real UI flows.
- How the integration works: `VITE_API_MODE=mock` selects `mockClient.ts`
  through the existing API facade, so React components keep using the same
  function contracts as live mode.
- What you would do next: add Playwright smoke tests for the demo route, then
  split heavy widget bundles with dynamic imports.
