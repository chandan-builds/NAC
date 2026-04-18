# DTDC API Integration Portal

A full-stack web application designed to interface with the DTDC Courier API. It provides a clean React UI for creating consignments, checking pin code serviceability dynamically, and automating the retrieval of session tokens via headless browser automation.

## Features
- **Headless Token Scraper:** Uses Puppeteer to log into the DTDC portal in the background and seamlessly scrape the required authentication `access-token`.
- **Dynamic Pincode Validation:** Automatically pings DTDC's serviceability API to verify if a destination pin code is valid and auto-fills the corresponding City and State.
- **CORS Proxy Backend:** An Express backend handles all external API requests to DTDC, safely bypassing browser CORS limitations.
- **Responsive UI:** Fast, modern interface built with React and Tailwind CSS for generating complex consignment payloads.

## Tech Stack
- **Frontend:** React, Vite, Tailwind CSS
- **Backend:** Node.js, Express
- **Automation:** Puppeteer
- **Ready for Cloud Setup:** Pre-configured Docker setup for easy deployment to Render.

## Run Locally

**Prerequisites:** Node.js 18+

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the development application (runs both the Vite frontend and Express server concurrently):
   ```bash
   npm run dev
   ```
3. Open your browser to `http://localhost:3000`

## Production Deployment (Render)
Because this application relies on a headless Chrome browser (Puppeteer) to fetch sessions, it requires system-level libraries normally absent in serverless environments. 

Therefore, **Docker** on **Render.com** is the recommended deployment strategy.
1. Connect this repository to a new Render "Web Service".
2. Select **Docker** as the Environment.
3. Add the following Environment Variable:
   - `NODE_ENV`: `production`

The included `Dockerfile` will automatically handle downloading the OS dependencies required by Puppeteer.
