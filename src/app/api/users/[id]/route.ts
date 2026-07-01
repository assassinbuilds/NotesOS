import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        bio: true,
        university: true,
        createdAt: true,
        _count: { select: { notes: true } },
        notes: {
          where: { status: "PUBLISHED" },
          select: {
            id: true,
            title: true,
            subject: true,
            views: true,
            downloads: true,
            createdAt: true,
          },
          orderBy: { createdAt: "desc" },
          take: 50,
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json({ error: "Failed to fetch user" }, { status: 500 });
  }
}
