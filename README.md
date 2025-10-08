# GGBAssessment-2025

## Local Setup Instructions

### Prerequisites
- Node.js 18+ and npm
- MongoDB (local or a cloud instance like MongoDB Atlas)

### 1) Clone and install dependencies
```bash
git clone 
cd GGBAssessment-2025
cd backend && npm install
cd ../frontend && npm install
```

### 2) Environment variables
Create a `.env` file at the project root based on `.env.example`.

```bash
cp .env.example .env
```

Update values as needed. The backend reads variables from the process environment; running each app with `cross-env` or separate `.env` files is fine, but for simplicity this project expects values to be available to both processes via the root `.env`.

Required (backend):
- `MONGODB_URI` (e.g. mongodb://localhost:27017/feedback_board)
- `PORT` (default 5000)

Optional (backend):
- `NODE_ENV` (development|production)
- `FRONTEND_URL` (default http://localhost:3000)
- `JWT_SECRET`
- `RATE_LIMIT_WINDOW_MS` (default 900000)
- `RATE_LIMIT_MAX` (default 100)
- `LOG_LEVEL` (default info)
- `CORS_ORIGIN` (comma-separated origins; overrides defaults)

Frontend:
- `NEXT_PUBLIC_API_URL` (default http://localhost:5000)

### 3) Run the apps
In two terminals:

Backend:
```bash
cd backend
npm run dev
```

Frontend:
```bash
cd frontend
npm run dev
```

Open the app at http://localhost:3000

### 4) API Docs
- Backend Swagger UI: http://localhost:5000/api-docs
- Frontend embedded docs: http://localhost:3000/api-docs (uses `NEXT_PUBLIC_API_URL`/api-docs.json)

### Troubleshooting
- If Tailwind styles don’t load in the frontend, restart `npm run dev` after dependency changes and confirm `NEXT_PUBLIC_API_URL` is set.
- If API docs fail to load, ensure the backend is running on `PORT` and CORS allows your frontend origin.

# GGBAssessment-2025

## Local Setup Instructions

### Prerequisites
- Node.js 18+ and npm
- MongoDB (local or a cloud instance like MongoDB Atlas)

### 1) Clone and install dependencies
```bash
git clone https://github.com/farahbali/GGBAssessment-2025.git
cd GGBAssessment-2025
cd backend && npm install
cd ../frontend && npm install
```

### 2) Environment variables
Create a `.env` file at the project root (frontend root/backend root) based on `.env.example`.

```bash
cp .env.example .env
```

Update values as needed. The backend reads variables from the process environment; running each app with `cross-env` or separate `.env` files is fine, but for simplicity this project expects values to be available to both processes via the root `.env`.

Required (backend):
- `MONGODB_URI` (e.g. mongodb+srv://farahbali:FARAh.260@cluster0.bvk73ov.mongodb.net/feedback-board?retryWrites=true&w=majority&appName=Cluster0)
- `PORT` (default 5000)

Optional (backend):
- `NODE_ENV` (development|production)
- `FRONTEND_URL` (default http://localhost:3000)
- `JWT_SECRET`
- `RATE_LIMIT_WINDOW_MS` (default 900000)
- `RATE_LIMIT_MAX` (default 100)
- `LOG_LEVEL` (default info)
- `CORS_ORIGIN` (comma-separated origins; overrides defaults)

Frontend:
- `NEXT_PUBLIC_API_URL` (default http://localhost:5000)

### 3) Run the apps
In two terminals:

Backend:
```bash
cd backend
npm run dev
```

Frontend:
```bash
cd frontend
npm run dev
```

Open the app at http://localhost:3000

### 4) API Docs
- Backend Swagger UI: http://localhost:5000/api-docs
- Frontend embedded docs: http://localhost:3000/api-docs (uses `NEXT_PUBLIC_API_URL`/api-docs.json)

### Troubleshooting
- If Tailwind styles don’t load in the frontend, restart `npm run dev` after dependency changes and confirm `NEXT_PUBLIC_API_URL` is set.
- If API docs fail to load, ensure the backend is running on `PORT` and CORS allows your frontend origin.