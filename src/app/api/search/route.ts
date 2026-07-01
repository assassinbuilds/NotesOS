import { NextResponse } from "next/server";
import { searchNotes } from "@/lib/search";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q") || "";
  const subject = searchParams.get("subject");
  const semester = searchParams.get("semester");
  const sort = searchParams.get("sort");
  const limit = parseInt(searchParams.get("limit") || "20");
  const offset = parseInt(searchParams.get("offset") || "0");

  try {
    // Build filter string
    const filters: string[] = ['status = "PUBLISHED"'];
    if (subject) filters.push(`subject = "${subject}"`);
    if (semester) filters.push(`semester = ${semester}`);

    // Build sort
    const sortArr: string[] = [];
    if (sort) sortArr.push(sort);

    const results = await searchNotes(q, {
      filter: filters.join(" AND "),
      sort: sortArr.length > 0 ? sortArr : undefined,
      limit,
      offset,
    });

    return NextResponse.json({
      hits: results.hits,
      totalHits: results.estimatedTotalHits,
      processingTimeMs: results.processingTimeMs,
    });
  } catch (error) {
    console.warn("Meilisearch not available, falling back to database query:", error);
    
    try {
      // Build Prisma Query Fallback
      const whereClause: any = {
        status: "PUBLISHED",
      };

      if (q.trim()) {
        whereClause.OR = [
          { title: { contains: q, mode: "insensitive" } },
          { description: { contains: q, mode: "insensitive" } },
          { subject: { contains: q, mode: "insensitive" } },
          { tags: { has: q } },
        ];
      }

      if (subject) {
        whereClause.subject = subject;
      }

      if (semester) {
        whereClause.semester = parseInt(semester);
      }

      // Handle Sorting
      let orderBy: any = { createdAt: "desc" };
      if (sort === "downloads:desc") {
        orderBy = { downloads: "desc" };
      } else if (sort === "views:desc") {
        orderBy = { views: "desc" };
      }

      const [notes, total] = await Promise.all([
        prisma.note.findMany({
          where: whereClause,
          include: {
            author: { select: { name: true } },
          },
          orderBy,
          skip: offset,
          take: limit,
        }),
        prisma.note.count({ where: whereClause }),
      ]);

      // Map Prisma notes to same interface expected by Search Page hits
      const hits = notes.map((note) => ({
        id: note.id,
        title: note.title,
        description: note.description || undefined,
        subject: note.subject,
        semester: note.semester || undefined,
        university: note.university || undefined,
        authorName: note.author.name,
        downloads: note.downloads,
        views: note.views,
        fileSize: note.fileSize,
        pageCount: note.pageCount || undefined,
        createdAt: note.createdAt.getTime(),
      }));

      return NextResponse.json({
        hits,
        totalHits: total,
        processingTimeMs: 0,
      });
    } catch (dbError) {
      console.error("Database search fallback failed:", dbError);
      return NextResponse.json({ hits: [], totalHits: 0, processingTimeMs: 0 });
    }
  }
}
