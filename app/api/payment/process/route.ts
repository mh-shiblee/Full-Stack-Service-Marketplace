import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const { orderId } = await req.json();

  const order = await prisma.order.findUnique({
    where: { id: orderId },
  });

  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  // Simulate payment processing
  const payment = await prisma.payment.create({
    data: {
      orderId,
      transactionId: `txn_${Date.now()}`,
      amount: order.totalAmount,
      status: "success",
      paymentMethod: "test_card",
    },
  });

  await prisma.order.update({
    where: { id: orderId },
    data: { status: "CONFIRMED" },
  });

  return NextResponse.json({ payment });
}
