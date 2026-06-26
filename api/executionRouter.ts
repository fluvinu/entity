import { z } from "zod";
import { createRouter, publicQuery } from "./middleware";
import {
  findExecutionsByEntity,
  findExecutionById,
  createExecutionLog,
  updateExecutionStatus,
  getExecutionStats,
  getUnprocessedEvents,
  markEventProcessed,
  getRecentEvents,
} from "./queries/executions";

const jsonRecord = z.record(z.string(), z.unknown());

export const executionRouter = createRouter({
  listByEntity: publicQuery
    .input(
      z.object({
        entityId: z.number(),
        limit: z.number().min(1).max(200).default(50),
      })
    )
    .query(async ({ input }) => {
      return findExecutionsByEntity(input.entityId, input.limit);
    }),

  byId: publicQuery
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      return findExecutionById(input.id);
    }),

  create: publicQuery
    .input(
      z.object({
        entityId: z.number(),
        behaviorId: z.number().optional(),
        executionType: z.string().default("manual"),
        status: z.enum(["pending", "running", "completed", "failed", "cancelled"]).default("pending"),
        input: jsonRecord.optional(),
      })
    )
    .mutation(async ({ input }) => {
      return createExecutionLog(input);
    }),

  updateStatus: publicQuery
    .input(
      z.object({
        id: z.number(),
        status: z.enum(["pending", "running", "completed", "failed", "cancelled"]),
        output: jsonRecord.optional(),
        error: z.string().optional(),
        duration: z.number().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { id, status, ...opts } = input;
      return updateExecutionStatus(id, status, opts);
    }),

  stats: publicQuery.query(async () => {
    return getExecutionStats();
  }),

  events: publicQuery
    .input(z.object({ limit: z.number().min(1).max(200).default(50) }).optional())
    .query(async ({ input }) => {
      return getRecentEvents(input?.limit ?? 50);
    }),

  unprocessedEvents: publicQuery
    .input(z.object({ limit: z.number().min(1).max(200).default(100) }).optional())
    .query(async ({ input }) => {
      return getUnprocessedEvents(input?.limit ?? 100);
    }),

  markEventProcessed: publicQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      return markEventProcessed(input.id);
    }),
});
