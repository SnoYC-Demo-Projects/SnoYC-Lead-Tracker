import { INITIAL_USERS, INITIAL_LEADS } from "../data/mockData";

const USERS_KEY = "snoyc_lead_users_v1";
const LEADS_KEY = "snoyc_lead_leads_v1";
const CURRENT_USER_KEY = "snoyc_lead_current_user_v1";

// Load or seed users
export function getUsers() {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    if (!raw) {
      localStorage.setItem(USERS_KEY, JSON.stringify(INITIAL_USERS));
      return INITIAL_USERS;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error("Error reading users from localStorage", e);
    return INITIAL_USERS;
  }
}

export function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

// Load or seed leads
export function getLeads() {
  try {
    const raw = localStorage.getItem(LEADS_KEY);
    if (!raw) {
      localStorage.setItem(LEADS_KEY, JSON.stringify(INITIAL_LEADS));
      return INITIAL_LEADS;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error("Error reading leads from localStorage", e);
    return INITIAL_LEADS;
  }
}

export function saveLeads(leads) {
  localStorage.setItem(LEADS_KEY, JSON.stringify(leads));
}

// Current auth session
export function getCurrentUser() {
  try {
    const raw = localStorage.getItem(CURRENT_USER_KEY);
    if (!raw) {
      // Default to Admin Alex Rivera on initial launch so the user immediately sees the rich dashboard!
      const defaultUser = INITIAL_USERS[0];
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(defaultUser));
      return defaultUser;
    }
    return JSON.parse(raw);
  } catch (e) {
    return INITIAL_USERS[0];
  }
}

export function setCurrentUser(user) {
  if (user) {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(CURRENT_USER_KEY);
  }
}

// Reset all storage back to default mock data
export function resetStorage() {
  localStorage.setItem(USERS_KEY, JSON.stringify(INITIAL_USERS));
  localStorage.setItem(LEADS_KEY, JSON.stringify(INITIAL_LEADS));
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(INITIAL_USERS[0]));
  return { users: INITIAL_USERS, leads: INITIAL_LEADS, currentUser: INITIAL_USERS[0] };
}
