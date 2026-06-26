import { getDb } from "../api/queries/connection";

/**
 * Seed script for initial data
 * Run with: npx tsx db/seed.ts
 */

async function seed() {
  console.log("Seeding database...");
  // Add seed data here
  console.log("Done!");
}

seed().catch(console.error);
