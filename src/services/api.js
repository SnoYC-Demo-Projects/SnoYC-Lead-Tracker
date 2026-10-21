// Central API Client connecting to Express + SQLite backend
const API_BASE = "/api";

export const api = {
  // Network Info & Share link
  async getNetworkInfo() {
    try {
      const res = await fetch(`${API_BASE}/network-info`);
      if (!res.ok) throw new Error("Failed to fetch network info");
      return await res.json();
    } catch (err) {
      console.warn("Using fallback localhost network info", err);
      return {
        localIp: "localhost",
        vitePort: 5173,
        shareUrl: "http://localhost:5173/"
      };
    }
  },

  // Users
  async getUsers() {
    try {
      const res = await fetch(`${API_BASE}/users`);
      if (!res.ok) throw new Error("Failed to fetch users");
      return await res.json();
    } catch (err) {
      console.error("API Error fetching users:", err);
      return null;
    }
  },

  async login(email, password) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });
    return await res.json();
  },

  async register(registrationData) {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(registrationData)
    });
    return await res.json();
  },

  async updateUserStatus(id, status) {
    const res = await fetch(`${API_BASE}/users/${encodeURIComponent(id)}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status })
    });
    if (!res.ok) throw new Error("Failed to update user status");
    return await res.json();
  },

  async updateProfile(id, profileData) {
    const res = await fetch(`${API_BASE}/users/${encodeURIComponent(id)}/profile`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(profileData)
    });
    return await res.json();
  },

  async deleteUser(id) {
    const res = await fetch(`${API_BASE}/users/${encodeURIComponent(id)}`, {
      method: "DELETE"
    });
    if (!res.ok) throw new Error("Failed to delete user");
    return await res.json();
  },

  async createUser(userData) {
    const res = await fetch(`${API_BASE}/users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData)
    });
    if (!res.ok) throw new Error("Failed to create team member");
    return await res.json();
  },

  // Leads
  async getLeads() {
    try {
      const res = await fetch(`${API_BASE}/leads`);
      if (!res.ok) throw new Error("Failed to fetch leads");
      return await res.json();
    } catch (err) {
      console.error("API Error fetching leads:", err);
      return null;
    }
  },

  async createLead(leadData) {
    const res = await fetch(`${API_BASE}/leads`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(leadData)
    });
    if (!res.ok) throw new Error("Failed to create lead");
    return await res.json();
  },

  async updateLead(id, leadData) {
    const res = await fetch(`${API_BASE}/leads/${encodeURIComponent(id)}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(leadData)
    });
    if (!res.ok) throw new Error("Failed to update lead");
    return await res.json();
  },

  async updateLeadStatus(id, status, lastContacted, notes) {
    const res = await fetch(`${API_BASE}/leads/${encodeURIComponent(id)}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, lastContacted, notes })
    });
    if (!res.ok) throw new Error("Failed to update lead status");
    return await res.json();
  },

  async appendLeadNotes(id, notes) {
    const res = await fetch(`${API_BASE}/leads/${encodeURIComponent(id)}/notes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ notes })
    });
    if (!res.ok) throw new Error("Failed to save note");
    return await res.json();
  },

  async deleteLead(id) {
    const res = await fetch(`${API_BASE}/leads/${encodeURIComponent(id)}`, {
      method: "DELETE"
    });
    if (!res.ok) throw new Error("Failed to delete lead");
    return await res.json();
  },

  async resetDatabase() {
    const res = await fetch(`${API_BASE}/reset`, {
      method: "POST"
    });
    if (!res.ok) throw new Error("Failed to reset database");
    return await res.json();
  }
};
