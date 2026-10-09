import { cookies } from "next/headers";

const BACKEND_URL = process.env.BACKEND_URL;

export async function DELETE() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;

    if (!token) {
      return Response.json(
        {
          success: false,
          message: "Authentication required",
        },
        { status: 401 }
      );
    }

    const response = await fetch(`${BACKEND_URL}/api/cart/clear`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await response.json();

    return Response.json(result, {
      status: response.status,
    });
  } catch (error) {
    return Response.json(
      {
        success: false,
        message: "Unable to clear cart",
      },
      { status: 500 }
    );
  }
}