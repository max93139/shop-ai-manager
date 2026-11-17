import { execSync } from 'child_process';
import path from 'path';
import { testDatabaseUrl } from './test-database-url';

/** Recreates the schema in the test database once per run. */
export default function globalSetup() {
  const url = testDatabaseUrl();
  execSync('pnpm exec prisma db push --force-reset --skip-generate --accept-data-loss', {
    cwd: path.resolve(__dirname, '../../../packages/database'),
    env: { ...process.env, DATABASE_URL: url },
    stdio: 'pipe',
  });
}
