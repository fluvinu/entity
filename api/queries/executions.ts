import { getDb } from "./connection";
import { executionLogs, systemEvents } from "@db/schema";
import { eq, desc, count } from "drizzle-orm";
import type { InsertExecutionLog, InsertSystemEvent } from "@db/schema";

export async function findExecutionsByEntity(entityId: number, limit = 50) {
  return getDb()
    .select()
    .from(executionLogs)
    .where(eq(executionLogs.entityId, entityId))
    .orderBy(desc(executionLogs.createdAt))
    .limit(limit);
}

export async function findExecutionById(id: number) {
  return getDb().query.executionLogs.findFirst({
    where: eq(executionLogs.id, id),
  });
}

export async function createExecutionLog(data: InsertExecutionLog) {
  const db = getDb();
  const [{ id }] = await db
    .insert(executionLogs)
    .values({
      ...data,
      input: data.input ?? {},
      createdAt: new Date(),
    })
    .$returningId();

  return findExecutionById(id);
}

export async function updateExecutionStatus(
  id: number,
  status: "pending" | "running" | "completed" | "failed" | "cancelled",
  opts: { output?: Record<string, unknown>; error?: string; duration?: number } = {}
) {
  await getDb()
    .update(executionLogs)
    .set({
      status,
      output: opts.output ?? {},
      error: opts.error ?? null,
      duration: opts.duration ?? null,
    })
    .where(eq(executionLogs.id, id));

  return findExecutionById(id);
}

export async function getExecutionStats() {
  const db = getDb();
  const totalResult = await db.select({ value: count() }).from(executionLogs);
  const statusResult = await db
    .select({
      status: executionLogs.status,
      count: count(),
    })
    .from(executionLogs)
    .groupBy(executionLogs.status);

  return {
    total: totalResult[0]?.value ?? 0,
    byStatus: statusResult,
  };
}

export async function createSystemEvent(data: InsertSystemEvent) {
  const db = getDb();
  const [{ id }] = await db
    .insert(systemEvents)
    .values({
      ...data,
      payload: data.payload ?? {},
      createdAt: new Date(),
    })
    .$returningId();

  return db.query.systemEvents.findFirst({
    where: eq(systemEvents.id, id),
  });
}

export async function getUnprocessedEvents(limit = 100) {
  return getDb()
    .select()
    .from(systemEvents)
    .where(eq(systemEvents.processed, 0))
    .orderBy(desc(systemEvents.createdAt))
    .limit(limit);
}

export async function markEventProcessed(id: number) {
  await getDb()
    .update(systemEvents)
    .set({ processed: 1 })
    .where(eq(systemEvents.id, id));
}

export async function getRecentEvents(limit = 50) {
  return getDb()
    .select()
    .from(systemEvents)
    .orderBy(desc(systemEvents.createdAt))
    .limit(limit);
}
