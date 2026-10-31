import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

import dotenv from 'dotenv';
import path from 'path';

dotenv.config();
dotenv.config({ path: path.resolve(process.cwd(), '../../.env') });
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const prisma = new PrismaClient();

async function main() {
  const email = process.env.ADMIN_EMAIL || 'test@gmail.com';
  const plainPassword = process.env.ADMIN_PASSWORD || 'Test1234';
  const name = process.env.ADMIN_NAME || 'Test Admin';
  const hashedPassword = await bcrypt.hash(plainPassword, 10);

  const user = await prisma.user.upsert({
    where: { email },
    update: {
      password: hashedPassword,
      role: Role.ADMIN,
      name,
    },
    create: {
      email,
      password: hashedPassword,
      name,
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
