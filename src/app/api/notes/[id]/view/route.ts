import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Await the update transaction to ensure immediate DB persist
    await prisma.note.update({
      where: { id },
      data: { views: { increment: 1 } },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error incrementing views:", error);
    return NextResponse.json({ error: "Failed to increment view" }, { status: 500 });
  }
}
