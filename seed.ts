import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool as any);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding system design problems...");

  const problems = [
    {
      title: "Design a Scalable URL Shortener",
      description: "Create a system like Bitly or TinyURL that can handle millions of requests per day.",
      complexity: "EASY",
      functionalReqs: [
        "Given a long URL, return a shorter unique alias.",
        "Redirect users to the original URL when they access the short link.",
        "Custom aliases should be supported.",
        "Links should have an expiration time."
      ],
      nonFunctionalReqs: [
        "The system should be highly available.",
        "URL redirection should happen with minimal latency.",
        "The short links should not be guessable."
      ]
    },
    {
      title: "Design a Real-time Chat System",
      description: "Build a chat application like WhatsApp or Slack that supports one-on-one and group messaging.",
      complexity: "MEDIUM",
      functionalReqs: [
        "Support one-on-one and group chats.",
        "Show read/delivered status for messages.",
        "Handle offline users (store messages and deliver later).",
        "Support media files (images, videos)."
      ],
      nonFunctionalReqs: [
        "Low latency messaging.",
        "Highly reliable (no message loss).",
        "Scalable to millions of concurrent users."
      ]
    },
    {
      title: "Design a Video Streaming Platform",
      description: "Create a platform like Netflix or YouTube capable of streaming video content to global users.",
      complexity: "HARD",
      functionalReqs: [
        "Upload and store videos in multiple resolutions.",
        "Stream videos smoothly on various network speeds.",
        "Support user search for videos.",
        "Maintain a view count for each video."
      ],
      nonFunctionalReqs: [
        "High availability and low latency streaming.",
        "Seamless playback experience (no buffering).",
        "Cost-effective storage and delivery (CDN)."
      ]
    }
  ];

  for (const problem of problems) {
    await prisma.systemDesignProblem.create({
      data: problem,
    });
  }

  console.log("Seeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
