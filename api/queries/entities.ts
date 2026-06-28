import { getDb } from "./connection";
import { entities, entityBehaviors, entityRoles, entityRelations } from "@db/schema";
import { eq, like, and, desc, count } from "drizzle-orm";
import type { InsertEntity } from "@db/schema";

/**
 * Entity Query Functions
 * Everything is an Entity. These are the primitive operations.
 */

// ─── CRUD Operations ───

export async function findAllEntities(opts: { kind?: string; search?: string; limit?: number; offset?: number } = {}) {
  const db = getDb();
  const conditions = [];

  if (opts.kind) {
    conditions.push(eq(entities.kind, opts.kind));
  }
  if (opts.search) {
    conditions.push(like(entities.name, `%${opts.search}%`));
  }

  const where = conditions.length > 0 ? and(...conditions) : undefined;

  const items = await db
    .select()
    .from(entities)
    .where(where)
    .orderBy(desc(entities.createdAt))
    .limit(opts.limit ?? 100)
    .offset(opts.offset ?? 0);

  const totalResult = await db
    .select({ value: count() })
    .from(entities)
    .where(where);

  return {
    items,
    total: totalResult[0]?.value ?? 0,
  };
}

export async function findEntityById(id: number) {
  return getDb().query.entities.findFirst({
    where: eq(entities.id, id),
  });
}

export async function findEntityWithDetails(id: number) {
  const db = getDb();
  const entity = await db.query.entities.findFirst({
    where: eq(entities.id, id),
  });

  if (!entity) return null;

  const [behaviors, roles, outgoingRels, incomingRels] = await Promise.all([
    db.select().from(entityBehaviors).where(eq(entityBehaviors.entityId, id)),
    db.select().from(entityRoles).where(eq(entityRoles.entityId, id)),
    db
      .select({
        id: entityRelations.id,
        relation: entityRelations.relation,
        targetId: entityRelations.targetId,
        targetName: entities.name,
        targetKind: entities.kind,
        createdAt: entityRelations.createdAt,
      })
      .from(entityRelations)
      .leftJoin(entities, eq(entityRelations.targetId, entities.id))
      .where(eq(entityRelations.sourceId, id)),
    db
      .select({
        id: entityRelations.id,
        relation: entityRelations.relation,
        sourceId: entityRelations.sourceId,
        sourceName: entities.name,
        sourceKind: entities.kind,
        createdAt: entityRelations.createdAt,
      })
      .from(entityRelations)
      .leftJoin(entities, eq(entityRelations.sourceId, entities.id))
      .where(eq(entityRelations.targetId, id)),
  ]);

  return {
    ...entity,
    behaviors,
    roles,
    outgoingRelations: outgoingRels,
    incomingRelations: incomingRels,
  };
}

export async function createEntity(data: InsertEntity) {
  const db = getDb();
  const [{ id }] = await db
    .insert(entities)
    .values({
      ...data,
      properties: data.properties ?? {},
      state: data.state ?? {},
      metadata: data.metadata ?? {},
    })
    .$returningId();

  return findEntityById(id);
}

export async function updateEntity(id: number, data: Partial<InsertEntity>) {
  await getDb()
    .update(entities)
    .set({
      ...data,
    })
    .where(eq(entities.id, id));

  return findEntityById(id);
}

export async function deleteEntity(id: number) {
  const db = getDb();
  await db.delete(entityBehaviors).where(eq(entityBehaviors.entityId, id));
  await db.delete(entityRoles).where(eq(entityRoles.entityId, id));
  await db.delete(entityRelations).where(eq(entityRelations.sourceId, id));
  await db.delete(entityRelations).where(eq(entityRelations.targetId, id));
  await db.delete(entities).where(eq(entities.id, id));
  return { success: true };
}

// ─── Statistics ───

export async function getEntityStats() {
  const db = getDb();
  const totalResult = await db.select({ value: count() }).from(entities);
  const kindResult = await db
    .select({
      kind: entities.kind,
      count: count(),
    })
    .from(entities)
    .groupBy(entities.kind);

  return {
    total: totalResult[0]?.value ?? 0,
    byKind: kindResult,
  };
}

export async function getRecentEntities(limit = 10) {
  return getDb()
    .select()
    .from(entities)
    .orderBy(desc(entities.createdAt))
    .limit(limit);
}
