import { getDb } from "./connection";
import { entityBehaviors, entityRoles } from "@db/schema";
import { eq, count } from "drizzle-orm";
import type { InsertEntityBehavior, InsertEntityRole } from "@db/schema";

export async function findBehaviorsByEntity(entityId: number) {
  return getDb()
    .select()
    .from(entityBehaviors)
    .where(eq(entityBehaviors.entityId, entityId));
}

export async function findBehaviorById(id: number) {
  return getDb().query.entityBehaviors.findFirst({
    where: eq(entityBehaviors.id, id),
  });
}

export async function createBehavior(data: InsertEntityBehavior) {
  const db = getDb();
  const [{ id }] = await db
    .insert(entityBehaviors)
    .values({
      ...data,
      config: data.config ?? {},
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    .$returningId();

  return findBehaviorById(id);
}

export async function updateBehavior(id: number, data: Partial<InsertEntityBehavior>) {
  await getDb()
    .update(entityBehaviors)
    .set({
      ...data,
      updatedAt: new Date(),
    })
    .where(eq(entityBehaviors.id, id));

  return findBehaviorById(id);
}

export async function deleteBehavior(id: number) {
  await getDb().delete(entityBehaviors).where(eq(entityBehaviors.id, id));
  return { success: true };
}

export async function getBehaviorStats() {
  const db = getDb();
  const totalResult = await db.select({ value: count() }).from(entityBehaviors);
  const typeResult = await db
    .select({
      type: entityBehaviors.behaviorType,
      count: count(),
    })
    .from(entityBehaviors)
    .groupBy(entityBehaviors.behaviorType);

  return {
    total: totalResult[0]?.value ?? 0,
    byType: typeResult,
  };
}

export async function findRolesByEntity(entityId: number) {
  return getDb()
    .select()
    .from(entityRoles)
    .where(eq(entityRoles.entityId, entityId));
}

export async function assignRole(data: InsertEntityRole) {
  const db = getDb();
  const [{ id }] = await db
    .insert(entityRoles)
    .values({
      ...data,
      config: data.config ?? {},
      createdAt: new Date(),
    })
    .$returningId();

  return db.query.entityRoles.findFirst({
    where: eq(entityRoles.id, id),
  });
}

export async function removeRole(id: number) {
  await getDb().delete(entityRoles).where(eq(entityRoles.id, id));
  return { success: true };
}

export async function getRoleStats() {
  const db = getDb();
  return db
    .select({
      role: entityRoles.role,
      count: count(),
    })
    .from(entityRoles)
    .groupBy(entityRoles.role);
}
