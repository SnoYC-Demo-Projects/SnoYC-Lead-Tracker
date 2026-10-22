import React, { useState, useEffect } from "react";
import { AuthContext } from "./auth-context-base";
import { getCurrentUser, setCurrentUser, getUsers, saveUsers } from "../utils/storage";
import { api } from "../services/api";

export function AuthProvider({ children }) {
  const [currentUser, setUserState] = useState(() => getCurrentUser());
  const [users, setUsersState] = useState(() => getUsers());

  const loadUsersFromAPI = async () => {
    try {
      const serverUsers = await api.getUsers();
      if (serverUsers && Array.isArray(serverUsers) && serverUsers.length > 0) {
        setUsersState(serverUsers);
        saveUsers(serverUsers);
        // Sync current user state if role or name changed
        if (currentUser) {
          const matched = serverUsers.find(u => u.id === currentUser.id);
          if (matched) {
            setUserState(matched);
            setCurrentUser(matched);
          }
        }
      }
    } catch (e) {
      console.warn("Could not reach users API, using local cache", e);
    }
  };

  useEffect(() => {
    loadUsersFromAPI();
  }, []);

  const login = async (email, password) => {
    try {
      const res = await api.login(email, password);
      if (res && res.success && res.user) {
        setUserState(res.user);
        setCurrentUser(res.user);
        return { success: true, user: res.user };
      }
      if (res && res.error) {
        return { success: false, error: res.error };
      }
    } catch (e) {
      console.warn("Server login request failed, falling back to cached check", e);
    }

    // Fallback check against local users
    const allUsers = users;
    const found = allUsers.find(
      u => u.email.toLowerCase() === email.trim().toLowerCase() && u.password === password
    );

    if (found) {
      if (found.status === "pending") {
        return { success: false, error: "Your registration is pending Admin approval. Please contact the administrator." };
      }
      if (found.status === "rejected") {
        return { success: false, error: "Your account registration was declined by the administrator." };
      }
      setUserState(found);
      setCurrentUser(found);
      return { success: true, user: found };
    }
    return { success: false, error: "Invalid email or password" };
  };

  const register = async (registrationData) => {
    try {
      const res = await api.register(registrationData);
      if (res && res.success) {
        await loadUsersFromAPI();
        return { success: true, message: res.message, user: res.user };
      }
      return { success: false, error: res?.error || "Registration failed" };
    } catch (err) {
      // Local fallback
      const newUser = {
        id: `user-${Date.now()}`,
        name: registrationData.name,
        email: registrationData.email,
        password: registrationData.password,
        role: "member",
        status: "pending",
        avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(registrationData.name)}`,
        title: registrationData.title || "Sales Representative"
      };
      setUsersState(prev => [...prev, newUser]);
      return { 
        success: true, 
        message: "Registration submitted! Your account is pending Admin approval.", 
        user: newUser 
      };
    }
  };

  const updateUserStatus = async (userId, newStatus) => {
    try {
      const updated = await api.updateUserStatus(userId, newStatus);
      if (updated) {
        setUsersState(prev => prev.map(u => u.id === userId ? { ...u, status: newStatus } : u));
        return { success: true, user: updated };
      }
    } catch (err) {
      console.warn("Failed to update status via API", err);
      setUsersState(prev => prev.map(u => u.id === userId ? { ...u, status: newStatus } : u));
    }
  };

  const deleteUser = async (userId) => {
    try {
      await api.deleteUser(userId);
      setUsersState(prev => prev.filter(u => u.id !== userId));
      return { success: true };
    } catch (err) {
      console.warn("Failed to delete user via API", err);
      setUsersState(prev => prev.filter(u => u.id !== userId));
    }
  };

  const updateProfile = async (id, profileData) => {
    try {
      const res = await api.updateProfile(id, profileData);
      if (res && res.success && res.user) {
        setUsersState(prev => prev.map(u => u.id === id ? { ...u, ...res.user } : u));
        if (currentUser?.id === id) {
          setUserState(res.user);
          setCurrentUser(res.user);
        }
        return { success: true, user: res.user };
      }
      return { success: false, error: res?.error || "Failed to update profile" };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const quickLoginAs = (user) => {
    setUserState(user);
    setCurrentUser(user);
  };

  const logout = () => {
    setUserState(null);
    setCurrentUser(null);
  };

  const addTeamMember = async (newMemberData) => {
    try {
      const created = await api.createUser(newMemberData);
      if (created) {
        setUsersState(prev => [...prev, created]);
        return created;
      }
    } catch (e) {
      console.warn("Failed to create on API, saving locally", e);
    }

    const newUser = {
      id: `user-${Date.now()}`,
      name: newMemberData.name,
      email: newMemberData.email,
      password: newMemberData.password || "user123",
      role: newMemberData.role || "member",
      status: "approved",
      avatar: newMemberData.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(newMemberData.name)}`,
      title: newMemberData.title || "Sales Representative"
    };
    const updated = [...users, newUser];
    setUsersState(updated);
    saveUsers(updated);
    return newUser;
  };

  const isAdmin = currentUser?.role === "admin";
  const isMember = currentUser?.role === "member";

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        users,
        isAdmin,
        isMember,
        login,
        register,
        updateUserStatus,
        deleteUser,
        loadUsersFromAPI,
        quickLoginAs,
        logout,
        addTeamMember,
        updateProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext };
export { useAuth } from "./useAuth";

