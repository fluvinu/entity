import {
  mysqlTable,
  serial,
  varchar,
  text,
  timestamp,
  json,
  bigint,
  int,
  index,
  mysqlEnum,
} from "drizzle-orm/mysql-core";

/**
 * Universal Entity Architecture - Core Schema
 * Everything is an Entity. No exceptions.
 */

// ─── Core Entity Table ───
export const entities = mysqlTable(
  "entities",
  {
    id: serial("id").primaryKey(),
    // Identity
    name: varchar("name", { length: 255 }).notNull(),
    kind: varchar("kind", { length: 100 }).notNull().default("entity"),
    version: varchar("version", { length: 20 }).notNull().default("1.0"),
    // Core Data - stored as JSON, no DB default (handled in application)
    properties: json("properties").$type<Record<string, unknown>>(),
    state: json("state").$type<Record<string, unknown>>(),
    metadata: json("metadata").$type<Record<string, unknown>>(),
    // Timestamps
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    kindIdx: index("kind_idx").on(table.kind),
    nameIdx: index("name_idx").on(table.name),
    createdAtIdx: index("created_at_idx").on(table.createdAt),
  })
);

export type Entity = typeof entities.$inferSelect;
export type InsertEntity = typeof entities.$inferInsert;

// ─── Entity Relations Table (Graph Structure) ───
export const entityRelations = mysqlTable(
  "entity_relations",
  {
    id: serial("id").primaryKey(),
    sourceId: bigint("source_id", { mode: "number", unsigned: true }).notNull(),
    relation: varchar("relation", { length: 50 }).notNull(),
    targetId: bigint("target_id", { mode: "number", unsigned: true }).notNull(),
    metadata: json("metadata").$type<Record<string, unknown>>(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => ({
    sourceIdx: index("source_idx").on(table.sourceId),
    targetIdx: index("target_idx").on(table.targetId),
    relationIdx: index("relation_idx").on(table.relation),
  })
);

export type EntityRelation = typeof entityRelations.$inferSelect;
export type InsertEntityRelation = typeof entityRelations.$inferInsert;

// ─── Entity Behaviors Table ───
export const entityBehaviors = mysqlTable(
  "entity_behaviors",
  {
    id: serial("id").primaryKey(),
    entityId: bigint("entity_id", { mode: "number", unsigned: true }).notNull(),
    name: varchar("name", { length: 100 }).notNull(),
    behaviorType: varchar("behavior_type", { length: 50 }).notNull().default("action"),
    config: json("config").$type<Record<string, unknown>>(),
    isActive: int("is_active").default(1),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    entityIdIdx: index("behavior_entity_idx").on(table.entityId),
    typeIdx: index("behavior_type_idx").on(table.behaviorType),
  })
);

export type EntityBehavior = typeof entityBehaviors.$inferSelect;
export type InsertEntityBehavior = typeof entityBehaviors.$inferInsert;

// ─── Entity Roles Table ───
export const entityRoles = mysqlTable(
  "entity_roles",
  {
    id: serial("id").primaryKey(),
    entityId: bigint("entity_id", { mode: "number", unsigned: true }).notNull(),
    role: mysqlEnum("role", [
      "UI",
      "DATA",
      "WORKFLOW",
      "API",
      "DATABASE",
      "PERMISSION",
      "NOTIFICATION",
      "PLUGIN",
      "AI_TOOL",
      "SCHEDULER",
      "REPORT",
      "SEARCH_INDEX",
      "COMPONENT",
      "PAGE",
      "APPLICATION",
    ]).notNull(),
    config: json("config").$type<Record<string, unknown>>(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => ({
    entityIdIdx: index("role_entity_idx").on(table.entityId),
    roleIdx: index("role_idx").on(table.role),
  })
);

export type EntityRole = typeof entityRoles.$inferSelect;
export type InsertEntityRole = typeof entityRoles.$inferInsert;

// ─── Execution Logs Table ───
export const executionLogs = mysqlTable(
  "execution_logs",
  {
    id: serial("id").primaryKey(),
    entityId: bigint("entity_id", { mode: "number", unsigned: true }).notNull(),
    behaviorId: bigint("behavior_id", { mode: "number", unsigned: true }),
    executionType: varchar("execution_type", { length: 50 }).notNull().default("manual"),
    status: mysqlEnum("status", ["pending", "running", "completed", "failed", "cancelled"]).notNull().default("pending"),
    input: json("input").$type<Record<string, unknown>>(),
    output: json("output").$type<Record<string, unknown>>(),
    error: text("error"),
    duration: int("duration_ms"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => ({
    entityIdx: index("exec_entity_idx").on(table.entityId),
    statusIdx: index("exec_status_idx").on(table.status),
    createdAtIdx: index("exec_created_idx").on(table.createdAt),
  })
);

export type ExecutionLog = typeof executionLogs.$inferSelect;
export type InsertExecutionLog = typeof executionLogs.$inferInsert;

// ─── System Events Table ───
export const systemEvents = mysqlTable(
  "system_events",
  {
    id: serial("id").primaryKey(),
    eventType: varchar("event_type", { length: 50 }).notNull(),
    entityId: bigint("entity_id", { mode: "number", unsigned: true }),
    payload: json("payload").$type<Record<string, unknown>>(),
    processed: int("processed").default(0),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => ({
    eventTypeIdx: index("event_type_idx").on(table.eventType),
    entityIdx: index("event_entity_idx").on(table.entityId),
    processedIdx: index("event_processed_idx").on(table.processed),
  })
);

export type SystemEvent = typeof systemEvents.$inferSelect;
export type InsertSystemEvent = typeof systemEvents.$inferInsert;
