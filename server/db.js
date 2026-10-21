import Database from "better-sqlite3";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { INITIAL_USERS, INITIAL_LEADS } from "../src/data/mockData.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure db directory exists
const dbDir = path.join(__dirname, "../data");
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const dbPath = path.join(dbDir, "leads.db");
export const db = new Database(dbPath);

// Enable WAL mode for better concurrency across multiple devices
db.pragma("journal_mode = WAL");

export function initDatabase() {
  // Create users table
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'approved',
      avatar TEXT,
      title TEXT
    );
  `);

  // Migrate existing users table if status column doesn't exist yet
  try {
    const cols = db.prepare("PRAGMA table_info(users)").all();
    if (!cols.some(c => c.name === "status")) {
      db.exec("ALTER TABLE users ADD COLUMN status TEXT DEFAULT 'approved'");
      console.log("[DB] Migrated: added 'status' column to users table");
    }
  } catch (err) {
    console.warn("[DB] Migration check:", err.message);
  }

  // Create leads table with all 13 specified fields + tracking fields
  db.exec(`
    CREATE TABLE IF NOT EXISTS leads (
      id TEXT PRIMARY KEY,
      dateLogged TEXT NOT NULL,
      businessName TEXT NOT NULL,
      contactName TEXT NOT NULL,
      phone TEXT NOT NULL,
      city TEXT NOT NULL,
      businessType TEXT,
      source TEXT,
      need TEXT,
      status TEXT NOT NULL DEFAULT 'New',
      lastContacted TEXT,
      nextFollowUp TEXT,
      notes TEXT,
      assignedToId TEXT,
      assignedToName TEXT,
      estimatedValue REAL DEFAULT 0,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Seed users if empty
  const userCount = db.prepare("SELECT count(*) as count FROM users").get().count;
  if (userCount === 0) {
    const insertUser = db.prepare(`
      INSERT INTO users (id, name, email, password, role, status, avatar, title)
      VALUES (@id, @name, @email, @password, @role, @status, @avatar, @title)
    `);

    const insertManyUsers = db.transaction((users) => {
      for (const u of users) insertUser.run(u);
    });

    insertManyUsers(INITIAL_USERS);
    console.log(`[DB] Seeded ${INITIAL_USERS.length} users into SQLite`);
  }

  // Seed leads if empty and INITIAL_LEADS has items
  const leadCount = db.prepare("SELECT count(*) as count FROM leads").get().count;
  if (leadCount === 0 && INITIAL_LEADS.length > 0) {
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
    console.log(`[DB] Seeded ${INITIAL_LEADS.length} leads into SQLite`);
  }

  console.log(`[DB] SQLite database initialized at: ${dbPath}`);
}
