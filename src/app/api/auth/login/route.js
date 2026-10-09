import { cookies } from "next/headers";

const BACKEND_URL = process.env.BACKEND_URL;

export async function POST(request) {
  try {
    const body = await request.json();

    const response = await fetch(
      `${BACKEND_URL}/api/auth/login`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    );

    const result = await response.json();

    if (!response.ok) {
      return Response.json(result, {
        status: response.status,
      });
    }

    const cookieStore = await cookies();

    cookieStore.set(
      "accessToken",
      result.accessToken,
      {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24,
      }
    );

    return Response.json({
      success: true,
      message: result.message,
      data: result.data,
    });
  } catch (error) {
    return Response.json(
      {
        success: false,
        message: "Unable to login",
      },
      {
        status: 500,
      }
    );
  }
}