import { getAccessToken } from "@/lib/auth";

const BACKEND_URL = process.env.BACKEND_URL;

export async function getAddresses() {
  const token = await getAccessToken();

  if (!token) {
    throw new Error("Authentication required");
  }

  const response = await fetch(
    `${BACKEND_URL}/api/addresses`,
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
      result.message || "Failed to fetch addresses"
    );
  }

  return result;
}

export async function addAddress(addressData) {
  const token = await getAccessToken();

  if (!token) {
    throw new Error("Authentication required");
  }

  const response = await fetch(
    `${BACKEND_URL}/api/addresses`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(addressData),
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message || "Failed to save address"
    );
  }

  return result;
}

export async function updateAddress(id, addressData) {
  const token = await getAccessToken();

  if (!token) {
    throw new Error("Authentication required");
  }

  const response = await fetch(
    `${BACKEND_URL}/api/addresses/${id}`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(addressData),
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message || "Failed to update address"
    );
  }

  return result;
}

export async function deleteAddress(id) {
  const token = await getAccessToken();

  if (!token) {
    throw new Error("Authentication required");
  }

  const response = await fetch(
    `${BACKEND_URL}/api/addresses/${id}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message || "Failed to delete address"
    );
  }

  return result;
}