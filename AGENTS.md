# Quizora-Backend Agent Guidance

This repository is a Node.js/Express backend for Quizora built with TypeScript and ESM.

## What agents should know

- Entry point: `src/index.ts`
- Database connection: `src/db/index.ts` using Mongoose
- Environment configuration: `src/config/*.ts` with `dotenv`
- Route definitions: `src/routes/*.ts`
- Controllers and services are separated: `src/controllers/`, `src/services/`
- Request authorization and roles: `src/middleware/auth.middleware.ts`, `src/middleware/role-auth.middleware.ts`
- Error handling: `src/middleware/errors-handler.middleware.ts`
- Model definitions: `src/models/*.ts`
- Interfaces: `src/interfaces/*.ts`
- Tests are intended to live under `tests/`, but no active test scripts are defined yet.

## Runtime and commands

- This is an ESM project with `type": "module"` in `package.json`
- Use `npm install` before running or building
- Local development: `vc dev`
- Build: `vc build`
- Deploy: `vc deploy`
- `package.json` contains no `scripts` section, so prefer the commands documented in `README.md`

## API conventions

- Routes are mounted as plain Express routers, generally under paths like `/api/...`
- Authentication uses JWT tokens and cookies
- Protected endpoints apply `verifyToken` middleware first, then optional role authorization
- Keep route logic in routes/controllers/services rather than in `src/index.ts`

## Important project notes

- Do not modify `.vercel/project.json`; it is Vercel link metadata and not part of code behavior.
- This backend is meant to run with environment variables stored in `.env`.
- If adding new middleware or config, follow the existing pattern of `src/config/*` and `src/middleware/*`.
- Be careful with TypeScript import paths: use `./...` and `.js` extensions for runtime imports when targeting Node ESM.

## Useful files

- `README.md` - repo-level setup and deploy instructions
- `tsconfig.json` - TypeScript compiler options
- `.vercel/project.json` - Vercel project linkage metadata
