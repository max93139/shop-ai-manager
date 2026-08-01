import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const email = 'test@gmail.com';
  const plainPassword = 'Test1234';
  const hashedPassword = await bcrypt.hash(plainPassword, 10);

  const user = await prisma.user.upsert({
    where: { email },
    update: {
      password: hashedPassword,
      role: Role.ADMIN,
      name: 'Test Admin',
    },
    create: {
      email,
      password: hashedPassword,
      name: 'Test Admin',
      role: Role.ADMIN,
    },
  });

  console.log('✅ Successfully seeded database with user:', user.email);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
