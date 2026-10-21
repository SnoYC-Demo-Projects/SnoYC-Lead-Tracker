# 🚀 SnoYC Lead - Production Deployment Guide

SnoYC Lead is built as a complete full-stack web platform with a React frontend and an Express + SQLite persistent backend. In production, a single Node.js process serves both the backend API and the compiled high-speed frontend assets.

---

## ⚡ Option 1: Free Cloud Hosting (Render.com)

Render provides free Node.js hosting with persistent disk support.

1. **Push your code to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial SnoYC Lead production release"
   git branch -M main
   git remote add origin https://github.com/<your-username>/lead-tracker.git
   git push -u origin main
   ```
2. Go to **[Render.com](https://render.com)** and sign in.
3. Click **"New +"** -> **"Web Service"**.
4. Connect your GitHub repository.
5. Set the following build settings:
   * **Runtime**: `Node`
   * **Build Command**: `npm install && npm run build`
   * **Start Command**: `node server/server.js`
   * **Environment Variables**:
     * `NODE_ENV`: `production`
     * `PORT`: `5000` (Render will set this automatically)
6. Under **Advanced** -> **Disks**, click **"Add Disk"**:
   * **Name**: `leads-data`
   * **Mount Path**: `/app/data` (or `./data`)
   * **Size**: 1 GB
7. Click **Deploy Web Service**. Render will assign you a live HTTPS URL (e.g., `https://your-leads.onrender.com`) that your team can access from anywhere in the world!

---

## 🚂 Option 2: Railway.app (1-Click Hosting)

1. Go to **[Railway.app](https://railway.app)**.
2. Click **"New Project"** -> **"Deploy from GitHub repo"**.
3. Select your repository.
4. Add a **Persistent Volume** mounted at `/app/data` to persist your `leads.db`.
5. Railway will automatically detect Node, build the frontend, and launch the server.

---

## 🐳 Option 3: Docker Deployment

You can run SnoYC Lead on any server (AWS, DigitalOcean, Linode, Hetzner, etc.) using Docker:

```bash
# 1. Build the Docker image
docker build -t snoyc-lead .

# 2. Run container with persistent SQLite volume
docker run -d \
  --name snoyc-lead \
  -p 5000:5000 \
  -v $(pwd)/data:/app/data \
  --restart unless-stopped \
  snoyc-lead
```
Your app will be live at `http://<server-ip>:5000`.

---

## 🖥️ Option 4: Self-Hosted on Windows / Linux Server (with PM2)

If you are running this on an in-house server or your main office machine:

1. **Build frontend**:
   ```bash
   npm run build
   ```
2. **Install PM2 process manager (keeps the server running 24/7 and restarts on boot)**:
   ```bash
   npm install -g pm2
   pm2 start server/server.js --name "snoyc-lead"
   pm2 save
   pm2 startup
   ```
3. Share the local IP address (`http://192.168.0.xxx:5000/`) with your team members on the same network.

---

## 🔑 Default Administrator Credentials

* **Email**: `admin@company.com`
* **Password**: `admin123`

> ⚠️ **Important Security Note**: After logging into your hosted platform for the first time, invite your team members. Team members can register through the "Register New Member" tab on the login screen, and you can approve them from the **"Team Overview"** dashboard.
