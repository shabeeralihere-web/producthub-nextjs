import { getAccessToken } from "@/lib/auth";

const BACKEND_URL = process.env.BACKEND_URL;

async function getAuthHeaders() {
  const token = await getAccessToken();

  if (!token) {
    throw new Error("Authentication required");
  }

  return {
    Authorization: `Bearer ${token}`,
  };
}

export async function createOrder({
  deliveryAddress,
  paymentMethod,
}) {
  const headers = await getAuthHeaders();

  const response = await fetch(
    `${BACKEND_URL}/api/orders/create`,
    {
      method: "POST",
      headers: {
        ...headers,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        deliveryAddress,
        paymentMethod,
      }),
      cache: "no-store",
    }
  );

  const result = await response.json();

  if (!response.ok) {
    const error = new Error(
      result.message || "Failed to create order"
    );

    error.status = response.status;
    error.errors = result.errors;

    throw error;
  }

  return result;
}

export async function getMyOrders({
  page = 1,
  limit = 6,
} = {}) {
  const headers = await getAuthHeaders();

  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });

  const response = await fetch(
    `${BACKEND_URL}/api/orders/my-orders?${params.toString()}`,
    {
      headers,
      cache: "no-store",
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message || "Failed to fetch orders"
    );
  }

  return result;
}

export async function getOrderById(id) {
  const headers = await getAuthHeaders();

  const response = await fetch(
    `${BACKEND_URL}/api/orders/${id}`,
    {
      headers,
      cache: "no-store",
    }
  );

  const result = await response.json();

  if (!response.ok) {
    const error = new Error(
      result.message || "Failed to fetch order"
    );

    error.status = response.status;

    throw error;
  }

  return result;
}

export async function getSellerOrders({
  page = 1,
  limit = 6,
} = {}) {
  const headers = await getAuthHeaders();

  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });

  const response = await fetch(
    `${BACKEND_URL}/api/orders/seller?${params.toString()}`,
    {
      headers,
      cache: "no-store",
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message ||
        "Failed to fetch seller orders"
    );
  }

  return result;
}

export async function updateOrderItemStatus({
  orderId,
  itemId,
  status,
}) {
  const headers = await getAuthHeaders();

  const response = await fetch(
    `${BACKEND_URL}/api/orders/${orderId}/items/${itemId}/status`,
    {
      method: "PUT",
      headers: {
        ...headers,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        status,
      }),
      cache: "no-store",
    }
  );

  const result = await response.json();

  if (!response.ok) {
    const error = new Error(
      result.message ||
        "Failed to update order status"
    );

    error.status = response.status;

    throw error;
  }

  return result;
}

export async function getAdminOrders({
  page = 1,
  limit = 10,
} = {}) {
  const headers = await getAuthHeaders();

  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });

  const response = await fetch(
    `${BACKEND_URL}/api/orders/admin?${params.toString()}`,
    {
      headers,
      cache: "no-store",
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message ||
        "Failed to fetch admin orders"
    );
  }

  return result;
}

export async function getAdminOrderById(id) {
  const headers = await getAuthHeaders();

  const response = await fetch(
    `${BACKEND_URL}/api/orders/admin/${id}`,
    {
      headers,
      cache: "no-store",
    }
  );

  const result = await response.json();

  if (!response.ok) {
    const error = new Error(
      result.message ||
        "Failed to fetch order"
    );

    error.status = response.status;

    throw error;
  }

  return result;
}