# 🚀 Step-by-Step Getting Started Guide

This guide walks you through running **InvestiCore** locally on your machine in the simplest, most human-friendly way possible.

---

## 💻 System Prerequisites

Before running InvestiCore, ensure you have the following installed on your machine:

- **Node.js**: Version `18.x` or higher (Version `20.x` recommended). Check with:
  ```bash
  node -v
  ```
- **npm**: Included with Node.js. Check with:
  ```bash
  npm -v
  ```
- *(Optional)* **MongoDB**: If you have MongoDB installed locally, InvestiCore will connect to `mongodb://127.0.0.1:27017`. If you **don't** have MongoDB installed, **don't worry!** InvestiCore automatically creates an **In-Memory MongoDB instance** so you can run the app without installing MongoDB!

---

## 🏃 Running the Application

InvestiCore consists of two parts: the **Node.js Express Backend** and the **Next.js Frontend**.

### Step 1: Open the Project Directory
Open your terminal inside the root directory of the project.

---

### Step 2: Start the Backend Server (API)

1. Open a terminal and navigate to the `backend` folder:
   ```bash
   cd backend
   ```

2. Install dependencies (if you haven't already):
   ```bash
   npm install
   ```

3. Ensure the `.env` file exists:
   - A default `.env` file is already created in `backend/.env`.
   - It contains default development configuration and fallback keys.

4. Launch the backend server:
   ```bash
   npm start
   ```
   *(Or run `npm run dev` if you want nodemon hot-reloading while editing backend code).*

5. **What to look for in the console**:
   ```text
   Server running on port 5000
   [Database] MongoDB connected: 127.0.0.1 (In-Memory Server)
   ```
   🎉 Your backend API is now running at **`http://localhost:5000`**!

---

### Step 3: Start the Frontend Application (Web UI)

1. Open a **second terminal window** and navigate to the `frontend` folder:
   ```bash
   cd frontend
   ```

2. Install dependencies (if you haven't already):
   ```bash
   npm install
   ```

3. Launch the Next.js development server:
   ```bash
   npm run dev
   ```

4. **What to look for in the console**:
   ```text
   ▲ Next.js 14.2.35
   - Local:        http://localhost:3000
   ✓ Ready in 4.8s
   ```
   🎉 Your web application is now active at **`http://localhost:3000`**!

---

## 🌐 Verifying Everything Works

1. Open your web browser and navigate to:
   👉 **`http://localhost:3000`**

2. You will be greeted by the InvestiCore landing page or login screen.

3. **Backend Health Check**:
   You can verify the backend status at any time by visiting:
   👉 **`http://localhost:5000/api/health`**
   *(Expected response: `{"status":"ok","time":"..."}`)*

---

## 🛠️ Summary of Running Commands

| Application | Directory | Command | URL |
|---|---|---|---|
| **Backend API** | `backend/` | `npm start` | `http://localhost:5000` |
| **Frontend Web** | `frontend/` | `npm run dev` | `http://localhost:3000` |

---

Need to customize API keys or understand the system architecture? Check out:
- 💡 [**02. Project Overview**](./02_PROJECT_OVERVIEW.md)
- 🔑 [**04. API & Environment Guide**](./04_API_&_ENVIRONMENT_GUIDE.md)
