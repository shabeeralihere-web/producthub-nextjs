const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export async function apiFetch(endpoint, options = {}) {
  const response = await fetch(`${API_URL}${endpoint}`, options);

  return response;
}