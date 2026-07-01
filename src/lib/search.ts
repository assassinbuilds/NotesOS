import { Meilisearch } from "meilisearch";

const client = new Meilisearch({
  host: process.env.MEILISEARCH_HOST || "http://localhost:7700",
  apiKey: process.env.MEILISEARCH_API_KEY || "",
});

const NOTES_INDEX = "notes";

export async function initSearchIndex() {
  const index = client.index(NOTES_INDEX);

  await index.updateSettings({
    searchableAttributes: ["title", "description", "subject", "tags", "university"],
    filterableAttributes: ["subject", "semester", "university", "categoryId", "authorId", "status"],
    sortableAttributes: ["createdAt", "downloads", "views"],
    typoTolerance: {
      enabled: true,
      minWordSizeForTypos: { oneTypo: 3, twoTypos: 6 },
    },
  });

  return index;
}

export async function indexNote(note: {
  id: string;
  title: string;
  description?: string | null;
  subject: string;
  semester?: number | null;
  university?: string | null;
  tags: string[];
  categoryId: string;
  authorId: string;
  authorName: string;
  downloads: number;
  views: number;
  status: string;
  createdAt: Date;
  thumbnailUrl?: string | null;
  fileSize: number;
  pageCount?: number | null;
}) {
  const index = client.index(NOTES_INDEX);
  await index.addDocuments([
    {
      ...note,
      createdAt: note.createdAt.getTime(),
    },
  ]);
}

export async function removeNoteFromIndex(noteId: string) {
  const index = client.index(NOTES_INDEX);
  await index.deleteDocument(noteId);
}

export async function searchNotes(
  query: string,
  options?: {
    filter?: string;
    sort?: string[];
    limit?: number;
    offset?: number;
  }
) {
  const index = client.index(NOTES_INDEX);
  return index.search(query, {
    filter: options?.filter,
    sort: options?.sort,
    limit: options?.limit || 20,
    offset: options?.offset || 0,
    attributesToHighlight: ["title", "description"],
    highlightPreTag: '<mark class="search-highlight">',
    highlightPostTag: "</mark>",
  });
}

export { client as meiliClient };
