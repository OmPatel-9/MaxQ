# Vercel Deployment

These steps deploy the MaxQ console as a static, browser-only demo using the
seeded mock API mode.

## 1. Push the repository to GitHub

Commit your changes and push the `Assistant` repository to GitHub.

## 2. Import the project in Vercel

1. In Vercel, choose **Add New Project**.
2. Import the GitHub repository.
3. Set **Root Directory** to:

```text
apps/mewbo_console
```

4. Keep the framework preset as **Vite** if Vercel detects it.

## 3. Build settings

The included `vercel.json` sets these values:

```text
Build Command: npm run build:demo
Output Directory: dist
```

The rewrite rule sends all routes to `index.html`, so deep links like
`/settings`, `/plugins`, and `/s/demo-portfolio-001` work with SPA routing.

## 4. Environment variables

For the portfolio demo, configure:

```text
VITE_API_MODE=mock
```

The demo build also loads `.env.demo`, but setting the variable in Vercel makes
the deployment intent explicit.

Do not expose server-side API keys in the Vercel frontend project. If you later
deploy a live backend, configure secrets such as `GROQ_API_KEY` on the backend
service only, then point the console at that API with:

```text
VITE_API_MODE=live
VITE_API_BASE_URL=https://your-api.example.com
VITE_API_KEY=your-public-console-token-if-required
```

## 5. Deploy

Click **Deploy**. After the build completes, open the generated Vercel URL and
confirm the home screen shows the **Offline demo mode** badge.
