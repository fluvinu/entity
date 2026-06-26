# 07 - API & Communication Protocol

## Universal Entity Architecture (UEA)

**Version:** 1.0  
**Status:** Technical Specification

---

## 1. Overview

This document defines the API layer and communication protocol.

---

## 2. Technology Stack

| Layer | Technology |
|-------|------------|
| Client | React 19, TypeScript |
| API Protocol | tRPC 11.x |
| HTTP Server | Hono |
| ORM | Drizzle ORM |
| Database | MySQL / TiDB |

---

## 3. Router Structure

```
appRouter
├── entity     - Entity CRUD
├── relation   - Graph operations
├── behavior   - Behaviors & Roles
└── execution  - Execution & Events
```

---

## 4. Type Safety

End-to-end type safety with tRPC:

```typescript
const { data } = trpc.entity.byId.useQuery({ id: 1 });
// data is fully typed
```

---

*This document is part of the Universal Entity Architecture specification.*
