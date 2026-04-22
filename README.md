*** TowMax — Intelligent Towing Capacity Estimator (Prototype) ***
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
