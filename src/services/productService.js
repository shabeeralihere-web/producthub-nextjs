import { getAccessToken } from "@/lib/auth";

const BACKEND_URL = process.env.BACKEND_URL;

export async function getProducts({
  page = 1,
  limit = 8,
  search = "",
} = {}) {
  const token = await getAccessToken();

  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });

  if (search) {
    params.set("search", search);
  }

  const headers = {};

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(
    `${BACKEND_URL}/api/products/getProducts?${params.toString()}`,
    {
      headers,
      cache: "no-store",
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message || "Failed to fetch products"
    );
  }

  return result;
}

export async function getProductById(id) {
  const response = await fetch(
    `${BACKEND_URL}/api/products/getProduct/${id}`,
    {
      cache: "no-store",
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message || "Failed to fetch product"
    );
  }

  return result.data;
}

export async function getMyProducts({
  page = 1,
  limit = 6,
} = {}) {
  const token = await getAccessToken();

  if (!token) {
    throw new Error("Authentication required");
  }

  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });

  const response = await fetch(
    `${BACKEND_URL}/api/products/my-products?${params.toString()}`,
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
      result.message || "Failed to fetch your products"
    );
  }

  return result;
}

export async function getFeaturedProducts() {
  const response = await fetch(
    `${BACKEND_URL}/api/products/featured`,
    {
      cache: "no-store",
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message || "Failed to fetch featured products"
    );
  }

  return result;
}