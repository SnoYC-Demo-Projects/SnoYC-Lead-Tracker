import express from "express";
import cors from "cors";
import path from "path";
import os from "os";
import fs from "fs";
import { fileURLToPath } from "url";
import { db, initDatabase } from "./db.js";
import { INITIAL_USERS, INITIAL_LEADS } from "../src/data/mockData.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS and JSON parsing
app.use(cors());
app.use(express.json());

// Initialize SQLite database
initDatabase();

// Helper to get local network IP
function getLocalNetworkIP() {
  const nets = os.networkInterfaces();
  for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
      if (net.family === "IPv4" && !net.internal) {
        return net.address;
      }
    }
  }
  return "localhost";
}

// 1. Network info endpoint (so the UI can show the shareable Wi-Fi link for team members!)
app.get("/api/network-info", (req, res) => {
  const ip = getLocalNetworkIP();
  res.json({
    localIp: ip,
    apiPort: PORT,
    vitePort: 5173,
    shareUrl: `http://${ip}:5173/`
  });
});

// 2. Auth: Get Users
app.get("/api/users", (req, res) => {
  try {
    const users = db.prepare("SELECT id, name, email, role, status, avatar, title FROM users").all();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Auth: Register New Team Member (Awaiting Admin Approval)
app.post("/api/auth/register", (req, res) => {
  const { name, email, password, title } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: "Name, email, and password are required" });
  }

  try {
    // Check if email already registered
    const existing = db.prepare("SELECT id FROM users WHERE LOWER(email) = LOWER(?)").get(email.trim());
    if (existing) {
      return res.status(400).json({ error: "An account with this email already exists" });
    }

    const id = `user-${Date.now()}`;
    const avatar = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name.trim())}`;

    const stmt = db.prepare(`
      INSERT INTO users (id, name, email, password, role, status, avatar, title)
      VALUES (?, ?, ?, ?, 'member', 'pending', ?, ?)
    `);
    stmt.run(id, name.trim(), email.trim(), password, avatar, title || "Sales Representative");

    const created = db.prepare("SELECT id, name, email, role, status, avatar, title FROM users WHERE id = ?").get(id);
    res.status(201).json({
      success: true,
      message: "Registration submitted successfully! Your account is pending Admin approval.",
      user: created
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Auth: Login
app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  try {
    const user = db.prepare("SELECT * FROM users WHERE LOWER(email) = LOWER(?) AND password = ?").get(email.trim(), password);
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Check admin approval status
    if (user.status === "pending") {
      return res.status(403).json({ 
        error: "Your registration is pending Admin approval. Please contact your administrator to authorize your account." 
      });
    }

    if (user.status === "rejected") {
      return res.status(403).json({ 
        error: "Your access request was declined by the administrator." 
      });
    }

    const { password: _, ...safeUser } = user;
    res.json({ success: true, user: safeUser });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin: Approve / Reject / Update User Status
app.patch("/api/users/:id/status", (req, res) => {
  const { id } = req.params;
  const { status } = req.body; // 'approved' | 'rejected' | 'pending'

  if (!["approved", "rejected", "pending"].includes(status)) {
    return res.status(400).json({ error: "Invalid status value. Must be 'approved', 'rejected', or 'pending'." });
  }

  try {
    const user = db.prepare("SELECT role FROM users WHERE id = ?").get(id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    if (user.role === "admin" && status !== "approved") {
      return res.status(400).json({ error: "Cannot revoke or reject the primary administrator" });
    }

    db.prepare("UPDATE users SET status = ? WHERE id = ?").run(status, id);
    const updated = db.prepare("SELECT id, name, email, role, status, avatar, title FROM users WHERE id = ?").get(id);
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update Profile & Password (Admin or User)
app.put("/api/users/:id/profile", (req, res) => {
  const { id } = req.params;
  const { name, email, password, title } = req.body;

  try {
    const user = db.prepare("SELECT * FROM users WHERE id = ?").get(id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check if new email is taken by someone else
    if (email && email.toLowerCase() !== user.email.toLowerCase()) {
      const existing = db.prepare("SELECT id FROM users WHERE LOWER(email) = LOWER(?) AND id != ?").get(email.trim(), id);
      if (existing) {
        return res.status(400).json({ error: "Email is already in use by another user" });
      }
    }

    const newName = name ? name.trim() : user.name;
    const newEmail = email ? email.trim() : user.email;
    const newPassword = password && password.trim() ? password.trim() : user.password;
    const newTitle = title ? title.trim() : user.title;
    const newAvatar = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(newName)}`;

    db.prepare(`
      UPDATE users SET
        name = ?,
        email = ?,
        password = ?,
        title = ?,
        avatar = ?
      WHERE id = ?
    `).run(newName, newEmail, newPassword, newTitle, newAvatar, id);

    const updated = db.prepare("SELECT id, name, email, role, status, avatar, title FROM users WHERE id = ?").get(id);
    res.json({ success: true, user: updated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin: Delete user
app.delete("/api/users/:id", (req, res) => {
  const { id } = req.params;
  try {
    const user = db.prepare("SELECT role FROM users WHERE id = ?").get(id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    if (user.role === "admin") {
      return res.status(400).json({ error: "Cannot delete the administrator account" });
    }

    db.prepare("DELETE FROM users WHERE id = ?").run(id);
    res.json({ success: true, id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Auth: Direct Add Team Member (By Admin - auto-approved)
app.post("/api/users", (req, res) => {
  const { name, email, password, role, title, avatar } = req.body;
  if (!name || !email) {
    return res.status(400).json({ error: "Name and email are required" });
  }

  const id = `user-${Date.now()}`;
  const userAvatar = avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}`;
  const userRole = role || "member";
  const userPass = password || "user123";

  try {
    const stmt = db.prepare(`
      INSERT INTO users (id, name, email, password, role, status, avatar, title)
      VALUES (?, ?, ?, ?, ?, 'approved', ?, ?)
    `);
    stmt.run(id, name, email, userPass, userRole, userAvatar, title || "Sales Representative");

    const created = db.prepare("SELECT id, name, email, role, status, avatar, title FROM users WHERE id = ?").get(id);
    res.status(201).json(created);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3. Leads: List all leads
app.get("/api/leads", (req, res) => {
  try {
    const leads = db.prepare("SELECT * FROM leads ORDER BY dateLogged DESC, id DESC").all();
    res.json(leads);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Leads: Helper to generate next Lead ID
function generateLeadId() {
  const row = db.prepare("SELECT id FROM leads WHERE id LIKE 'LD-%' ORDER BY LENGTH(id) DESC, id DESC LIMIT 1").get();
  if (!row) return "LD-1001";
  const num = parseInt(row.id.replace("LD-", ""), 10);
  return `LD-${(isNaN(num) ? 1000 : num) + 1}`;
}

// Leads: Create new lead
app.post("/api/leads", (req, res) => {
  const data = req.body;
  if (!data.businessName || !data.contactName || !data.phone) {
    return res.status(400).json({ error: "Business name, contact name, and phone are required" });
  }

  const id = data.id || generateLeadId();
  const dateLogged = data.dateLogged || new Date().toISOString().split("T")[0];

  try {
    const stmt = db.prepare(`
      INSERT INTO leads (
        id, dateLogged, businessName, contactName, phone, city,
        businessType, source, need, status, lastContacted,
        nextFollowUp, notes, assignedToId, assignedToName, estimatedValue
      ) VALUES (
        @id, @dateLogged, @businessName, @contactName, @phone, @city,
        @businessType, @source, @need, @status, @lastContacted,
        @nextFollowUp, @notes, @assignedToId, @assignedToName, @estimatedValue
      )
    `);

    stmt.run({
      id,
      dateLogged,
      businessName: data.businessName,
      contactName: data.contactName,
      phone: data.phone,
      city: data.city || "",
      businessType: data.businessType || "General",
      source: data.source || "Direct",
      need: data.need || "",
      status: data.status || "New",
      lastContacted: data.lastContacted || dateLogged,
      nextFollowUp: data.nextFollowUp || dateLogged,
      notes: data.notes || "",
      assignedToId: data.assignedToId || null,
      assignedToName: data.assignedToName || "Unassigned",
      estimatedValue: data.estimatedValue || 0
    });

    const created = db.prepare("SELECT * FROM leads WHERE id = ?").get(id);
    res.status(201).json(created);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Leads: Update existing lead
app.put("/api/leads/:id", (req, res) => {
  const { id } = req.params;
  const data = req.body;

  try {
    const stmt = db.prepare(`
      UPDATE leads SET
        dateLogged = @dateLogged,
        businessName = @businessName,
        contactName = @contactName,
        phone = @phone,
        city = @city,
        businessType = @businessType,
        source = @source,
        need = @need,
        status = @status,
        lastContacted = @lastContacted,
        nextFollowUp = @nextFollowUp,
        notes = @notes,
        assignedToId = @assignedToId,
        assignedToName = @assignedToName,
        estimatedValue = @estimatedValue
      WHERE id = @id
    `);

    const result = stmt.run({ ...data, id });
    if (result.changes === 0) {
      return res.status(404).json({ error: "Lead not found" });
    }

    const updated = db.prepare("SELECT * FROM leads WHERE id = ?").get(id);
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Leads: Quick status update
app.patch("/api/leads/:id/status", (req, res) => {
  const { id } = req.params;
  const { status, lastContacted, notes } = req.body;

  try {
    const today = new Date().toISOString().split("T")[0];
    const stmt = db.prepare(`
      UPDATE leads SET
        status = ?,
        lastContacted = ?,
        notes = CASE WHEN ? IS NOT NULL THEN ? ELSE notes END
      WHERE id = ?
    `);

    stmt.run(status, lastContacted || today, notes, notes, id);
    const updated = db.prepare("SELECT * FROM leads WHERE id = ?").get(id);
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Leads: Append note
app.post("/api/leads/:id/notes", (req, res) => {
  const { id } = req.params;
  const { notes } = req.body;

  try {
    const stmt = db.prepare("UPDATE leads SET notes = ? WHERE id = ?");
    stmt.run(notes, id);
    const updated = db.prepare("SELECT * FROM leads WHERE id = ?").get(id);
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Leads: Delete lead
app.delete("/api/leads/:id", (req, res) => {
  const { id } = req.params;
  try {
    const result = db.prepare("DELETE FROM leads WHERE id = ?").run(id);
    if (result.changes === 0) {
      return res.status(404).json({ error: "Lead not found" });
    }
    res.json({ success: true, id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Reset / Clean database endpoint
app.post("/api/reset", (req, res) => {
  try {
    db.exec("DELETE FROM leads; DELETE FROM users;");
    
    // Seed primary administrator
    const insertUser = db.prepare(`
      INSERT INTO users (id, name, email, password, role, status, avatar, title)
      VALUES (@id, @name, @email, @password, @role, @status, @avatar, @title)
    `);
    const insertManyUsers = db.transaction((users) => {
      for (const u of users) insertUser.run(u);
    });
    insertManyUsers(INITIAL_USERS);

    // If any initial leads exist, insert them
    if (INITIAL_LEADS && INITIAL_LEADS.length > 0) {
      const insertLead = db.prepare(`
        INSERT INTO leads (
          id, dateLogged, businessName, contactName, phone, city,
          businessType, source, need, status, lastContacted,
          nextFollowUp, notes, assignedToId, assignedToName, estimatedValue
        ) VALUES (
          @id, @dateLogged, @businessName, @contactName, @phone, @city,
          @businessType, @source, @need, @status, @lastContacted,
          @nextFollowUp, @notes, @assignedToId, @assignedToName, @estimatedValue
        )
      `);
      const insertManyLeads = db.transaction((leads) => {
        for (const l of leads) insertLead.run(l);
      });
      insertManyLeads(INITIAL_LEADS);
    }

    res.json({ success: true, message: "Database reset to clean production state (0 leads, 1 Admin)" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Serve frontend build if dist folder exists
const distPath = path.join(__dirname, "../dist");
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.use((req, res, next) => {
    if (req.path.startsWith("/api")) return next();
    res.sendFile(path.join(distPath, "index.html"));
  });
}

app.listen(PORT, "0.0.0.0", () => {
  const ip = getLocalNetworkIP();
  console.log(`=======================================================`);
  console.log(`[SnoYC Lead Backend] Central SQLite API Server Running!`);
  console.log(`- Local:    http://localhost:${PORT}`);
  console.log(`- Wi-Fi/LAN: http://${ip}:${PORT}`);
  console.log(`- Frontend: http://${ip}:5173 (for team member devices)`);
  console.log(`=======================================================`);
});
