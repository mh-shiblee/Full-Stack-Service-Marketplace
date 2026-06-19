import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "VENDOR") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const vendor = await prisma.vendorProfile.findUnique({
    where: { userId: session.user.id },
  });

  if (!vendor) {
    return NextResponse.json(
      { error: "Vendor profile not found" },
      { status: 404 },
    );
  }

  const { title, description, price, categoryId, imageUrl } = await req.json();

  const service = await prisma.service.create({
    data: {
      title,
      description,
      price,
      categoryId,
      vendorId: vendor.id,
      imageUrl,
    },
  });

  return NextResponse.json({ service }, { status: 201 });
}
