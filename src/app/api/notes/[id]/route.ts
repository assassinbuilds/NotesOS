import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/notes/[id] - Get a single note
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const exists = await prisma.note.findUnique({
      where: { id },
      select: { id: true, status: true },
    });

    if (!exists || exists.status === "REMOVED") {
      return NextResponse.json({ error: "Note not found" }, { status: 404 });
    }

    const note = await prisma.note.findUnique({
      where: { id },
      include: {
        author: { select: { id: true, name: true, image: true } },
        category: { select: { name: true, slug: true } },
        _count: { select: { likes: true, comments: true, bookmarks: true } },
      },
    });

    return NextResponse.json({ note });
  } catch (error) {
    console.error("Error fetching note:", error);
    return NextResponse.json({ error: "Failed to fetch note" }, { status: 500 });
  }
}
