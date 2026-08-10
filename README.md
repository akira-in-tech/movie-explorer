# Movie Explorer

[![CI](https://github.com/akira-in-tech/movie-explorer/actions/workflows/ci.yml/badge.svg)](https://github.com/akira-in-tech/movie-explorer/actions/workflows/ci.yml)

Movie Explorer is a full-stack movie discovery app built by Akira. Search the OMDb catalog, inspect movie details, create an account, publish reviews, bookmark titles, follow other users, and curate featured content from an admin account.

## Features

- Movie search and detail pages powered by OMDb
- JWT authentication stored in secure, HTTP-only cookies
- User profiles, bookmarks, following, and followers
- Ratings and reviews with server-side validation
- Role-protected featured-movie administration
- Responsive React interface with explicit loading and failure states
- Production health check, graceful shutdown, security headers, and CORS allowlisting

## Architecture

```text
Browser
   │
   ├── React/Vite static application
   └── /api/* → Express → MongoDB Atlas
                         └── OMDb API
```

In production, Express serves both the built React application and the API from one origin. This keeps cookie authentication reliable and avoids exposing server secrets to the browser.

| Layer | Technology |
| --- | --- |
| Frontend | React 18, React Router, Vite, Bootstrap |
| Backend | Node.js, Express, Mongoose |
| Database | MongoDB |
| Authentication | JWT, bcrypt, HTTP-only cookies |
| Security | Helmet, input validation, CORS allowlist, auth rate limiting |
| CI/CD | GitHub Actions, Render Blueprint |

## Local development

### Requirements

- Node.js 20–24
- MongoDB running locally or an Atlas connection string
- An [OMDb API key](https://www.omdbapi.com/apikey.aspx)

### Setup

```bash
git clone https://github.com/akira-in-tech/movie-explorer.git
cd movie-explorer
npm ci
npm --prefix client ci
cp server/.env.example server/.env
```

Fill in `server/.env`:

```env
NODE_ENV=development
PORT=5500
FRONTEND_URL=http://localhost:3001
JWT_SECRET=replace_with_a_long_random_value
MONGO_CONNECTION_STRING=mongodb://127.0.0.1:27017/movie-explorer
OMDB_API_KEY=your_omdb_api_key
```

Generate a strong JWT secret with:

```bash
openssl rand -hex 48
```

Run the frontend and backend together:

```bash
npm run dev
```

- Frontend: `http://localhost:3001`
- API: `http://localhost:5500/api`
- Health check: `http://localhost:5500/api/health`

## Validation

```bash
npm test
npm run build
npm audit --omit=dev
npm --prefix client audit --omit=dev
```

`npm run check` runs the local test and production-build checks together. The test suite covers environment validation, cookie and CORS security settings, model constraints, and authentication rate limiting.

## Free deployment on Render

The included [`render.yaml`](render.yaml) deploys the frontend and backend as one Render Web Service. A free Render instance sleeps after periods of inactivity, so the first request after sleep can take about a minute.

The Blueprint explicitly includes frontend development dependencies during the Render build because Vite is a build-time dependency even when `NODE_ENV=production`.

### 1. Create the free database

1. Create a MongoDB Atlas project and a Free (`M0`) cluster.
2. Create a dedicated database user with a unique password.
3. Create the Render service, then copy its outbound IP ranges from **Connect → Outbound** into the Atlas IP access list.
4. Copy the Atlas application connection string. Do not commit it to Git.

### 2. Deploy the application

1. In Render, choose **New → Blueprint**.
2. Connect `akira-in-tech/movie-explorer`.
3. Select the **Free** instance defined by `render.yaml`.
4. Enter these secret environment variables when prompted:

   - `MONGO_CONNECTION_STRING`
   - `OMDB_API_KEY`

`JWT_SECRET` is generated automatically by the Blueprint. Render supplies `PORT`; do not set it manually.

### 3. Verify the deployment

```bash
curl -fsS https://YOUR-SERVICE.onrender.com/api/health
```

Then verify registration, login, movie search, a deep-link refresh, and review creation in the browser. A healthy response looks like:

```json
{"status":"ok","database":"connected"}
```

To promote an existing account to administrator, run this command from a trusted machine with the production MongoDB URI in `server/.env`:

```bash
npm run admin:promote -- username
```

Never expose this operation as a public registration option.

## Environment variables

| Variable | Required | Purpose |
| --- | --- | --- |
| `MONGO_CONNECTION_STRING` | Yes | MongoDB connection URI |
| `JWT_SECRET` | Yes | JWT signing secret, minimum 32 characters |
| `OMDB_API_KEY` | Yes | Server-side OMDb API key |
| `NODE_ENV` | No | Set to `production` in deployment |
| `PORT` | No | HTTP port; defaults to `5500` locally |
| `FRONTEND_URL` | No | Comma-separated CORS origins for split deployments |

Only variables prefixed with `VITE_` are exposed to the browser. Never put database credentials, `JWT_SECRET`, or `OMDB_API_KEY` in client environment variables.

## Project structure

```text
movie-explorer/
├── .github/workflows/ci.yml
├── client/                 # React/Vite frontend
├── server/
│   ├── config/             # Environment, database, and auth configuration
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── tests/
│   ├── app.js              # Express application factory
│   └── server.js           # Database-aware process entrypoint
├── render.yaml             # Free Render Blueprint
└── package.json
```

## License

MIT License — see [LICENSE](LICENSE).
