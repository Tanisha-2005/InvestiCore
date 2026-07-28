# 🚀 Step-by-Step Render.com Deployment Guide for InvestiCore

This guide explains how to deploy both the **Backend API Service** and **Frontend Web UI** of InvestiCore on **[Render.com](https://render.com/)** for FREE.

---

## 📋 Overview of Render Services

| Service Name | Render Service Type | Root Directory | Build Command | Start Command |
|---|---|---|---|---|
| **InvestiCore Backend** | Web Service (Node.js) | `backend` | `npm install` | `npm start` |
| **InvestiCore Frontend** | Web Service (Node.js) | `frontend` | `npm install && npm run build` | `npm start` |

---

## 🛠️ Step 1: Deploy Backend API Service on Render

1. Go to **[dashboard.render.com](https://dashboard.render.com)** and log in with GitHub.
2. Click **New +** $\rightarrow$ Select **Web Service**.
3. Connect your GitHub Repository: `Tanisha-2005/InvestiCore`.
4. Configure Backend Settings:
   - **Name**: `investicore-backend`
   - **Region**: Choose closest to you (e.g., Singapore / Oregon / Frankfurt).
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: `Free` ($0/month)
5. Add **Environment Variables** under the **Environment** tab:

   | Key | Value | Notes |
   |---|---|---|
   | `PORT` | `5000` | Render assigned port |
   | `NODE_ENV` | `production` | Production mode |
   | `CLIENT_URL` | `https://investicore-frontend.onrender.com` | Replace with your frontend Render URL |
   | `MONGO_URI` | `mongodb+srv://<username>:<password>@cluster0.meukdie.mongodb.net/investicore?retryWrites=true&w=majority` | Your MongoDB Atlas URL |
   | `JWT_SECRET` | `investicore_secure_jwt_secret_token_2026_x89a` | JWT Secret Key |
   | `JWT_EXPIRES_IN` | `7d` | JWT Token duration |
   | `OPENAI_API_KEY` | `sk-proj-...` | Optional for AI summaries & YARA rules |
   | `VIRUSTOTAL_API_KEY` | `80e4690e...` | Optional Threat Intel API Key |
   | `ABUSEIPDB_API_KEY` | `bbc6776c...` | Optional Threat Intel API Key |

6. Click **Create Web Service**.
7. Once deployed, Render will provide a URL for your backend (e.g. `https://investicore-backend.onrender.com`).
   - Test it by visiting: `https://investicore-backend.onrender.com/api/health`

---

## 🖥️ Step 2: Deploy Frontend Web UI on Render

1. On your Render Dashboard, click **New +** $\rightarrow$ Select **Web Service**.
2. Select the same GitHub Repository: `Tanisha-2005/InvestiCore`.
3. Configure Frontend Settings:
   - **Name**: `investicore-frontend`
   - **Branch**: `main`
   - **Root Directory**: `frontend`
   - **Runtime**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Instance Type**: `Free` ($0/month)
4. Add **Environment Variables**:

   | Key | Value | Notes |
   |---|---|---|
   | `NEXT_PUBLIC_API_URL` | `https://investicore-backend.onrender.com/api` | Your deployed backend URL + `/api` |

5. Click **Create Web Service**.
6. Render will build the Next.js app and provide your live application URL:
   - `https://investicore-frontend.onrender.com`

---

## 🔄 Step 3: Final CORS Cross-Linking Check

1. Go back to your **investicore-backend** service on Render.
2. In **Environment**, ensure `CLIENT_URL` matches your exact frontend Render URL (`https://investicore-frontend.onrender.com`).
3. Click **Save Changes** (Render will automatically redeploy backend).

---

## 🎉 Verification Checklist

- [x] Backend Health Check: `https://investicore-backend.onrender.com/api/health` returns `{"status":"ok"}`.
- [x] Frontend Live App: Navigate to `https://investicore-frontend.onrender.com/login` and register an account.
- [x] Database Sync: Actions reflect live on MongoDB Atlas Cloud.
