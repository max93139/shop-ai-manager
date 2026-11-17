import { testDatabaseUrl } from './test-database-url';

process.env.NODE_ENV = 'test';
process.env.DATABASE_URL = testDatabaseUrl();
process.env.JWT_SECRET = 'e2e-secret-at-least-32-characters-long';
process.env.ADMIN_EMAIL = 'admin@e2e.test';
process.env.ADMIN_PASSWORD = 'e2e-admin-password';
process.env.ADMIN_NAME = 'E2E Admin';

// No real Telegram, Nova Poshta or Monobank calls from tests; suites opt in with stubs.
for (const key of [
  'TELEGRAM_BOT_TOKEN',
  'TELEGRAM_CHANNEL_ID',
  'TELEGRAM_MANAGER_CHAT_ID',
  'NOVA_POSHTA_API_KEY',
  'NOVA_POSHTA_SENDER_WAREHOUSE_REF',
  'MONOBANK_TOKEN',
  'MONOBANK_PUBLIC_KEY',
  'API_PUBLIC_URL',
]) {
  delete process.env[key];
}

// Any outbound HTTP that a suite did not stub fails loudly instead of reaching a real service.
globalThis.fetch = (async (input: unknown) => {
  throw new Error(`Unexpected outbound request in e2e test: ${String(input)}`);
}) as typeof fetch;
