import { cookies } from "next/headers";

const BACKEND_URL = process.env.BACKEND_URL;

export async function DELETE(request) {
  try {
    const body = await request.json();

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

    const response = await fetch(`${BACKEND_URL}/api/cart/remove`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    const result = await response.json();

    return Response.json(result, {
      status: response.status,
    });
  } catch (error) {
    return Response.json(
      {
        success: false,
        message: "Unable to remove item",
      },
      { status: 500 }
    );
  }
}