# 10 - Developer Guide & Best Practices

## Universal Entity Architecture (UEA)

**Version:** 1.0  
**Status:** Implementation Guide

---

## 1. Overview

This document provides practical guidance for developers.

---

## 2. Getting Started

```bash
npm install
npm run db:push
npm run dev
```

---

## 3. Creating an Entity

```typescript
const create = trpc.entity.create.useMutation();
create.mutate({
  name: "Login Button",
  kind: "button",
  properties: { text: "Login", color: "blue" },
});
```

---

## 4. Best Practices

- Keep properties flat
- Use consistent naming
- Version your entities
- Document with metadata

---

## 5. Anti-Patterns

```
AVOID: ButtonManager, PageManager, WorkflowManager
USE:   Entity Engine + Role-based interpretation
```

---

*This document is part of the Universal Entity Architecture specification.*
