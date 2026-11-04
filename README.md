# Stamp Card — Owner App

The staff-facing web app for Stamp Card, a digital loyalty card for small shops. The owner logs in with a PIN, sees their customers and scans a customer's pass to add a stamp.

Built with React and Vite. It talks to the [stampcard-backend](https://github.com/Kontogiannis-dev/stampcard-backend) API. Customers use a separate app: [stampcard-frontend](https://github.com/Kontogiannis-dev/stampcard-frontend).

## How it works

1. **Login:** the owner enters the shop PIN. The backend checks it against a bcrypt hash and returns a signed token, which the app keeps in session storage and sends with every request.
2. **Dashboard:** lists customers with their stamp counts. Only the first four are shown, and a **View more (n)** button reveals the rest.
3. **Scanner:** the **Scan Customer QR** button opens the camera. Scanning a customer's pass adds a stamp, or redeems the reward if the card is already full.

## Quick start

You need Node.js and the backend running. The backend README explains how to start it with one command (`docker compose up`).

```bash
git clone https://github.com/Kontogiannis-dev/stampcard-owner.git
cd stampcard-owner
npm install
npm run dev
```

Open http://localhost:5173 and log in with the `OWNER_PIN` from the backend's `.env`.

Without any configuration, the app expects the backend at `http://localhost:8000` and serves over plain HTTP.

## Configuration

Copy `.env.example` to `.env` to change the defaults. Every variable is optional.

| Variable | Purpose |
|---|---|
| `VITE_API_URL` | Backend base URL. Defaults to `http://localhost:8000` |
| `CERT_PATH`, `KEY_PATH` | Paths to a local HTTPS certificate and key (for example from mkcert). When unset, the dev server uses plain HTTP |

## Notes

- **Camera access:** browsers only allow the camera on `https://` or `localhost`. Testing on `localhost` works as is. To scan from a phone on your network, serve the app over HTTPS with the certificate variables above.
- A refused scan (for example a double scan within 10 seconds) comes back from the backend as HTTP 429.

## Project structure

```
src/main.jsx       -> routes
src/Login.jsx      -> PIN login
src/Dashboard.jsx  -> customer list
src/Scanner.jsx    -> QR scanner
src/config.js      -> API base URL
```

## Known limitations

- The app is wired to a single shop (id 1).
- Login is one shared PIN per shop, not individual staff accounts.