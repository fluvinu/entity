import { z } from "zod";
import { createRouter, publicQuery } from "./middleware";
import {
  findBehaviorsByEntity,
  findBehaviorById,
  createBehavior,
  updateBehavior,
  deleteBehavior,
  getBehaviorStats,
  assignRole,
  removeRole,
  findRolesByEntity,
  getRoleStats,
} from "./queries/behaviors";

const jsonRecord = z.record(z.string(), z.unknown());

export const behaviorRouter = createRouter({
  listByEntity: publicQuery
    .input(z.object({ entityId: z.number() }))
    .query(async ({ input }) => {
      return findBehaviorsByEntity(input.entityId);
    }),

  byId: publicQuery
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      return findBehaviorById(input.id);
    }),

  create: publicQuery
    .input(
      z.object({
        entityId: z.number(),
        name: z.string().min(1),
        behaviorType: z.string().default("action"),
        config: jsonRecord.optional(),
        isActive: z.number().default(1),
      })
    )
    .mutation(async ({ input }) => {
      return createBehavior(input);
    }),

  update: publicQuery
    .input(
      z.object({
        id: z.number(),
        name: z.string().min(1).optional(),
        behaviorType: z.string().optional(),
        config: jsonRecord.optional(),
        isActive: z.number().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { id, ...data } = input;
      return updateBehavior(id, data);
    }),

  delete: publicQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      return deleteBehavior(input.id);
    }),

  behaviorStats: publicQuery.query(async () => {
    return getBehaviorStats();
  }),

  listRoles: publicQuery
    .input(z.object({ entityId: z.number() }))
    .query(async ({ input }) => {
      return findRolesByEntity(input.entityId);
    }),

  assignRole: publicQuery
    .input(
      z.object({
        entityId: z.number(),
        role: z.enum([
          "UI", "DATA", "WORKFLOW", "API", "DATABASE", "PERMISSION",
          "NOTIFICATION", "PLUGIN", "AI_TOOL", "SCHEDULER", "REPORT",
          "SEARCH_INDEX", "COMPONENT", "PAGE", "APPLICATION",
        ]),
        config: jsonRecord.optional(),
      })
    )
    .mutation(async ({ input }) => {
      return assignRole(input);
    }),

  removeRole: publicQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      return removeRole(input.id);
    }),

  roleStats: publicQuery.query(async () => {
    return getRoleStats();
  }),
});
