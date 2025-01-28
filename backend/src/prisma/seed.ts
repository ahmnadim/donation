import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  // Seed Users
  await prisma.user.createMany({
    data: [
      {
        email: "ahmnadim.2018@gmail.com",
        name: "Ahmad Ul Hoq Nadim",
        password: await bcrypt.hash("111111", 10),
        role: "ADMIN",
      },
      {
        email: "nadim@gmail.com",
        name: "Ahm Nadim",
        password: await bcrypt.hash("111111", 10),
        role: "USER",
      },
    ],
  });

  // Seed Posts
  await prisma.program.createMany({
    data: [
      {
        name: "General",
        description: "The fund for anything.",
      },
      {
        name: "Zakat",
        description: "The fund for zakat.",
      },
      {
        name: "Sustainable development",
        description: "The fund for Sustainable development.",
      },
    ],
  });

  await prisma.donation.createMany({
    data: [
      {
        amount: 1000,
        currency: "BDT",
        donorId: 2,
        programId: 1,
      },
      {
        amount: 2000,
        currency: "BDT",
        donorId: 2,
        programId: 2,
      },
    ],
  });
  console.log("Database has been seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
