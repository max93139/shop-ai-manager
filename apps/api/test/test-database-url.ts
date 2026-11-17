/** The e2e suite resets this database, so it must be set explicitly and look like a test database. */
export function testDatabaseUrl(): string {
  const url = process.env.TEST_DATABASE_URL;
  if (!url) {
    throw new Error('TEST_DATABASE_URL is not set; the e2e tests need a dedicated database they may wipe');
  }
  const dbName = new URL(url).pathname.slice(1);
  if (!/test/i.test(dbName)) {
    throw new Error(`Refusing to run e2e tests against "${dbName}": the database name must contain "test"`);
  }
  return url;
}
