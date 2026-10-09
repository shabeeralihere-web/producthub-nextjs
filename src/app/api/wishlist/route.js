import { getAccessToken } from "@/lib/auth";

const BACKEND_URL =
  process.env.BACKEND_URL;

export async function GET() {
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

    return Response.json(result, {
      status: response.status,
    });
  } catch (error) {
    return Response.json(
      {
        success: false,
        message:
          "Unable to fetch wishlist",
      },
      { status: 500 }
    );
  }
}

export async function POST(request) {
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

    const body =
      await request.json();

    const response = await fetch(
      `${BACKEND_URL}/api/wishlist/add`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify(body),
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
          "Unable to add product to wishlist",
      },
      { status: 500 }
    );
  }
}



