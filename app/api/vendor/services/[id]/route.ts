import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "VENDOR") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const { id } = await params;

  const service = await prisma.service.findUnique({
    where: { id },
    include: { vendor: true },
  });

  if (!service || service.vendor.userId !== session.user.id) {
    return NextResponse.json({ error: "Service not found" }, { status: 404 });
  }

  return NextResponse.json(service);
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "VENDOR") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const { id } = await params;
  const { title, description, price, categoryId, imageUrl } = await req.json();

  const service = await prisma.service.findUnique({
    where: { id },
    include: { vendor: true },
  });

  if (!service || service.vendor.userId !== session.user.id) {
    return NextResponse.json({ error: "Service not found" }, { status: 404 });
  }

  const updated = await prisma.service.update({
    where: { id },
    data: { title, description, price, categoryId, imageUrl },
  });

  return NextResponse.json(updated);
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "VENDOR") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const { id } = await params;

  const service = await prisma.service.findUnique({
    where: { id },
    include: { vendor: true },
  });

  if (!service || service.vendor.userId !== session.user.id) {
    return NextResponse.json({ error: "Service not found" }, { status: 404 });
  }

  await prisma.service.delete({ where: { id } });

  return NextResponse.json({ message: "Service deleted" });
}
