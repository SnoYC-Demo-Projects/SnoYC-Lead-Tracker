// Central API Client connecting directly to Supabase Cloud PostgreSQL
import { supabase, isSupabaseConfigured } from "./supabaseClient";
import { INITIAL_USERS, INITIAL_LEADS } from "../data/mockData";

export const api = {
  // Provider / Connection status
  async getNetworkInfo() {
    return {
      provider: "Supabase Cloud Database",
      isConfigured: isSupabaseConfigured,
      shareUrl: typeof window !== "undefined" ? window.location.origin : "http://localhost:5173"
    };
  },

  // ==========================================
  // USERS & AUTHENTICATION
  // ==========================================

  async getUsers() {
    if (!isSupabaseConfigured || !supabase) return null;
    try {
      const { data, error } = await supabase
        .from("users")
        .select("id, name, email, role, status, avatar, title")
        .order("created_at", { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (err) {
      console.error("[Supabase] Error fetching users:", err.message);
      return null;
    }
  },

  async login(email, password) {
    if (!isSupabaseConfigured || !supabase) {
      return { fallback: true };
    }
    try {
      const cleanEmail = email.trim().toLowerCase();
      const { data: user, error } = await supabase
        .from("users")
        .select("*")
        .ilike("email", cleanEmail)
        .maybeSingle();

      if (error) throw error;
      if (!user) {
        return { success: false, error: "Invalid email address or account not found" };
      }

      // Check password
      const valid = user.password === password;
      if (!valid) {
        return { success: false, error: "Incorrect password" };
      }

      if (user.status === "pending") {
        return { success: false, error: "Your registration is pending Admin approval. Please contact the administrator." };
      }
      if (user.status === "rejected") {
        return { success: false, error: "Your account registration was declined by the administrator." };
      }

      return { success: true, user };
    } catch (err) {
      console.error("[Supabase] Login error:", err.message);
      return { success: false, error: err.message };
    }
  },

  async register(registrationData) {
    if (!isSupabaseConfigured || !supabase) {
      return { fallback: true };
    }
    try {
      const newUser = {
        id: `user-${Date.now()}`,
        name: registrationData.name,
        email: registrationData.email.trim().toLowerCase(),
        password: registrationData.password,
        role: "member",
        status: "pending",
        avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(registrationData.name)}`,
        title: registrationData.title || "Sales Representative"
      };

      const { data, error } = await supabase
        .from("users")
        .insert(newUser)
        .select()
        .single();

      if (error) {
        if (error.code === "23505") { // Unique violation
          return { success: false, error: "An account with this email already exists" };
        }
        throw error;
      }

      return { 
        success: true, 
        message: "Registration submitted! Your account is pending Admin approval.", 
        user: data 
      };
    } catch (err) {
      console.error("[Supabase] Registration error:", err.message);
      return { success: false, error: err.message };
    }
  },

  async createUser(userData) {
    if (!isSupabaseConfigured || !supabase) return null;
    try {
      const record = {
        id: userData.id || `user-${Date.now()}`,
        name: userData.name,
        email: userData.email.trim().toLowerCase(),
        password: userData.password || "user123",
        role: userData.role || "member",
        status: userData.status || "approved",
        avatar: userData.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(userData.name)}`,
        title: userData.title || "Sales Representative"
      };

      const { data, error } = await supabase
        .from("users")
        .insert(record)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (err) {
      console.error("[Supabase] Create user error:", err.message);
      return null;
    }
  },

  async updateUserStatus(id, status) {
    if (!isSupabaseConfigured || !supabase) return null;
    try {
      const { data, error } = await supabase
        .from("users")
        .update({ status })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (err) {
      console.error("[Supabase] Update user status error:", err.message);
      return null;
    }
  },

  async updateProfile(id, profileData) {
    if (!isSupabaseConfigured || !supabase) return { fallback: true };
    try {
      const { data, error } = await supabase
        .from("users")
        .update(profileData)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return { success: true, user: data };
    } catch (err) {
      console.error("[Supabase] Update profile error:", err.message);
      return { success: false, error: err.message };
    }
  },

  async deleteUser(id) {
    if (!isSupabaseConfigured || !supabase) return false;
    try {
      const { error } = await supabase
        .from("users")
        .delete()
        .eq("id", id);

      if (error) throw error;
      return true;
    } catch (err) {
      console.error("[Supabase] Delete user error:", err.message);
      return false;
    }
  },

  // ==========================================
  // LEADS (CRUD)
  // ==========================================

  async getLeads() {
    if (!isSupabaseConfigured || !supabase) return null;
    try {
      const { data, error } = await supabase
        .from("leads")
        .select("*")
        .order("createdAt", { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (err) {
      console.error("[Supabase] Error fetching leads:", err.message);
      return null;
    }
  },

  async createLead(leadData) {
    if (!isSupabaseConfigured || !supabase) return null;
    try {
      const newLead = {
        ...leadData,
        id: leadData.id || `lead-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        estimatedValue: Number(leadData.estimatedValue) || 0,
        createdAt: leadData.createdAt || new Date().toISOString()
      };

      const { data, error } = await supabase
        .from("leads")
        .insert(newLead)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (err) {
      console.error("[Supabase] Create lead error:", err.message);
      throw err;
    }
  },

  async updateLead(id, leadData) {
    if (!isSupabaseConfigured || !supabase) return null;
    try {
      const payload = {
        ...leadData,
        estimatedValue: Number(leadData.estimatedValue) || 0
      };

      const { data, error } = await supabase
        .from("leads")
        .update(payload)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (err) {
      console.error("[Supabase] Update lead error:", err.message);
      throw err;
    }
  },

  async updateLeadStatus(id, status, lastContacted, notes) {
    if (!isSupabaseConfigured || !supabase) return null;
    try {
      const updateFields = { status };
      if (lastContacted !== undefined) updateFields.lastContacted = lastContacted;
      if (notes !== undefined) updateFields.notes = notes;

      const { data, error } = await supabase
        .from("leads")
        .update(updateFields)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (err) {
      console.error("[Supabase] Update lead status error:", err.message);
      throw err;
    }
  },

  async appendLeadNotes(id, notes) {
    if (!isSupabaseConfigured || !supabase) return null;
    try {
      const { data, error } = await supabase
        .from("leads")
        .update({ notes })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (err) {
      console.error("[Supabase] Append notes error:", err.message);
      throw err;
    }
  },

  async deleteLead(id) {
    if (!isSupabaseConfigured || !supabase) return false;
    try {
      const { error } = await supabase
        .from("leads")
        .delete()
        .eq("id", id);

      if (error) throw error;
      return true;
    } catch (err) {
      console.error("[Supabase] Delete lead error:", err.message);
      throw err;
    }
  },

  // Reset / Clean database
  async resetDatabase() {
    if (!isSupabaseConfigured || !supabase) return { fallback: true };
    try {
      await supabase.from("leads").delete().neq("id", "none");
      await supabase.from("users").delete().neq("id", "user-admin");
      return { success: true };
    } catch (err) {
      console.error("[Supabase] Reset database error:", err.message);
      throw err;
    }
  },

  // Real-time subscription listener
  subscribeToLeads(onUpdate) {
    if (!isSupabaseConfigured || !supabase) return () => {};

    const channel = supabase
      .channel("leads-realtime-channel")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "leads" },
        (payload) => {
          if (typeof onUpdate === "function") {
            onUpdate(payload);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }
};
