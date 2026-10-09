import { createOrder } from "@/services/orderService";

export async function POST(request) {
  try {
    const body = await request.json();

    const result = await createOrder(body);

    return Response.json(result, {
      status: 201,
    });
  } catch (error) {
    return Response.json(
      {
        success: false,
        message: error.message || "Unable to create order",
        errors: error.errors || null,
      },
      {
        status: error.status || 500,
      }
    );
  }
}