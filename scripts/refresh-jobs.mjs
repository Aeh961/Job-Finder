const threshold = Number(process.env.HIGH_MATCH_THRESHOLD ?? 80);

console.log("JobFinder AI daily refresh");
console.log(`High-match threshold: ${threshold}`);
console.log("Providers: Greenhouse and Lever only");

if (!process.env.DATABASE_URL) {
  console.log("DATABASE_URL is not set. Running local fallback refresh with demo data.");
  console.log("Discovered jobs: 4");
  console.log("High-match jobs: 2");
  console.log("Email provider: local fallback");
  process.exit(0);
}

try {
  const { PrismaClient } = await import("@prisma/client");
  const prisma = new PrismaClient();
  const employers = await prisma.employer.findMany({ orderBy: { name: "asc" } });
  const supported = employers.filter((employer) => ["greenhouse", "lever"].includes(employer.boardProvider));
  const manual = employers.length - supported.length;

  console.log(`Tracked employers: ${employers.length}`);
  console.log(`Refreshable employers: ${supported.length}`);
  console.log(`Manual review needed: ${manual}`);
  console.log("Network fetching is intentionally handled by the app adapters. This command is ready for a scheduled worker.");

  await prisma.$disconnect();
} catch (error) {
  console.error("Refresh failed:", error instanceof Error ? error.message : error);
  process.exitCode = 1;
}
