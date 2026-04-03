#!/usr/bin/env tsx
/**
 * Ingest / rebuild the database.
 * For this MCP, data is manually curated from legislation, so ingest == build-db.
 */
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { existsSync, unlinkSync } from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DB_PATH = join(__dirname, '..', 'data', 'database.db');

if (existsSync(DB_PATH)) {
  unlinkSync(DB_PATH);
}

const { createSeededDatabase } = await import('../tests/helpers/seed-db.js');
const db = createSeededDatabase(DB_PATH);
db.close();

console.log(`Ingestion complete. Database at ${DB_PATH}`);
