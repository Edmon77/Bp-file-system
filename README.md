# bp-file-system

A monorepo containing a NestJS API and Next.js web application.

## Project Structure

```
bp-file-system/
├── apps/
│   ├── api/          # NestJS backend (Port 3000)
│   └── web/          # Next.js frontend (Port 3001)
└── packages/         # Shared packages
    ├── database/     # Database utilities
    ├── ui/           # UI components
    ├── eslint-config/
    ├── tailwind-config/
    └── typescript-config/
```

## Quick Start

### 1. Install dependencies
```bash
npm install
```

### 2. Start development servers
```bash
npm run dev
```
This starts both the API and web app in development mode.

- API: http://localhost:3000
- Web: http://localhost:3001

### 3. Database setup (if needed)
```bash
npm run db:generate   # Generate Prisma client
npm run db:push      # Push schema to database
```

## Other Commands

| Command | Description |
|---------|-------------|
| `npm run build` | Build all apps |
| `npm run test` | Run tests for all apps |
| `npm run test:e2e` | Run e2e tests |
| `npm run lint` | Lint all packages |
| `npm run format` | Format code with Prettier |

## Environment Variables

Create `.env` files in `apps/api/` with your database URL:
```
DATABASE_URL=mongodb://...
PORT=3000
```