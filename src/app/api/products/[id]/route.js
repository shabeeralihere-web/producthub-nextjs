import { cookies } from "next/headers";

const BACKEND_URL = process.env.BACKEND_URL;

export async function PUT(request, { params }) {
  try {
    const { id } = await params;

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

    const formData = await request.formData();

    const response = await fetch(
      `${BACKEND_URL}/api/products/updateProduct/${id}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      }
    );

    const result = await response.json();

    return Response.json(result, {
      status: response.status,
    });
  } catch (error) {
    console.error("UPDATE PRODUCT ERROR:", error);

    return Response.json(
      {
        success: false,
        message: "Unable to update product",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;

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

    const response = await fetch(
      `${BACKEND_URL}/api/products/deleteProduct/${id}`,
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
    console.error("DELETE PRODUCT ERROR:", error);

    return Response.json(
      {
        success: false,
        message: "Unable to delete product",
      },
      { status: 500 }
    );
  }
}