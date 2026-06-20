# Movie Explorer

A full-stack movie discovery web app with user authentication. Browse and search for movies, manage a personal watchlist, and view detailed information powered by an external movie API.

## Features

- Movie search and detail pages
- User registration and login (JWT-based auth)
- Admin panel for user management
- Profile page with personalized content
- Responsive UI built with React

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React, JavaScript, CSS |
| Backend | Node.js, Express |
| Database | MongoDB (Mongoose) |
| Auth | JWT, bcrypt |

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB running locally or a connection URI

### Installation

```bash
# Install root and server dependencies
npm install

# Install client dependencies
cd client && npm install
```

Create `server/.env` (see `.env.example` pattern):

```env
NODE_ENV=development
PORT=5500
MONGO_CONNECTION_STRING=mongodb://127.0.0.1:27017/movie-explorer
SESSION_SECRET=your_secret_here
NETLIFY_URL=http://localhost:3001
```

### Running in Development

```bash
# Run both server and client concurrently
npm run dev
```

- Backend: `http://localhost:5500`
- Frontend: `http://localhost:3001`

## Project Structure

```
movie-explorer/
├── client/         # React frontend
│   └── src/
│       └── components/  # Page components (Home, Login, Search, etc.)
└── server/         # Express backend
    └── server.js   # API routes and server entry point
```

## License

MIT License — see [LICENSE](LICENSE)
