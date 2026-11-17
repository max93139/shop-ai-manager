-- One-off: move brands stored as "Brand: X" in products.description into products.brand.
-- Run once after `prisma db push` adds the column: pnpm --filter @shop-ai/database exec prisma db execute --file prisma/scripts/backfill-product-brand.sql --schema prisma/schema.prisma
UPDATE products
SET brand = trim(substring(description from '(?i)Brand:\s*(.+)')), description = NULL
WHERE brand IS NULL AND description ~* 'Brand:';
