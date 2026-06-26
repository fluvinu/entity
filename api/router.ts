import { createRouter, publicQuery } from "./middleware";
import { entityRouter } from "./entityRouter";
import { relationRouter } from "./relationRouter";
import { behaviorRouter } from "./behaviorRouter";
import { executionRouter } from "./executionRouter";

/**
 * Universal Entity Architecture - API Router
 * All engines read the same Entity model.
 */

export const appRouter = createRouter({
  // Health check
  ping: publicQuery.query(() => ({ ok: true, ts: Date.now(), message: "UEA Platform Running" })),

  // Entity management
  entity: entityRouter,

  // Relation graph
  relation: relationRouter,

  // Behaviors & Roles
  behavior: behaviorRouter,

  // Execution & Events
  execution: executionRouter,
});

export type AppRouter = typeof appRouter;
