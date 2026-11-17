import { PrismaClient } from '@prisma/client';

export * from '@prisma/client';

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

/** Store settings row, created with defaults on first read. */
export function getStoreSettings() {
  return prisma.storeSettings.upsert({ where: { id: 1 }, update: {}, create: { id: 1 } });
}
