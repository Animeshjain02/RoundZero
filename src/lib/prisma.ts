import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";

const connectionString = process.env.DATABASE_URL;

const pool = new Pool({ 
  connectionString,
  ssl: connectionString?.includes("13.228.46.236") ? { rejectUnauthorized: false } : undefined
});
const adapter = new PrismaPg(pool as any);

const globalForPrisma = global as unknown as {
  prisma: PrismaClient;
};
const prisma = globalForPrisma.prisma || new PrismaClient({ 
  adapter,
  log: ['query', 'info', 'warn', 'error']
});

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;
