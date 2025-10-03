const BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5001";
export const verifyToken = async () => {
  try {
    const response = await fetch(`${BASE_URL}/api/auth/verify`, {
      method: 'GET',
      credentials: 'include', // ✅ Sends the cookie (with token)
    });

    return response.ok; // True if token is valid
  } catch (error) {
    console.error('Error verifying token:', error);
    return false;
  }
};