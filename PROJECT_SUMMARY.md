# 🚦 Crowd Flow Optimiser (Venue Crowd Management)
> **Smart India Hackathon (SIH) & High-Impact Hackathons Edition**  
> An End-to-End AI-Powered Venue Crowd Management & Stampede Prevention Platform.

---

## 🎯 Problem Statement & Solution

### Problem
Large stadiums, concerts, exhibitions, and public gatherings suffer from sudden crowd congestion at entry gates, food courts, and emergency exits. This increases:
* **Stampede Risks**: High density localized bottlenecks.
* **Long Waiting Times**: Frustrated visitors waiting in unmanaged queues.
* **Slow Emergency Evacuation**: Unclear exit paths during critical incidents.

### Proposed Solution
An AI-powered web platform that analyzes venue layouts and live crowd data to:
* Detect real-time crowd density (🟢 Low, 🟡 Medium, 🔴 High).
* Predict bottleneck congestion 10–15 minutes in advance.
* Generate dynamic alternative safe routes for visitors & security marshals.
* Provide interactive 2D canvas particle physics crowd simulations.
* Leverage Hugging Face LLMs (`Qwen/Qwen3-4B-Instruct` / `Mistral`) for natural language safety recommendations.
* Dispatch 1-Click Emergency Evacuation Protocols.

---

## 🛠️ Technology Stack

* **Frontend**: React, Vite, Tailwind CSS, Lucide Icons, Canvas API (2D Particle Engine), Recharts, React Router DOM.
* **Backend**: Node.js, Express, Socket.io (Real-Time Websockets), JWT Authentication.
* **AI Engine**: Hugging Face Inference API (`@huggingface/inference`) + Smart Zero-Latency Local Fallback AI Algorithm.

---

## 📁 Project Folder Structure

```
Hackathon/
├── PROJECT_SUMMARY.md          # Complete Project Documentation & File Summary
│
├── client/                     # Vite + React Frontend Application
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── src/
│   │   ├── main.jsx
│   │   ├── App.jsx             # Main Router & Layout Setup
│   │   ├── index.css           # Glassmorphism & Custom Animations
│   │   ├── components/         # Reusable UI Components
│   │   │   ├── Navbar.jsx      # Header with IoT Stream Toggle, Emergency Mode, Role Switcher
│   │   │   ├── Sidebar.jsx     # Collapsible 11-page Side Navigation
│   │   │   ├── StatCard.jsx    # Metric Cards for Dashboard
│   │   │   └── EmergencyOverlay.jsx # Top Red Flashing Banner on Evacuation Mode
│   │   ├── context/
│   │   │   ├── AuthContext.jsx  # JWT & User Roles (Admin / Event Manager)
│   │   │   └── VenueContext.jsx # Venue State, Crowd Headcounts, IoT Stream, Alerts
│   │   ├── services/
│   │   │   ├── aiEngine.js      # Client AI Risk Calculator & HF API Bridge
│   │   │   └── simulationEngine.js # 60 FPS 2D Canvas Crowd Particle Dynamics Engine
│   │   └── pages/              # 11 Full Pages + Visitor Mode
│   │       ├── LandingPage.jsx        # Landing page with hero, features, workflow
│   │       ├── LoginPage.jsx          # JWT login & Quick Judge Demo Login buttons
│   │       ├── DashboardOverview.jsx  # Main metrics dashboard
│   │       ├── VenueUploadPage.jsx    # Upload floor plan, interactive marker builder
│   │       ├── CrowdDataPage.jsx     # Manual gate input, CSV parser, IoT stream toggle
│   │       ├── AISimulationPage.jsx   # 2D Canvas simulator & AI risk score output ⭐
│   │       ├── LiveMapPage.jsx        # Dynamic crowd heatmaps (Green/Yellow/Red)
│   │       ├── AlternateRoutePage.jsx # AI-suggested safe routing paths with animated arrows
│   │       ├── AlertsPage.jsx         # Live alert cards, emergency evacuation mode, gate toggles
│   │       ├── ReportsPage.jsx        # Recharts historical analytics, peak crowd, PDF/CSV download
│   │       ├── SettingsPage.jsx       # Hugging Face token config, AI sensitivity, user roles
│   │       └── VisitorQRView.jsx      # Public/Visitor QR view for nearest safe exit & queue times
│
└── server/                     # Node.js + Express Backend API
    ├── server.js               # Express application & Socket.io server
    ├── package.json
    ├── ai/
    │   └── hfClient.js         # Hugging Face API client & local fallback engine
    ├── data/
    │   └── presetVenues.js     # Stadium dataset templates (Narendra Modi Stadium, Pragati Maidan)
    └── middleware/
        └── authMiddleware.js   # JWT authentication middleware
```

---

## 📖 Detailed File-by-File Breakdown

### 🖥️ Backend Server (`server/`)
1. **`server/server.js`**: Main API server handling routes `/api/auth/login`, `/api/venues`, `/api/venues/:id/crowd`, and `/api/ai/predict` along with Socket.io websocket events.
2. **`server/ai/hfClient.js`**: Hugging Face Inference API bridge. Sends live crowd metrics to LLMs and returns emergency rerouting advice. Includes local rule fallback so the app works offline seamlessly.
3. **`server/data/presetVenues.js`**: Seed dataset containing realistic venue maps (Narendra Modi Stadium, Pragati Maidan Expo) with pre-configured Gates, Food Courts, Stages, and Exits.
4. **`server/middleware/authMiddleware.js`**: Protects admin endpoints using JSON Web Tokens (JWT).

### 🎨 Frontend Core Services (`client/src/services/`)
1. **`client/src/services/simulationEngine.js`**: HTML5 Canvas particle physics engine running at **60 FPS**. Renders individual visitors moving across nodes, dynamic radial heatmap halos (🟢 Low, 🟡 Medium, 🔴 High), and evacuation velocity vectors.
2. **`client/src/services/aiEngine.js`**: Frontend risk analysis service. Calculates Risk Score (0–100%), Average Waiting Time, Safe Capacity %, and alternate safe exit routes.

### 🧩 Frontend Components (`client/src/components/`)
1. **`client/src/components/Navbar.jsx`**: Header bar featuring IoT Live Stream toggle, Emergency Evacuation button, Public Visitor QR link, and Admin/Manager role switchers.
2. **`client/src/components/Sidebar.jsx`**: Side navigation menu with active glowing indicators for all 11 pages.
3. **`client/src/components/StatCard.jsx`**: Glassmorphic metric card component.
4. **`client/src/components/EmergencyOverlay.jsx`**: Full-width flashing red alert banner displayed when Emergency Mode is triggered.

### 📄 Frontend Pages (`client/src/pages/`)
1. **`LandingPage.jsx`**: Hero section with dynamic typography, live demo preview, 4-step workflow, and feature grid.
2. **`LoginPage.jsx`**: JWT Authentication page with **⚡ 1-Click Judge Demo Login** buttons.
3. **`DashboardOverview.jsx`**: Main overview featuring 5 key cards (*Current Crowd, Active Alerts, Avg Wait Time, Risk Level, Total Visitors*), gate breakdown progress bars, and Hugging Face AI recommendations.
4. **`VenueUploadPage.jsx`**: Floor plan upload tool (PNG, JPEG, SVG) with click-to-place interactive node markers.
5. **`CrowdDataPage.jsx`**: Headcount input controls, CSV file upload parser, and sample festival dataset loader.
6. **`AISimulationPage.jsx` ⭐**: The hero 2D Canvas simulator page displaying crowd particles, red congestion zones, green clear paths, and AI prediction scorecards.
7. **`LiveMapPage.jsx`**: Dynamic heatmap visual map (🟢 Low, 🟡 Medium, 🔴 High) with click-to-inspect node details.
8. **`AlternateRoutePage.jsx`**: AI Rerouting engine showing path recommendations (*Gate 2 Congested → Corridor West → Exit 4*) with animated arrows and time savings.
9. **`AlertsPage.jsx`**: Safety alerts feed, 1-click Emergency Evacuation protocol switch, and manual gate lock/unlock controls.
10. **`ReportsPage.jsx`**: Recharts graphs (Hourly Inflow Bar Chart & Wait Time Line Chart) with PDF/CSV export.
11. **`SettingsPage.jsx`**: Hugging Face API Key token configuration (`Qwen/Qwen3-4B-Instruct`), AI risk sensitivity sliders, and staff notification toggles.
12. **`VisitorQRView.jsx`**: Mobile-optimized public view for venue attendees scanning QR codes to find nearest safe exits and shortest food court queues.

---

## 🎯 Demo Presentation Flow for Hackathon Judges

1. Open **`LandingPage`** and click **"Launch Live App"**.
2. On **`LoginPage`**, click **"Quick Hackathon Judge Access"** (Admin Demo).
3. View **`DashboardOverview`** to show key metric cards, risk percentage, and Hugging Face AI recommendations.
4. Go to **`VenueUploadPage`** to upload blueprints or place interactive gate/exit markers.
5. Open **`CrowdDataPage`** and toggle **"Connect IoT Sensors API"** to demonstrate real-time live crowd updates.
6. Navigate to **`AISimulationPage`** ⭐ and press **"RUN AI SIMULATION"** to showcase 60FPS particle physics, Red congestion zones, Green paths, and AI Risk scores.
7. Inspect individual nodes on **`LiveMapPage`** to show live headcount popups.
8. View **`AlternateRoutePage`** for animated rerouting arrow flows (*Gate 2 → Exit 4*).
9. Toggle **🚨 Emergency Evacuation Mode** on **`AlertsPage`** to demonstrate instant evacuation protocols.
10. Review Recharts graphs and click **"Download PDF / Export CSV"** on **`ReportsPage`**.

---

## 🏃 How to Run Locally

### 1. Start Backend API Server
```bash
cd server
npm start
# Server listens on http://localhost:5000
```

### 2. Start Frontend Web App
```bash
cd client
npm run dev
# App opens on http://localhost:3000
```
