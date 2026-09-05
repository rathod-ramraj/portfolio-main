# Rathod Ramraj - Portfolio

Cinematic personal portfolio. Vite + React + TypeScript SPA, deployed at [rathodram.vercel.app](https://rathodram.vercel.app) & [rathodram.vercel.app](https://rathodram.vercel.app).

## Preview

<img width="2936" height="1678" alt="image" src="./public/preview.png" />

### Stack

- Vite 6, React 18, TypeScript
- `wouter` for client-side routing (`/`, `/projects`)
- Lanyard API (Discord presence) + LeetCode stats API
- GitHub REST API via a server-side proxy (token never leaves the server)
  - Dev: Vite middleware proxy in `vite.config.ts`
  - Prod: Vercel serverless function at `api/gh.ts`

## Run

```bash
npm install
echo "GITHUB_TOKEN=ghp_xxx" > .env   # personal access token, repo:read scope
npm run dev
```

Then open <http://localhost:5173>.

## Scripts

- `npm run dev` - start Vite dev server with the GitHub proxy
- `npm run build` - production build to `dist/public`
- `npm run serve` - preview the built bundle
- `npm run typecheck` - `tsc --noEmit`

## Structure

```
src/
  components/Portfolio.tsx   # main page (hero, about, live, projects, oss, skills, contact)
  components/portfolio.css   # all cinematic styling
  pages/Projects.tsx         # /projects - full GitHub archive with hover README previews
  lib/github.ts              # GH types, README image extractor, language colors
  lib/skills.ts              # skill list + icon URLs (devicon / simpleicons)
  lib/seo.ts                 # per-route meta hook
api/gh.ts                    # Vercel serverless proxy for GitHub API
api/leetcode.ts              # Vercel serverless proxy for LeetCode stats
vite.config.ts               # also hosts the dev-time GitHub proxy
```

## Notes

- Domain SEO is configured against `https://rathodram.vercel.app`.

## License

Copyright © 2024–2026 Rathod Ramraj. All Rights Reserved.  
This repository and codebase are proprietary. Unauthorized copying, modification, or redistribution of any code, design, or assets is strictly prohibited. See [LICENSE](./LICENSE) for details.
