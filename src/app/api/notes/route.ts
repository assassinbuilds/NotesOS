import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { uploadFile, generateFileKey } from "@/lib/storage";
import { indexNote } from "@/lib/search";

// GET /api/notes - List notes
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const subject = searchParams.get("subject");
    const semester = searchParams.get("semester");
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = { status: "PUBLISHED" };
    if (subject) where.subject = subject;
    if (semester) where.semester = parseInt(semester);

    const [notes, total] = await Promise.all([
      prisma.note.findMany({
        where,
        include: {
          author: { select: { id: true, name: true, image: true } },
          category: { select: { name: true, slug: true } },
          _count: { select: { likes: true, comments: true, bookmarks: true } },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.note.count({ where }),
    ]);

    return NextResponse.json({
      notes,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error("Error fetching notes:", error);
    return NextResponse.json({ error: "Failed to fetch notes" }, { status: 500 });
  }
}

// POST /api/notes - Upload a note
export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const externalUrl = formData.get("externalUrl") as string | null;
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const subject = formData.get("subject") as string;
    const semesterStr = formData.get("semester") as string;
    const university = formData.get("university") as string;
    const tagsStr = formData.get("tags") as string;

    if (!title || !subject) {
      return NextResponse.json({ error: "Title and subject are required." }, { status: 400 });
    }

    if (!file && !externalUrl) {
      return NextResponse.json({ error: "Please upload a PDF file or provide a Google Drive / external link." }, { status: 400 });
    }

    let fileUrl = "";
    let fileKey = "";
    let fileSize = 0;
    let thumbnailUrl: string | null = null;

    if (externalUrl) {
      // External link mode (e.g. Google Drive)
      fileUrl = externalUrl.trim();
      fileKey = "external";
      
      // If a cover image is uploaded
      if (file) {
        if (!file.type.startsWith("image/")) {
          return NextResponse.json({ error: "Cover file must be an image (PNG, JPEG, WebP)." }, { status: 400 });
        }
        if (file.size > 5 * 1024 * 1024) {
          return NextResponse.json({ error: "Cover image must be under 5MB." }, { status: 400 });
        }
        const imgBuffer = Buffer.from(await file.arrayBuffer());
        const imgKey = generateFileKey(session.user.id, `cover-${file.name}`);
        thumbnailUrl = await uploadFile(imgBuffer, imgKey, file.type);
        fileSize = file.size;
      }
    } else if (file) {
      // Direct PDF upload mode
      if (file.type !== "application/pdf") {
        return NextResponse.json({ error: "Only PDF files are allowed." }, { status: 400 });
      }
      if (file.size > 4 * 1024 * 1024) {
        return NextResponse.json({ error: "File size must be under 4MB." }, { status: 400 });
      }

      const fileBuffer = Buffer.from(await file.arrayBuffer());
      const key = generateFileKey(session.user.id, file.name);
      fileUrl = await uploadFile(fileBuffer, key, file.type);
      fileKey = key;
      fileSize = file.size;
    }

    const tags = tagsStr ? JSON.parse(tagsStr) : [];
    const semester = semesterStr ? parseInt(semesterStr) : null;

    // Get or create category based on subject
    let category = await prisma.category.findFirst({
      where: { name: subject },
    });

    if (!category) {
      category = await prisma.category.create({
        data: {
          name: subject,
          slug: subject.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        },
      });
    }

    // Create note in database
    const note = await prisma.note.create({
      data: {
        title,
        description: description || null,
        subject,
        semester,
        university: university || null,
        tags,
        fileUrl,
        fileKey,
        fileSize,
        thumbnailUrl,
        authorId: session.user.id,
        categoryId: category.id,
      },
      include: {
        author: { select: { id: true, name: true } },
      },
    });

    // Index in Meilisearch (background - don't block response)
    indexNote({
      id: note.id,
      title: note.title,
      description: note.description,
      subject: note.subject,
      semester: note.semester,
      university: note.university,
      tags: note.tags,
      categoryId: note.categoryId,
      authorId: note.authorId,
      authorName: note.author.name,
      downloads: 0,
      views: 0,
      status: note.status,
      createdAt: note.createdAt,
      fileSize: note.fileSize,
      pageCount: note.pageCount,
      thumbnailUrl: note.thumbnailUrl,
    }).catch(console.error);

    return NextResponse.json({ note }, { status: 201 });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Upload failed." }, { status: 500 });
  }
}
