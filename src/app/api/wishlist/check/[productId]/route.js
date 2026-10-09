import { getAccessToken } from "@/lib/auth";

const BACKEND_URL =
  process.env.BACKEND_URL;

export async function GET(
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
          isWishlisted: false,
        },
        { status: 401 }
      );
    }

    const { productId } =
      await params;

    const response = await fetch(
      `${BACKEND_URL}/api/wishlist/check/${productId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
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
        isWishlisted: false,
      },
      { status: 500 }
    );
  }
}