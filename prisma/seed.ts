import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { betterAuth } from "better-auth";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL is not set");
}

const pool = new Pool({ connectionString });

// Seed musí fungovat i v Dockeru, kde runtime image typicky neobsahuje celý `src/` strom.
// Proto si Better-Auth instanci vytvoříme lokálně (stejná konfigurace jako v src/lib/auth.ts).
const auth = betterAuth({
  database: pool,
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
  },
  user: {
    additionalFields: {
      role_id: {
        type: "number",
      },
      phone_number: {
        type: "string",
        required: false,
      },
    },
  },
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function ensureRole(role_name: string) {
  const existing = await prisma.role.findFirst({ where: { role_name } });
  if (existing) return existing;
  return prisma.role.create({ data: { role_name } });
}

async function ensureFloor(floor_name: string) {
  const existing = await prisma.floor.findFirst({ where: { floor_name } });
  if (existing) return existing;
  return prisma.floor.create({ data: { floor_name } });
}

async function ensureRoomType(room_type_name: string) {
  const existing = await prisma.room_type.findFirst({ where: { room_type_name } });
  if (existing) return existing;
  return prisma.room_type.create({ data: { room_type_name } });
}

async function ensureCategory(category_name: string) {
  const existing = await prisma.category.findUnique({ where: { category_name } });
  if (existing) return existing;
  return prisma.category.create({ data: { category_name } });
}

async function ensurePriority(priority_type: string) {
  const existing = await prisma.priority.findUnique({ where: { priority_type } });
  if (existing) return existing;
  return prisma.priority.create({ data: { priority_type } });
}

async function ensureStatus(status_name: string) {
  const existing = await prisma.status.findUnique({ where: { status_name } });
  if (existing) return existing;
  return prisma.status.create({ data: { status_name } });
}

async function ensureRoom(params: {
  name: string;
  floor_id: number;
  room_type_id: number;
}) {
  const existing = await prisma.room.findUnique({ where: { name: params.name } });
  if (existing) return existing;

  return prisma.room.create({
    data: {
      name: params.name,
      floor: params.floor_id,
      room_type: params.room_type_id,
    },
  });
}

async function main() {
  // ROLE
  const adminRole = await ensureRole("Administrator");
  await ensureRole("Manager");
  await ensureRole("Reporter");

  // ADMIN USER
  const adminId = process.env.SEED_ADMIN_ID ?? "seed_admin";
  const adminEmail = (process.env.SEED_ADMIN_EMAIL ?? "admin@example.com").trim().toLowerCase();
  const adminName = process.env.SEED_ADMIN_NAME ?? "Admin";
  const adminPassword = process.env.SEED_ADMIN_PASSWORD ?? "admin123";
  const adminAccountDbId = process.env.SEED_ADMIN_ACCOUNT_DB_ID ?? "seed_admin_credential";

  const adminUser = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      name: adminName,
      role_id: adminRole.role_id,
      emailVerified: true,
    },
    create: {
      id: adminId,
      name: adminName,
      email: adminEmail,
      role_id: adminRole.role_id,
      emailVerified: true,
    },
  });

  // Better-auth ukládá přihlašovací údaje do Account jako providerId="credential", accountId=user.id
  const ctx = await auth.$context;
  const passwordHash = await ctx.password.hash(adminPassword);
  const existingCredentialAccount = await prisma.account.findFirst({
    where: {
      userId: adminUser.id,
      providerId: "credential",
    },
    select: { id: true },
  });

  if (existingCredentialAccount) {
    await prisma.account.update({
      where: { id: existingCredentialAccount.id },
      data: {
        accountId: adminUser.id,
        providerId: "credential",
        password: passwordHash,
      },
    });
  } else {
    await prisma.account.create({
      data: {
        id: adminAccountDbId,
        userId: adminUser.id,
        providerId: "credential",
        accountId: adminUser.id,
        password: passwordHash,
      },
    });
  }

  // ROOM PART
  const ground = await ensureFloor("Ground floor");
  const first = await ensureFloor("1st floor");
  const second = await ensureFloor("2nd floor");

  const classRoom = await ensureRoomType("Class room");
  const computerRoom = await ensureRoomType("Computer room");
  const laboratory = await ensureRoomType("Laboratory");
  const other = await ensureRoomType("Other");

  await ensureRoom({ name: "U1", floor_id: ground.floor_id, room_type_id: classRoom.room_type_id });
  await ensureRoom({ name: "U2", floor_id: ground.floor_id, room_type_id: classRoom.room_type_id });
  await ensureRoom({ name: "U3", floor_id: first.floor_id, room_type_id: classRoom.room_type_id });
  await ensureRoom({ name: "U4", floor_id: first.floor_id, room_type_id: classRoom.room_type_id });
  await ensureRoom({ name: "C1", floor_id: ground.floor_id, room_type_id: computerRoom.room_type_id });
  await ensureRoom({ name: "C2", floor_id: first.floor_id, room_type_id: computerRoom.room_type_id });
  await ensureRoom({ name: "L1", floor_id: second.floor_id, room_type_id: laboratory.room_type_id });
  await ensureRoom({ name: "L2", floor_id: second.floor_id, room_type_id: laboratory.room_type_id });
  await ensureRoom({
    name: "Restroom (Ground floor)",
    floor_id: ground.floor_id,
    room_type_id: other.room_type_id,
  });
  await ensureRoom({
    name: "Restroom (First floor)",
    floor_id: first.floor_id,
    room_type_id: other.room_type_id,
  });
  await ensureRoom({
    name: "Restroom (Second floor)",
    floor_id: second.floor_id,
    room_type_id: other.room_type_id,
  });

  // TICKET PART
  await ensureCategory("Electronics");
  await ensureCategory("Furniture");
  await ensureCategory("Miscellaneous");

  await ensurePriority("Low");
  await ensurePriority("Medium");
  await ensurePriority("High");
  await ensurePriority("Critical");

  await ensureStatus("Open");
  await ensureStatus("In Progress");
  await ensureStatus("Resolved");
  await ensureStatus("Rejected");
}

main()
  .then(async () => {
    await prisma.$disconnect();
    await pool.end();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    await pool.end();
    process.exit(1);
  });
