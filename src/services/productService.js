
import { cookies } from "next/headers";

const BACKEND_URL = process.env.BACKEND_URL;

async function getAuthHeaders() {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;

  return token
    ? { Authorization: `Bearer ${token}` }
    : {};
}

async function parseResponse(response, fallbackMessage) {
  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message || fallbackMessage
    );
  }

  return result;
}

export async function getProducts({
  page = 1,
  limit = 8,
  search = "",
} = {}) {
  const headers = await getAuthHeaders();

  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });

  if (search) {
    params.set("search", search);
  }

  const response = await fetch(
    `${BACKEND_URL}/api/products/getProducts?${params.toString()}`,
    {
      headers,
      cache: "no-store",
    }
  );

  return parseResponse(
    response,
    "Failed to fetch products"
  );
}

export async function getProductById(id) {
  const response = await fetch(
    `${BACKEND_URL}/api/products/getProduct/${id}`,
    {
      cache: "no-store",
    }
  );

  const result = await parseResponse(
    response,
    "Failed to fetch product"
  );

  return result.data;
}

export async function getMyProducts({
  page = 1,
  limit = 6,
} = {}) {
  const headers = await getAuthHeaders();

  if (!headers.Authorization) {
    throw new Error("Authentication required");
  }

  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });

  const response = await fetch(
    `${BACKEND_URL}/api/products/my-products?${params.toString()}`,
    {
      headers,
      cache: "no-store",
    }
  );

  return parseResponse(
    response,
    "Failed to fetch your products"
  );
}

export async function getFeaturedProducts() {
  const response = await fetch(
    `${BACKEND_URL}/api/products/featured`,
    {
      cache: "no-store",
    }
  );

  return parseResponse(
    response,
    "Failed to fetch featured products"
  );
}
