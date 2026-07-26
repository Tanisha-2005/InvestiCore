# ❓ Troubleshooting & Frequently Asked Questions (FAQs)

Here are solutions to the most common questions and issues you might encounter while running **InvestiCore**.

---

## 🚨 Common Technical Issues & Fixes

### 1. `Error: listen EADDRINUSE: address already in use :::5000`
- **Cause**: Another process or previous backend instance is already using port 5000.
- **Solution**: 
  - On **Windows**:
    ```powershell
    Get-Process -Id (Get-NetTCPConnection -LocalPort 5000).OwningProcess | Stop-Process
    ```
  - On **Mac/Linux**:
    ```bash
    kill -9 $(lsof -t -i:5000)
    ```
  - Alternatively, change `PORT=5001` in `backend/.env` and update `NEXT_PUBLIC_API_URL=http://localhost:5001/api` in `frontend/.env`.

---

### 2. `Error: listen EADDRINUSE: address already in use :::3000`
- **Cause**: Port 3000 is occupied by another Next.js or React app.
- **Solution**: Next.js will automatically prompt you to run on port 3001 if port 3000 is busy! Just type `Y` when prompted in the terminal.

---

### 3. `[Database] Local MongoDB unavailable... Using MongoMemoryServer...`
- **Is this an error?** **NO!** This is an intentional feature.
- If you don't have MongoDB installed on your computer, InvestiCore automatically creates a temporary database in RAM using `mongodb-memory-server`.
- **Note**: Data stored in In-Memory mode is wiped when the backend server restarts. If you want permanent data storage across restarts, install MongoDB Community Edition or connect to a free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cloud cluster by setting `MONGO_URI` in `backend/.env`.

---

### 4. `OpenAI API Error: Incorrect API Key` or Rate Limit
- **Cause**: Invalid or expired `OPENAI_API_KEY` in `backend/.env`.
- **Solution**: Open `backend/.env` and update `OPENAI_API_KEY` with a valid key from [platform.openai.com](https://platform.openai.com). If no key is provided, local regex IOC extraction and evidence analysis will still work smoothly!

---

### 5. Frontend UI shows CORS error when making API requests
- **Cause**: `CLIENT_URL` in `backend/.env` does not match the URL of your frontend.
- **Solution**: Ensure `CLIENT_URL=http://localhost:3000` in `backend/.env` and restart the backend server.

---

## 💬 Frequently Asked Questions (FAQs)

### Q1: Do I need Docker to run InvestiCore?
**No!** While Docker Compose configurations are included in `docker-compose.yml`, you can run InvestiCore directly using Node.js (`npm start` in backend and `npm run dev` in frontend).

### Q2: How do I create an account?
When you first open `http://localhost:3000`, click on **Register**, enter your name, email, role (e.g. Lead Investigator), and password. You will instantly be logged into the dashboard!

### Q3: Where are uploaded evidence files stored?
Files are stored locally in `backend/uploads/` by default. If you configure AWS S3 parameters in `backend/.env`, files will be stored in your S3 bucket.

### Q4: Can I export forensic reports for my clients/supervisors?
Yes! Navigate to the **Reports** section in the web interface to export comprehensive reports in **PDF**, **DOCX**, or **Markdown** formats.

---

## 🆘 Still Need Help?
- Check the console logs in both backend and frontend terminal windows.
- Review [01_GETTING_STARTED.md](./01_GETTING_STARTED.md) for step-by-step launch instructions.
