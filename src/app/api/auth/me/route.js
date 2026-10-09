import { getCurrentUser } from "@/services/authService";

export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return Response.json(
        {
          success: false,
          message: "Not authenticated",
        },
        {
          status: 401,
        }
      );
    }

    return Response.json({
      success: true,
      data: user,
    });
  } catch (error) {
    return Response.json(
      {
        success: false,
        message: "Unable to get current user",
      },
      {
        status: 500,
      }
    );
  }
}