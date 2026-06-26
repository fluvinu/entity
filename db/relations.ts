import { relations } from "drizzle-orm";
import { entities, entityRelations, entityBehaviors, entityRoles, executionLogs } from "./schema";

/**
 * Universal Entity Architecture - Relations
 * Defines how Entities connect to form a graph.
 */

// Entity -> Relations (as source)
export const entitiesRelations = relations(entities, ({ many }) => ({
  outgoingRelations: many(entityRelations, { relationName: "source" }),
  incomingRelations: many(entityRelations, { relationName: "target" }),
  behaviors: many(entityBehaviors),
  roles: many(entityRoles),
  executions: many(executionLogs),
}));

// Relation -> Source/Target Entities
export const entityRelationsRelations = relations(entityRelations, ({ one }) => ({
  source: one(entities, {
    fields: [entityRelations.sourceId],
    references: [entities.id],
    relationName: "source",
  }),
  target: one(entities, {
    fields: [entityRelations.targetId],
    references: [entities.id],
    relationName: "target",
  }),
}));

// Behavior -> Entity
export const entityBehaviorsRelations = relations(entityBehaviors, ({ one }) => ({
  entity: one(entities, {
    fields: [entityBehaviors.entityId],
    references: [entities.id],
  }),
}));

// Role -> Entity
export const entityRolesRelations = relations(entityRoles, ({ one }) => ({
  entity: one(entities, {
    fields: [entityRoles.entityId],
    references: [entities.id],
  }),
}));

// Execution Log -> Entity
export const executionLogsRelations = relations(executionLogs, ({ one }) => ({
  entity: one(entities, {
    fields: [executionLogs.entityId],
    references: [entities.id],
  }),
}));
