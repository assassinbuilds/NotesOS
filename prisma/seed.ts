import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

const connectionString = process.env.DATABASE_URL || "";
const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const initialCategories = [
  {
    name: "Computer Science",
    slug: "computer-science",
    icon: "Laptop",
    color: "#6366f1", // Indigo
  },
  {
    name: "Mathematics",
    slug: "mathematics",
    icon: "Calculator",
    color: "#f59e0b", // Amber
  },
  {
    name: "Physics",
    slug: "physics",
    icon: "Atom",
    color: "#ec4899", // Pink
  },
  {
    name: "Engineering",
    slug: "engineering",
    icon: "Cpu",
    color: "#10b981", // Emerald
  },
  {
    name: "Chemistry",
    slug: "chemistry",
    icon: "FlaskConical",
    color: "#06b6d4", // Cyan
  },
  {
    name: "Biology",
    slug: "biology",
    icon: "Dna",
    color: "#84cc16", // Lime
  },
  {
    name: "Business",
    slug: "business",
    icon: "Briefcase",
    color: "#3b82f6", // Blue
  },
  {
    name: "Law",
    slug: "law",
    icon: "Scale",
    color: "#8b5cf6", // Violet
  },
];

async function main() {
  console.log("Seeding categories...");
  for (const cat of initialCategories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {
        name: cat.name,
        icon: cat.icon,
        color: cat.color,
      },
      create: {
        name: cat.name,
        slug: cat.slug,
        icon: cat.icon,
        color: cat.color,
      },
    });
  }
  console.log("Seeding completed successfully.");
}

main()
  .catch((e) => {
    console.error("Error during seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
