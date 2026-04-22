*** TowMax Towing Capacity Estimator (Prototype) ***

## 🛠️ Tech Stack

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-3C873A?style=for-the-badge&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)
![Render](https://img.shields.io/badge/Render-46E3B7?style=for-the-badge&logo=render&logoColor=white)
![CSS Modules](https://img.shields.io/badge/CSS%20Modules-000000?style=for-the-badge&logo=css3&logoColor=white)
![Lucide Icons](https://img.shields.io/badge/Lucide-000000?style=for-the-badge&logo=lucide&logoColor=white)


TowMax is a vehicle‑lookup tool that decodes VINs, identifies key configuration details, and provides towing‑capacity estimates. 
This prototype demonstrates the full user flow, VIN decoding accuracy, and UI polish while using a limited towing dataset.

** Demo/Prototype **

https://towmax.vercel.app/

** Features **

VIN Decoding (Fully Functional)
Decodes year, make, model, engine, drive, body style, and more

Displays a full VIN breakdown

** Towing Capacity Logic (Prototype Dataset) **

Exact match when configuration is known

Range match when multiple configurations exist

Graceful fallback when no towing data is available

Always shows VIN results regardless of towing match

** Garage System **

Save decoded vehicles

Add and remove saved vehicles

Premium logic scaffolded for future expansion

** Modern UI/UX **

App‑shell layout

Centered header

Clean result screens

Prototype banner

Mobile‑first design

** Prototype Scope **

This version of TowMax is a functional prototype.
It includes:

Full VIN decoding

Limited towing‑capacity data

Complete user flow

Working garage

Polished UI

It does not yet include:

Full towing‑guide dataset

Multi‑manufacturer support

Complete configuration coverage

Light mode UI

These are planned for future releases.

** Tech Stack **

React (frontend)

Supabase (auth + database)

Node/Express (API)

VIN decoding API

CSS Modules

Lucide Icons

** Architecture Overview**

/frontend
  /components
  /screens
  /contexts
  /styles
/backend
  /routes
  /controllers
  /services
  
AppShell wraps all authenticated routes

PrototypeBanner displays global prototype notice

VIN decoding → towing match → results screen

Garage stored in Supabase per user

** Roadmap **

Full towing‑guide pdf ingestion for all brands using python, Camelot, and Unstructured.io

Trailer‑weight calculator

Payload/tongue‑weight helper

Premium subscription tier

Offline mode

** Local Development **

bash
git clone <repo-url>
cd towmax
npm install
npm run dev
Backend:

bash
cd backend
npm install
npm run dev

** License **

MIT License
