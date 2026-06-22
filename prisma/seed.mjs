import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const employers = [
  ["OpenAI", "greenhouse", "openai", "https://openai.com/careers", 5],
  ["Anthropic", "greenhouse", "anthropic", "https://www.anthropic.com/careers", 5],
  ["Microsoft", "unsupported", null, "https://jobs.careers.microsoft.com", 4],
  ["Amazon", "unsupported", null, "https://www.amazon.jobs", 3],
  ["Google", "unsupported", null, "https://www.google.com/about/careers", 4],
  ["NVIDIA", "unsupported", null, "https://www.nvidia.com/en-us/about-nvidia/careers", 4],
  ["Meta", "unsupported", null, "https://www.metacareers.com", 3],
  ["Apple", "unsupported", null, "https://jobs.apple.com", 3]
];

async function main() {
  const user = await prisma.user.upsert({
    where: { email: "demo@jobfinder.ai" },
    update: {},
    create: { email: "demo@jobfinder.ai", name: "Demo Software Engineer" }
  });

  await prisma.userProfile.upsert({
    where: { userId: user.id },
    update: {
      headline: "Full-stack software engineer targeting AI product teams",
      skills: ["TypeScript", "React", "Next.js", "PostgreSQL", "Python", "Prisma", "OpenAI"],
      desiredTitles: ["Software Engineer", "Full Stack Engineer", "Product Engineer"],
      preferredLocations: ["Remote", "San Francisco", "New York"],
      workMode: "remote",
      needsSponsorship: false,
      seniority: "mid"
    },
    create: {
      userId: user.id,
      headline: "Full-stack software engineer targeting AI product teams",
      skills: ["TypeScript", "React", "Next.js", "PostgreSQL", "Python", "Prisma", "OpenAI"],
      desiredTitles: ["Software Engineer", "Full Stack Engineer", "Product Engineer"],
      preferredLocations: ["Remote", "San Francisco", "New York"],
      workMode: "remote",
      needsSponsorship: false,
      seniority: "mid"
    }
  });

  await prisma.resume.upsert({
    where: { id: "demo-resume" },
    update: {
      content:
        "Full-stack software engineer with TypeScript, React, Next.js, PostgreSQL, Python, Prisma, and OpenAI API experience. Built production web applications and workflow automation."
    },
    create: {
      id: "demo-resume",
      userId: user.id,
      title: "Demo resume",
      content:
        "Full-stack software engineer with TypeScript, React, Next.js, PostgreSQL, Python, Prisma, and OpenAI API experience. Built production web applications and workflow automation."
    }
  });

  for (const [name, boardProvider, boardToken, careersUrl, priority] of employers) {
    const employer = await prisma.employer.upsert({
      where: { name },
      update: { boardProvider, boardToken, careersUrl },
      create: { name, boardProvider, boardToken, careersUrl }
    });

    await prisma.userEmployerPreference.upsert({
      where: { userId_employerId: { userId: user.id, employerId: employer.id } },
      update: { priority },
      create: { userId: user.id, employerId: employer.id, priority }
    });
  }

  console.log("Seeded realistic software engineer demo user and target employers.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
