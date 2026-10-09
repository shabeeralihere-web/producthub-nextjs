import { cookies } from "next/headers";

const BACKEND_URL = process.env.BACKEND_URL;

export async function POST(request) {
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

    const formData = await request.formData();

    const response = await fetch(
      `${BACKEND_URL}/api/products/addProduct`,
      {
        method: "POST",
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
    console.error("ADD PRODUCT ERROR:", error);

    return Response.json(
      {
        success: false,
        message: "Unable to add product",
      },
      { status: 500 }
    );
  }
}