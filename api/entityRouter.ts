import { z } from "zod";
import { createRouter, publicQuery } from "./middleware";
import {
  findAllEntities,
  findEntityById,
  findEntityWithDetails,
  createEntity,
  updateEntity,
  deleteEntity,
  getEntityStats,
  getRecentEntities,
} from "./queries/entities";

const jsonRecord = z.record(z.string(), z.unknown());

export const entityRouter = createRouter({
  list: publicQuery
    .input(
      z.object({
        kind: z.string().optional(),
        search: z.string().optional(),
        limit: z.number().min(1).max(500).optional(),
        offset: z.number().min(0).optional(),
      }).optional()
    )
    .query(async ({ input }) => {
      return findAllEntities(input ?? {});
    }),

  byId: publicQuery
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      return findEntityById(input.id);
    }),

  withDetails: publicQuery
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      return findEntityWithDetails(input.id);
    }),

  create: publicQuery
    .input(
      z.object({
        name: z.string().min(1, "Name is required"),
        kind: z.string().default("entity"),
        version: z.string().default("1.0"),
        properties: jsonRecord.optional(),
        state: jsonRecord.optional(),
        metadata: jsonRecord.optional(),
      })
    )
    .mutation(async ({ input }) => {
      return createEntity(input);
    }),

  update: publicQuery
    .input(
      z.object({
        id: z.number(),
        name: z.string().min(1).optional(),
        kind: z.string().optional(),
        version: z.string().optional(),
        properties: jsonRecord.optional(),
        state: jsonRecord.optional(),
        metadata: jsonRecord.optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { id, ...data } = input;
      return updateEntity(id, data);
    }),

  delete: publicQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      return deleteEntity(input.id);
    }),

  stats: publicQuery.query(async () => {
    return getEntityStats();
  }),

  recent: publicQuery
    .input(z.object({ limit: z.number().min(1).max(50).default(10) }).optional())
    .query(async ({ input }) => {
      return getRecentEntities(input?.limit ?? 10);
    }),
});
