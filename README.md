# Hostel Management System - Complete Full Stack Backend and Frontend

A full-stack web application for university and college hostel administration, complaint tracking, student onboarding with email OTP verification, staff management, and admin oversight.

---

## Live Link : https://hostel-management-csos.onrender.com/

## 🌟 Key Features

- **Multi-Role Portal:**
  - **Student Portal:** Registration with real-time OTP verification, raise maintenance complaints with photos (Cloudinary), track pending and completed complaints.
  - **Staff / Warden Portal:** View today's complaints, pending tasks, resolve issues with resolution remarks.
  - **Admin Portal:** Comprehensive dashboard, create & manage sub-admins/wardens, track hostel-wide issue metrics.
- **Secure Authentication:** JWT authentication with hashed passwords (`bcrypt`).
- **Cloud Storage:** Image uploads integrated directly with Cloudinary.
- **Email Notifications:** OTP email delivery via Gmail App Passwords / Nodemailer / Resend.
- **Single-Service or Decoupled Architecture:** Express API + Vite React SPA (can be deployed as a single Web Service on Render or as separate Static Site + Web Service).

---

## 🚀 Quick Start (Local Development)

### 1. Prerequisites
- **Node.js** v18+ (tested on Node v22)
- **MongoDB** Atlas account or local MongoDB instance

### 2. Configure Environment Variables
Inside `backend/.env`:
```env
PORT=4000
JWT_SECRET=your_secret_key
MONGODB_URI=mongodb+srv://<user>:<password>@cluster0.mongodb.net/
DATABASE_NAME=hostel_management
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
GMAIL_USER=your_email@gmail.com
GMAIL_APP_PASSWORD=your_16_char_app_password
```

### 3. Install & Run
From the root directory:
```bash
# Install all dependencies
npm run install:all

# Run backend
npm run dev:backend

# Run frontend (in a separate terminal)
npm run dev:frontend
```
- Frontend will run on: `http://localhost:5173`
- Backend API will run on: `http://localhost:4000`

### 4. Default Admin Credentials
- **Email:** `admin@gmail.com`
- **Password:** `CIDC26@admin128`

---

## 🌐 Deploy to Render

### Recommended: Option 1 — Single Fullstack Web Service (100% Free Tier Friendly)
Render allows 1 free web service. This option deploys both frontend and backend together under a single URL!

1. Go to [Render Dashboard](https://dashboard.render.com/) and click **New +** -> **Web Service**.
2. Connect your GitHub repository: `yaswanth-thota-07/hostel-management`.
3. Fill in the service settings:
   - **Name:** `hostel-management-app`
   - **Region:** Any (e.g., Singapore, Frankfurt, or Oregon)
   - **Branch:** `main`
   - **Root Directory:** *(leave blank / default)*
   - **Runtime:** `Node`
   - **Build Command:** `npm run build`
   - **Start Command:** `npm start`
4. Under **Environment Variables**, add:
   - `NODE_ENV`: `production`
   - `PORT`: `10000`
   - `JWT_SECRET`: `your_jwt_secret`
   - `MONGODB_URI`: `your_mongodb_connection_string`
   - `DATABASE_NAME`: `hostel_management`
   - `CLOUDINARY_CLOUD_NAME`: `your_cloudinary_cloud_name`
   - `CLOUDINARY_API_KEY`: `your_cloudinary_api_key`
   - `CLOUDINARY_API_SECRET`: `your_cloudinary_api_secret`
   - `GMAIL_USER`: `your_gmail_address`
   - `GMAIL_APP_PASSWORD`: `your_gmail_app_password`
5. Click **Create Web Service**. Your full-stack app will be live at `https://<your-service-name>.onrender.com`!

---

### Alternative: Option 2 — Two Separate Services

#### A. Backend (Render Web Service)
1. **New +** -> **Web Service** -> select repo.
2. Settings:
   - **Root Directory:** `backend`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
3. Add the backend environment variables listed above.
4. Note your backend URL (e.g. `https://hostel-backend.onrender.com`).

#### B. Frontend (Render Static Site)
1. **New +** -> **Static Site** -> select repo.
2. Settings:
   - **Root Directory:** `frontend`
   - **Build Command:** `npm install && npm run build`
   - **Publish Directory:** `dist`
3. Under **Environment Variables**:
   - `VITE_API_BASE_URL`: `https://hostel-backend.onrender.com`
4. Under **Redirects/Rewrites**:
   - Source: `/*`
   - Destination: `/index.html`
   - Action: `Rewrite`
5. Click **Create Static Site**.
