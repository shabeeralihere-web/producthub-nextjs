import { getAccessToken } from "@/lib/auth";

const BACKEND_URL =
  process.env.BACKEND_URL;

export async function DELETE(
  request,
  { params }
) {
  try {
    const token =
      await getAccessToken();

    if (!token) {
      return Response.json(
        {
          success: false,
          message:
            "Authentication required",
        },
        { status: 401 }
      );
    }

    const { productId } =
      await params;

    const response = await fetch(
      `${BACKEND_URL}/api/wishlist/remove/${productId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const result =
      await response.json();

    return Response.json(result, {
      status: response.status,
    });
  } catch (error) {
    return Response.json(
      {
        success: false,
        message:
          "Unable to remove product from wishlist",
      },
      { status: 500 }
    );
  }
}   