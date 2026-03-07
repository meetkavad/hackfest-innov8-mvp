# 🍽️ ShareBite - Community Food Sharing & Surplus Reduction Platform

ShareBite is a full-stack platform designed to connect food donors (restaurants, businesses, individuals) with recipients (NGOs, individuals in need) to reduce food waste and support the community. 

## ✨ Key Features

### 🔐 Role-Based Access Control (RBAC)
- **Donors:** Add available foods, view requests, and track their impact.
- **Recipients:** Browse available foods near them, request food, and get notified about new food drops.
- **Admins:** Manage user verifications, view platform statistics, and oversee requests globally.

### 🗺️ Location & Maps Integration
- **Interactive Maps:** Donors can pinpoint the exact pickup location using interactive Leaflet maps.
- **Proximity Sorting:** Recipients can view available food sorted by distance (e.g., within 1km, 5km, 10km) using calculated geospatial data.
- **Easy Navigation:** Clicking a map marker dynamically redirects to specific food details.

### 📧 Automated Notifications
- **Email & OTP integration:** Sent automatically via Nodemailer for account verifications and crucial updates to keep all parties informed.

---

## 🧰 Tech Stack

- **Frontend:** React, React Router, Tailwind CSS, Leaflet (Maps)
- **Backend:** Node.js, Express.js
- **Database:** MongoDB (with `2dsphere` geospatial indexes for distance calculations)
- **External Services:** Nodemailer (Email services)

---

## 🚀 Getting Started

To run this application locally, you will need to start both the frontend and backend servers.

### Environment Variables

Before running the application, you need to configure the environment variables for both the backend and frontend.

#### Backend `.env` (inside `backend/` directory)
Create a `.env` file in the `backend` directory with the following variables:
```env
PORT=5000
MONGODB_URI="your_mongodb_connection_string"
EMAIL_USER="your_email@gmail.com"
EMAIL_PASS="your_email_app_password"
```

#### Frontend `.env` (inside root directory)
Create a `.env` file in the root directory with the following variables:
```env
VITE_API_URL="http://localhost:5000"
```

### 1. Backend Setup
1. Open a terminal and navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the server:
   ```bash
   npm run dev
   ```

### 2. Frontend Setup
1. Open a new terminal and navigate to the root directory:
   ```bash
   cd ShareBite
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the React app:
   ```bash
   npm run dev
   ```