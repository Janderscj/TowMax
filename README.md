## TowMax Towing Capacity Estimator (Prototype)

<p align="left">
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" />
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white" />
  <img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white" />
  <img src="https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white" />
  <img src="https://img.shields.io/badge/PostgreSQL-31648C?style=for-the-badge&logo=postgresql&logoColor=white" />
  <img src="https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white" />
  <img src="https://img.shields.io/badge/Render-46E3B7?style=for-the-badge&logo=render&logoColor=white" />
  <img src="https://img.shields.io/badge/CSS%20Modules-000000?style=for-the-badge&logo=css3&logoColor=white" />
  <img src="https://img.shields.io/badge/Lucide-000000?style=for-the-badge&logo=lucide&logoColor=white" />
</p>

TowMax is a full-stack towing-capacity prototype that decodes a vehicle VIN, interprets configuration details, and estimates towing capacity from a curated dataset.  
This prototype demonstrates the full user flow: VIN decoding, configuration refinement, saved vehicles, authentication, and a polished mobile‑first UI.

---

## Live Prototype

https://towmax.vercel.app/

---

## What This Repo Contains

- `frontend/`: React client built with Create React App
- `backend/`: Express API for VIN lookup, towing matching, garage, and user/profile endpoints
- `database/`: SQL schema for the project database

---

## Features

### VIN Decoding (Fully Functional)

- Decodes year, make, model, engine, drive, body style, and more
- Displays a full VIN breakdown

### Towing Capacity Logic (Prototype Dataset)

- Exact match when configuration is known
- Range match when multiple configurations exist
- Graceful fallback when no towing data is available
- Always shows VIN results regardless of towing match

### Garage System

- Save decoded vehicles
- Add and remove saved vehicles
- Premium logic scaffolded for future expansion

### Modern UI/UX

- App‑shell layout
- Centered header
- Clean result screens
- Prototype banner
- Mobile‑first design

---

## Current Prototype Scope

Included:

- Full VIN decoding
- Limited towing‑capacity dataset
- Complete user flow
- Working garage
- Polished UI

Not included yet:

- Full towing dataset coverage across all brands and years
- Production-grade premium billing flow
- Complete configuration coverage for every manufacturer
- Offline support

---

## Why I Built This

TowMax is a simple idea: towing capacity should be easier to access. Every truck owner has a VIN, but it's rare for someone to know their exact towing capacity, and the information is buried in PDFs, trim‑specific charts, and confusing manufacturer documentation.

I built TowMax to solve that problem in a modern, intuitive way. This prototype demonstrates the full user flow: VIN decoding, configuration interpretation, towing‑capacity logic, and a clean mobile‑first UI. Even with a limited dataset, the app shows the complete experience and lays the foundation for a fully automated towing‑guide ingestion pipeline.

As a software engineering student preparing for roles in healthcare data and data engineering, this project let me combine real‑world data modeling, API design, UI polish, and system architecture into a single application. TowMax is both a practical tool and a showcase of how I approach building scalable, user‑centered applications.

---

## Tech Stack

- Frontend: React, React Router, CSS Modules, Lucide
- Backend: Node.js, Express, Zod
- Data/Auth: Supabase
- Deployment: Vercel (frontend), Render or equivalent Node host (backend)

---

## TowMax Towing Capacity Estimator (Prototype)

<p align="left">
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" />
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white" />
  <img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white" />
  <img src="https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white" />
  <img src="https://img.shields.io/badge/PostgreSQL-31648C?style=for-the-badge&logo=postgresql&logoColor=white" />
  <img src="https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white" />
  <img src="https://img.shields.io/badge/Render-46E3B7?style=for-the-badge&logo=render&logoColor=white" />
  <img src="https://img.shields.io/badge/CSS%20Modules-000000?style=for-the-badge&logo=css3&logoColor=white" />
  <img src="https://img.shields.io/badge/Lucide-000000?style=for-the-badge&logo=lucide&logoColor=white" />
</p>

TowMax is a full-stack towing-capacity prototype that decodes a vehicle VIN, interprets configuration details, and estimates towing capacity from a curated dataset.  
This prototype demonstrates the full user flow: VIN decoding, configuration refinement, saved vehicles, authentication, and a polished mobile‑first UI.

---

## Live Prototype

https://towmax.vercel.app/

---

## What This Repo Contains

- `frontend/`: React client built with Create React App
- `backend/`: Express API for VIN lookup, towing matching, garage, and user/profile endpoints
- `database/`: SQL schema for the project database

---

## Features

### VIN Decoding (Fully Functional)

- Decodes year, make, model, engine, drive, body style, and more
- Displays a full VIN breakdown

### Towing Capacity Logic (Prototype Dataset)

- Exact match when configuration is known
- Range match when multiple configurations exist
- Graceful fallback when no towing data is available
- Always shows VIN results regardless of towing match

### Garage System

- Save decoded vehicles
- Add and remove saved vehicles
- Premium logic scaffolded for future expansion

### Modern UI/UX

- App‑shell layout
- Centered header
- Clean result screens
- Prototype banner
- Mobile‑first design

---

## Current Prototype Scope

Included:

- Full VIN decoding
- Limited towing‑capacity dataset
- Complete user flow
- Working garage
- Polished UI

Not included yet:

- Full towing dataset coverage across all brands and years
- Production-grade premium billing flow
- Complete configuration coverage for every manufacturer
- Offline support

---

## Why I Built This

TowMax is a simple idea: towing capacity should be easier to access. Every truck owner has a VIN, but it's rare for someone to know their exact towing capacity, and the information is buried in PDFs, trim‑specific charts, and confusing manufacturer documentation.

I built TowMax to solve that problem in a modern, intuitive way. This prototype demonstrates the full user flow: VIN decoding, configuration interpretation, towing‑capacity logic, and a clean mobile‑first UI. Even with a limited dataset, the app shows the complete experience and lays the foundation for a fully automated towing‑guide ingestion pipeline.

As a software engineering student preparing for roles in healthcare data and data engineering, this project let me combine real‑world data modeling, API design, UI polish, and system architecture into a single application. TowMax is both a practical tool and a showcase of how I approach building scalable, user‑centered applications.

---

## Tech Stack

- Frontend: React, React Router, CSS Modules, Lucide
- Backend: Node.js, Express, Zod
- Data/Auth: Supabase
- Deployment: Vercel (frontend), Render or equivalent Node host (backend)

---

## Local Development

### 1. Clone and install

```bash
git clone <repo-url>
cd TowingProject
```

### 2. Start the backend

```bash
cd backend
npm install
npm run dev
```

The backend runs on `http://localhost:5000` by default.

### 3. Start the frontend

Open a second terminal:

```bash
cd frontend
npm install
npm start
```

The frontend runs on `http://localhost:3000` by default.

### 4. Environment variables

See [backend/README.md](./backend/README.md) and [frontend/README.md](./frontend/README.md) for the expected environment variables.

## Deployment Notes

- `vercel.json` is configured to build the frontend from the `frontend/` directory.
- The backend should be deployed separately as a Node service with its own environment variables.
- Do not expose `SUPABASE_SERVICE_ROLE_KEY` or any other server-only secret in frontend code or frontend env files intended for public distribution.

## Roadmap

- Expand towing data coverage
- Add payload and trailer-weight helper tools
- Continue tightening validation and dataset quality checks
- Add production-grade subscription handling

## License

MIT
