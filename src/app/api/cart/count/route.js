import { getAccessToken } from "@/lib/auth";

const BACKEND_URL = process.env.BACKEND_URL;

export async function GET() {
  try {
    const token = await getAccessToken();

    if (!token) {
      return Response.json({ count: 0 });
    }

    const response = await fetch(`${BACKEND_URL}/api/cart/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    const result = await response.json();

    if (!response.ok) {
      return Response.json({ count: 0 });
    }

    const cartItems = result.data || [];

    const count = cartItems.reduce(
      (total, item) => total + Number(item.quantity || 0),
      0
    );

    return Response.json({ count });
  } catch (error) {
    console.error("Cart count error:", error);

    return Response.json({ count: 0 });
  }
}