## **_ TowMax Towing Capacity Estimator (Prototype) _**

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

TowMax is a vehicle‑lookup tool that decodes VINs, identifies key configuration details, and provides towing‑capacity estimates.
This prototype demonstrates the full user flow, VIN decoding accuracy, and UI polish while using a limited towing dataset.

## ** Demo/Prototype **
---

https://towmax.vercel.app/

** Features **

-VIN Decoding (Fully Functional)
--Decodes year, make, model, engine, drive, body style, and more

Displays a full VIN breakdown

** Towing Capacity Logic (Prototype Dataset) **

-Exact match when configuration is known

-Range match when multiple configurations exist

-Graceful fallback when no towing data is available

-Always shows VIN results regardless of towing match

** Garage System **

-Save decoded vehicles

-Add and remove saved vehicles

-Premium logic scaffolded for future expansion

** Modern UI/UX **

-App‑shell layout

-Centered header

-Clean result screens

-Prototype banner

-Mobile‑first design

** Prototype Scope **

-This version of TowMax is a functional prototype.
--It includes:

--Full VIN decoding

--Limited towing‑capacity data

--Complete user flow

--Working garage

--Polished UI

--It does not yet include:

--Full towing‑guide dataset

--Multi‑manufacturer support

--Complete configuration coverage

--Light mode UI

--These are planned for future releases.

** Why I Built This **
TowMax is a simple idea: towing capacity should be easier to access. Every truck owner has a VIN, but it's rare for for someone to know their exact towing capacity, and the information is buried in PDFs, trim‑specific charts, and confusing manufacturer documentation.

I built TowMax to solve that problem in a modern, intuitive way. This prototype demonstrates the full user flow: VIN decoding, configuration interpretation, towing‑capacity logic, and a clean mobile‑first UI. Even with a limited dataset, the app shows the complete experience and lays the foundation for a fully automated towing‑guide ingestion pipeline.

As a software engineering student preparing for roles in healthcare data and data engineering, this project let me combine real‑world data modeling, API design, UI polish, and system architecture into a single application. TowMax is both a practical tool and a showcase of how I approach building scalable, user‑centered applications.

** Tech Stack **

React (frontend)

Supabase (auth + database)

Node/Express (API)

VIN decoding API

CSS Modules

Lucide Icons

Render

Vercel

CI|CD github Actions

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

-AppShell wraps all authenticated routes

-PrototypeBanner displays global prototype notice

-VIN decoding → towing match → results screen

-Garage stored in Supabase per user

** Challenges & Solutions **

Challenge:  
The refine system needed to update available options after every answer, but without aggressively eliminating choices or forcing the user into a dead end. Early versions waited until all questions were answered, which allowed impossible combinations and created a frustrating UX.

Solution:  
I redesigned the refine flow into a real‑time narrowing engine. After each answer, the frontend sends the current partial state to the backend, which returns:

remaining valid configurations

updated missing fields

updated valid options per field

The UI re-renders dynamically, hiding invalid options while keeping the flow smooth and non‑disruptive. This created an intelligent, user‑friendly refinement system that feels modern and responsive.

Challenge:  
Manufacturers publish towing data in multi‑column PDFs, footnotes, trim‑specific tables, and inconsistent formats. There is no unified dataset.

Solution:  
I designed a flexible towing‑match engine that works even with partial data. The prototype gracefully handles:

exact matches

range matches

no‑data scenarios

VIN‑only fallback

This allowed me to ship a complete user experience while planning for future ingestion using Unstructured.io.

Challenge:  
VIN decoding returns raw, technical data that varies by manufacturer and isn’t user‑friendly.

Solution:  
I normalized key fields (engine, drive, cab, bed) and built a clean VIN summary and full breakdown screen. The UI always shows meaningful results, even when towing data is missing.

** Roadmap **

-Full towing‑guide pdf ingestion for all brands using python, Camelot, and Unstructured.io

-Trailer‑weight calculator

-Payload/tongue‑weight helper

-Premium subscription tier

-Offline mode

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
