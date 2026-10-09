import { getAccessToken } from "@/lib/auth";

const BACKEND_URL = process.env.BACKEND_URL;

export async function getCurrentUser() {
  const token = await getAccessToken();

  if (!token) {
    return null;
  }

  const response = await fetch(`${BACKEND_URL}/api/auth/profile`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    return null;
  }

  const result = await response.json();

  return result.data;
}