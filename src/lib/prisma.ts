// src/lib/prisma.ts
import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

const createPrismaClient = () => {
    // 1. Create the Postgres pool using your environment variable
    const connectionString = `${process.env.DATABASE_URL}`;
    const pool = new Pool({ connectionString });

    // 2. Create the adapter
    const adapter = new PrismaPg(pool);

    // 3. Pass the adapter to the PrismaClient constructor
    return new PrismaClient({ adapter });
};

// Ensure we reuse the instance in development to prevent connection exhaustion
export const prisma = globalForPrisma.prisma || createPrismaClient();

if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = prisma;
}
