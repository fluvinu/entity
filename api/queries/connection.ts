import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import { env } from "../lib/env";
import * as schema from "@db/schema";
import * as relations from "@db/relations";

const fullSchema = { ...schema, ...relations };

let instance: any;
let pool: mysql.Pool;

export function getDb(): ReturnType<typeof drizzle<typeof fullSchema>> {
  if (!instance) {
    pool = mysql.createPool(env.databaseUrl);
    instance = drizzle(pool, { mode: "default", schema: fullSchema }) as any;
  }
  return instance;
}
