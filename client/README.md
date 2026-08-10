# Movie Explorer frontend

This directory contains the React/Vite frontend for Movie Explorer. The repository-level [README](../README.md) contains complete setup, validation, and deployment instructions.

```bash
npm ci
npm start
```

The development server runs on `http://localhost:3001` and proxies `/api` requests to the Express server on port `5500`.

Create an optional `client/.env.local` only when the frontend and API intentionally use different origins:

```env
VITE_API_URL=https://api.example.com
```

Do not place private keys or database credentials in a `VITE_` variable because Vite embeds those values in the browser bundle.
