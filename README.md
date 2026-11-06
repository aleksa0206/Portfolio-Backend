# Portfolio Backend

REST API behind my personal site, [aleksao.me](https://aleksao.me). It serves the public content (about, education, licenses, projects, CV), takes messages from the contact form, and lets a single admin edit everything.

Frontend: [Portfolio-Frontend](https://github.com/aleksa0206/Portfolio-Frontend) (Angular).

API documentation (Swagger UI): [aleksao.me/api-docs](https://aleksao.me/api-docs/)

## Tech stack

Node.js 22, TypeScript, Express 5, Prisma 5 on MySQL 8, Zod, JWT (`jsonwebtoken`) with `bcryptjs`, Helmet, `express-rate-limit`, Pino, Swagger (`swagger-jsdoc` + `swagger-ui-express`), Vitest, Docker, GitHub Actions.

## Architecture

```
route → controller → service → repository → Prisma → MySQL
```

- **Routes** declare the endpoints, apply middleware (auth, Zod validation, rate limits) and carry the Swagger annotations.
- **Controllers** translate between HTTP and services; they contain no business logic.
- **Services** hold the logic and receive their repositories through the constructor.
- **Repositories** are the only place that uses Prisma.
- A singleton container (`src/container`) creates the repositories and services and wires them together.

Errors extend `AppError`, which carries an HTTP status and an `ErrorCode`. The user-facing text for each code lives in one map (`src/constants/errorMessages.ts`), and a single error-handling middleware turns any thrown error into the same JSON shape.

The CV endpoint is the exception to the layering: it stores one PDF in one table row, so the route talks to Prisma directly.

## Endpoints

All routes are under `/api`. Write endpoints and the message inbox require the admin's JWT.

| Area | Public | Admin only |
| --- | --- | --- |
| Auth | `POST /auth/login` (rate limited) | |
| About | `GET /about` | `PUT /about` (create or update the single record) |
| Education | `GET /education` | `POST /education`, `PUT`/`DELETE /education/:id` |
| Licenses | `GET /licenses` | `POST /licenses`, `PUT`/`DELETE /licenses/:id` |
| Projects | `GET /projects` | `POST /projects`, `PUT`/`DELETE /projects/:id` |
| Contact | `POST /contact` (rate limited) | `GET /contact`, `PUT /contact/:id/read`, `DELETE /contact/:id` |
| CV | `GET /cv` (PDF download), `GET /cv/info` | `PUT /cv` (base64 PDF, max 5 MB), `DELETE /cv` |

The about record also stores the contact links, the skills list and the editable texts the frontend shows (headings, popup settings).

## Security

- Helmet for HTTP security headers, CORS limited to `CLIENT_URL`
- Rate limits on login and on the contact form
- Zod validation on every write endpoint, and small JSON body limits (8 MB only for the CV upload)
- Admin password hashed with bcrypt; JWT checked by a route guard

## Running locally

Requires Node.js 22+ and MySQL 8.

```bash
npm install
cp .env-example .env       # then fill in the values below
npx prisma migrate dev
npm run seed               # creates the admin account from ADMIN_EMAIL / ADMIN_PASSWORD
npm run dev                # http://localhost:4000, Swagger UI at /api-docs
```

| Variable | Notes |
| --- | --- |
| `DATABASE_URL` | MySQL connection string, e.g. `mysql://user:pass@localhost:3306/portfolio` |
| `PORT` | Default `4000` |
| `JWT_SECRET`, `JWT_EXPIRES_IN` | Signing key and token lifetime, e.g. `7d` |
| `CLIENT_URL` | CORS origin. Default `http://localhost:4200` |
| `ADMIN_EMAIL`, `ADMIN_PASSWORD` | Used only by `npm run seed` |

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Dev server with reload |
| `npm run build` | Compile to `dist/` |
| `npm start` | Run the compiled build |
| `npm test` | Vitest unit tests for the services (`src/services/__tests__`) |
| `npm run test:coverage` | Tests with a coverage report |
| `npm run seed` | Create the admin account |

CI (GitHub Actions) runs the tests and the build on pushes and pull requests to `main`.

## Docker

```bash
docker build -t portfolio-backend .
```

A multi-stage build on `node:22-alpine`. In production the API runs in Docker on my home server together with MySQL and the frontend (nginx proxies `/api` to it), reachable only through a Cloudflare Tunnel.
