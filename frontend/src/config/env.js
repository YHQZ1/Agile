const DEFAULT_BACKEND_URL = "http://localhost:5001";

const normalizeUrl = (value) => {
  if (!value) return value;
  return value.endsWith("/") ? value.slice(0, -1) : value;
};

export const BACKEND_URL = normalizeUrl(
  import.meta.env.VITE_BACKEND_URL || DEFAULT_BACKEND_URL
);

export const SUPABASE_URL = normalizeUrl(import.meta.env.VITE_SUPABASE_URL || "");
export const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || "";
