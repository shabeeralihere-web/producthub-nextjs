import { getAccessToken } from "@/lib/auth";

const BACKEND_URL = process.env.BACKEND_URL;

export async function getCart({
  page = 1,
} = {}) {
  const token = await getAccessToken();

  if (!token) {
    throw new Error("Authentication required");
  }

  const params = new URLSearchParams({
    page: String(page),
  });

  const response = await fetch(
    `${BACKEND_URL}/api/cart/?${params.toString()}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message || "Failed to fetch cart"
    );
  }

  return result;
}