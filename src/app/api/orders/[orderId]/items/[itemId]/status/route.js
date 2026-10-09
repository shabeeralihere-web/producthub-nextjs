import { updateOrderItemStatus } from "@/services/orderService";

export async function PUT(request, { params }) {
  try {
    const { orderId, itemId } = await params;
    const body = await request.json();

    const result = await updateOrderItemStatus({
      orderId,
      itemId,
      status: body.status,
    });

    return Response.json(result);
  } catch (error) {
    return Response.json(
      {
        success: false,
        message:
          error.message || "Unable to update order status",
      },
      {
        status: error.status || 500,
      }
    );
  }
}