import { getDb } from "./connection";
import { entityRelations, entities } from "@db/schema";
import { eq, count } from "drizzle-orm";
import type { InsertEntityRelation } from "@db/schema";

export async function findRelationsBySource(sourceId: number) {
  return getDb()
    .select({
      id: entityRelations.id,
      sourceId: entityRelations.sourceId,
      relation: entityRelations.relation,
      targetId: entityRelations.targetId,
      targetName: entities.name,
      targetKind: entities.kind,
      createdAt: entityRelations.createdAt,
    })
    .from(entityRelations)
    .leftJoin(entities, eq(entityRelations.targetId, entities.id))
    .where(eq(entityRelations.sourceId, sourceId));
}

export async function findRelationsByTarget(targetId: number) {
  return getDb()
    .select({
      id: entityRelations.id,
      sourceId: entityRelations.sourceId,
      sourceName: entities.name,
      sourceKind: entities.kind,
      relation: entityRelations.relation,
      targetId: entityRelations.targetId,
      createdAt: entityRelations.createdAt,
    })
    .from(entityRelations)
    .leftJoin(entities, eq(entityRelations.sourceId, entities.id))
    .where(eq(entityRelations.targetId, targetId));
}

export async function createRelation(data: InsertEntityRelation) {
  const db = getDb();
  const [{ id }] = await db
    .insert(entityRelations)
    .values(data)
    .$returningId();

  return db.query.entityRelations.findFirst({
    where: eq(entityRelations.id, id),
  });
}

export async function deleteRelation(id: number) {
  await getDb().delete(entityRelations).where(eq(entityRelations.id, id));
  return { success: true };
}

export async function findRelationById(id: number) {
  return getDb().query.entityRelations.findFirst({
    where: eq(entityRelations.id, id),
  });
}

export async function getGraphStats() {
  const db = getDb();
  const totalResult = await db.select({ value: count() }).from(entityRelations);
  const relationTypes = await db
    .select({
      relation: entityRelations.relation,
      count: count(),
    })
    .from(entityRelations)
    .groupBy(entityRelations.relation);

  return {
    totalRelations: totalResult[0]?.value ?? 0,
    byType: relationTypes,
  };
}

export async function getFullGraph() {
  const db = getDb();
  const allEntities = await db.select().from(entities);
  const allRelations = await db.select().from(entityRelations);
  return { entities: allEntities, relations: allRelations };
}
