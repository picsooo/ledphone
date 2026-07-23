import { PrismaClient } from "../app/generated/prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import { createHash } from "crypto";
import "dotenv/config";

const adapter = new PrismaLibSql({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN,
});
const prisma = new PrismaClient({ adapter });

function hashPassword(password: string): string {
  return createHash("sha256").update(password).digest("hex");
}

async function main() {
  await prisma.admin.upsert({
    where: { username: "ledphone" },
    update: { password: hashPassword("ledphone2026") },
    create: {
      username: "ledphone",
      password: hashPassword("ledphone2026"),
    },
  });
  console.log("Admin account created: ledphone");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
