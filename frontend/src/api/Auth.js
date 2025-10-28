const BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5001";

export const login = async ({ email, password }) => {
  const response = await fetch(`${BASE_URL}/api/auth/login`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();
  if (!response.ok) {
    const message = data?.message || "Unable to login";
    throw new Error(message);
  }
  return data;
};

export const signup = async ({ email, password, role = "student" }) => {
  const response = await fetch(`${BASE_URL}/api/auth/signup`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password, role }),
  });

  const data = await response.json();
  if (!response.ok) {
    const message = data?.message || "Unable to sign up";
    throw new Error(message);
  }
  return data;
};

export const verifySession = async () => {
  try {
    const response = await fetch(`${BASE_URL}/api/auth/verify`, {
      method: "GET",
      credentials: "include",
    });

    if (!response.ok) {
      return { authenticated: false, user: null };
    }

    const data = await response.json();
    return { authenticated: true, user: data?.user || null };
  } catch (error) {
    console.error("Error verifying token:", error);
    return { authenticated: false, user: null };
  }
};

export const verifyToken = async () => {
  const result = await verifySession();
  return result.authenticated;
};

export const logout = async () => {
  // Clearing cookie requires backend support; until endpoint exists just return.
  return Promise.resolve();
};