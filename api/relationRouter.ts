import { z } from "zod";
import { createRouter, publicQuery } from "./middleware";
import {
  findRelationsBySource,
  findRelationsByTarget,
  createRelation,
  deleteRelation,
  getGraphStats,
  getFullGraph,
} from "./queries/relations";

export const relationRouter = createRouter({
  bySource: publicQuery
    .input(z.object({ sourceId: z.number() }))
    .query(async ({ input }) => {
      return findRelationsBySource(input.sourceId);
    }),

  byTarget: publicQuery
    .input(z.object({ targetId: z.number() }))
    .query(async ({ input }) => {
      return findRelationsByTarget(input.targetId);
    }),

  create: publicQuery
    .input(
      z.object({
        sourceId: z.number(),
        relation: z.string().min(1),
        targetId: z.number(),
        metadata: z.record(z.string(), z.unknown()).optional(),
      })
    )
    .mutation(async ({ input }) => {
      return createRelation(input);
    }),

  delete: publicQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      return deleteRelation(input.id);
    }),

  stats: publicQuery.query(async () => {
    return getGraphStats();
  }),

  fullGraph: publicQuery.query(async () => {
    return getFullGraph();
  }),
});
