import { StorageAdapter } from 'grammy';
import { prisma } from '@shop-ai/database';

export function createPrismaSessionStorage<T>(): StorageAdapter<T> {
  return {
    async read(key: string): Promise<T | undefined> {
      try {
        const record = await prisma.session.findUnique({
          where: { key },
        });
        if (!record || !record.value) {
          return undefined;
        }
        return JSON.parse(record.value) as T;
      } catch (err) {
        console.error(`Error reading session for key "${key}":`, err);
        return undefined;
      }
    },

    async write(key: string, value: T): Promise<void> {
      try {
        const serialized = JSON.stringify(value);
        await prisma.session.upsert({
          where: { key },
          update: { value: serialized },
          create: { key, value: serialized },
        });
      } catch (err) {
        console.error(`Error writing session for key "${key}":`, err);
      }
    },

    async delete(key: string): Promise<void> {
      try {
        await prisma.session.delete({
          where: { key },
        });
      } catch {
        // Ignore deletion of non-existing records
      }
    },

    async has(key: string): Promise<boolean> {
      try {
        const count = await prisma.session.count({
          where: { key },
        });
        return count > 0;
      } catch {
        return false;
      }
    },
  };
}
