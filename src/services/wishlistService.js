import { getAccessToken } from "@/lib/auth";

const BACKEND_URL =
  process.env.BACKEND_URL;

export async function getWishlist() {
  const token = await getAccessToken();

  if (!token) {
    return {
      success: false,
      data: [],
    };
  }

  try {
    const response = await fetch(
      `${BACKEND_URL}/api/wishlist`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      }
    );

    const result =
      await response.json();

    if (!response.ok) {
      return {
        success: false,
        data: [],
      };
    }

    return result;
  } catch (error) {
    return {
      success: false,
      data: [],
    };
  }
}