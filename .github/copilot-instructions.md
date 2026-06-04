# GitHub Copilot Instructions for Quizora-Backend

## Project overview

This repository is a Node.js/Express backend for Quizora written in TypeScript and using Node ESM.

## Key files and directories

- `src/index.ts` — application entry point and route mounting
- `src/db/index.ts` — MongoDB connection via Mongoose
- `src/config/*.ts` — environment and server configuration with `dotenv`
- `src/routes/*.ts` — API route definitions
- `src/controllers/` and `src/services/` — business logic and data handling
- `src/middleware/` — request authentication, authorization, and error handling
- `src/models/*.ts` — Mongoose schemas and models
- `src/interfaces/*.ts` — TypeScript interfaces
- `tests/` — intended test folder, but no active scripts exist yet

## Runtime and commands

- Project is ESM: `type": "module"` in `package.json`
- Install dependencies: `npm install`
- Local development: `vc dev`
- Build: `vc build`
- Deploy: `vc deploy`
- There are no defined `npm` scripts, so prefer the commands in `README.md`

## API and architecture conventions

- Routes use `/api/...` prefix patterns
- Authentication is JWT-based and uses cookies
- Protected routes apply `verifyToken` middleware first, then optional `roleAuth`
- Keep routing in `src/routes/*` and move logic into controllers/services
- Avoid embedding route logic in `src/index.ts`

## Additional notes

- Do not modify `.vercel/project.json`; it is Vercel metadata only
- The project depends on environment variables stored in `.env`
- Use runtime import paths with `./...` and `.js` extension when targeting Node ESM
- Refer to `README.md` for setup and deploy instructions
