# AKSANI

Platform amal, ibadah, pengembangan diri, dan kolaborasi umat.

## Tahap I — MVP

- Frontend: React + TypeScript + Vite
- Styling: CSS responsive
- Backend (tahap berikutnya): Node.js + Fastify
- Database (tahap berikutnya): PostgreSQL
- Authentication (tahap berikutnya): Better Auth
- Deployment: Vercel

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run typecheck
npm run build
```

## Architecture principles

- PostgreSQL standard, portable across providers.
- Authentication owned by the application; no Supabase Auth dependency.
- Keep provider-specific integrations behind application interfaces.
- Never commit secrets or environment files.
