import { getAccessToken } from "@/lib/auth";

const BACKEND_URL = process.env.BACKEND_URL;

export async function PUT(request, { params }) {
  try {
    const token = await getAccessToken();

    if (!token) {
      return Response.json(
        {
          success: false,
          message: "Authentication required",
        },
        { status: 401 }
      );
    }

    const { id } = await params;
    const body = await request.json();

    const response = await fetch(
      `${BACKEND_URL}/api/addresses/${id}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    );

    const result = await response.json();

    return Response.json(result, {
      status: response.status,
    });
  } catch (error) {
    console.error("UPDATE ADDRESS API ERROR:", error);

    return Response.json(
      {
        success: false,
        message: "Unable to update address",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const token = await getAccessToken();

    if (!token) {
      return Response.json(
        {
          success: false,
          message: "Authentication required",
        },
        { status: 401 }
      );
    }

    const { id } = await params;

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

    return Response.json(result, {
      status: response.status,
    });
  } catch (error) {
    console.error("DELETE ADDRESS API ERROR:", error);

    return Response.json(
      {
        success: false,
        message: "Unable to delete address",
      },
      { status: 500 }
    );
  }
}