import { getAccessToken } from "@/lib/auth";

const BACKEND_URL = process.env.BACKEND_URL;

export async function getAllUsers() {
  const token = await getAccessToken();

  if (!token) {
    throw new Error("Authentication required");
  }

  const response = await fetch(`${BACKEND_URL}/api/auth/users`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to fetch users");
  }

  return result;
}

export async function getAllProducts({ page = 1, limit = 8 } = {}) {
  const token = await getAccessToken();

  if (!token) {
    throw new Error("Authentication required");
  }

  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });

  const response = await fetch(
    `${BACKEND_URL}/api/products/getProducts?${params.toString()}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to fetch products");
  }

  return result;
}