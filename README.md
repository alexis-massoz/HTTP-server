# Chirpy

A lightweight RESTful social media API built with TypeScript and Node.js. Chirpy supports user registration, authentication using JSON Web Tokens (JWT) and refresh tokens, chirp creation/deletion with profanity filtering, and membership upgrades via webhooks.

## Tech Stack

- **Language:** TypeScript
- **Runtime:** Node.js
- **Database:** PostgreSQL
- **Authentication:** JWT (Access & Refresh Tokens), Argon2/Bcrypt password hashing

## Features

- **Authentication & Authorization:** Secure user registration, password hashing, access/refresh token rotation, and authenticated routes.
- **Content Management:** Create, list, sort, and delete chirps with automatic profanity filtering.
- **Webhooks:** Webhook endpoint to upgrade users to Chirpy Red membership using API key authentication.
- **Metrics & Health:** Dedicated `/admin/metrics` and `/api/healthz` endpoints.

## Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [PostgreSQL](https://www.postgresql.org/)

## Environment Variables

Create a `.env` file in the root of the project with the following keys:

```env
PORT=8080
DB_URL="postgres://username:password@localhost:5432/chirpy"
JWT_SECRET="your_jwt_secret_key"
POLKA_KEY="your_polka_api_key"
```

## Getting Started

1. **Clone the repository:**
   ```bash
   git clone https://github.com/<your-username>/chirpy.git
   cd chirpy
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run database migrations:**
   ```bash
   npm run migrate:up
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```

The server should now be running at `http://localhost:8080`.

## API Endpoints

### Authentication & Users

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/users` | Register a new user | No |
| `POST` | `/api/login` | Log in and receive access/refresh tokens | No |
| `POST` | `/api/refresh` | Refresh an access token | Bearer (Refresh Token) |
| `POST` | `/api/revoke` | Revoke a refresh token | Bearer (Refresh Token) |
| `PUT` | `/api/users` | Update email or password | Bearer (Access Token) |

### Chirps

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/chirps` | Get chirps (supports `author_id` and `sort` query params) | No |
| `GET` | `/api/chirps/:chirpID` | Get a specific chirp by ID | No |
| `POST` | `/api/chirps` | Create a new chirp | Bearer (Access Token) |
| `DELETE` | `/api/chirps/:chirpID` | Delete a chirp (author only) | Bearer (Access Token) |

### Webhooks & Admin

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/polka/webhooks` | Handle membership upgrades | ApiKey |
| `GET` | `/api/healthz` | Health check endpoint | No |
| `GET` | `/admin/metrics` | Server hit count metrics | No |