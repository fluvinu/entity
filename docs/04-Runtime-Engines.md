# 04 - Runtime Engine Specification

## Universal Entity Architecture (UEA)

**Version:** 1.0  
**Status:** Technical Specification

---

## 1. Overview

This document defines the runtime engines that interpret Entities. Every engine reads the same Entity model but produces different outputs.

---

## 2. Engine Philosophy

> The Entity itself remains unchanged. Meaning comes from interpretation.

---

## 3. UI Engine

Reads Entities with UI roles and produces rendered interfaces.

```
role = UI.Button  -> Render as Button component
role = UI.Text    -> Render as Text element
role = UI.Card    -> Render as Card container
role = UI.Page    -> Render as full Page layout
```

---

## 4. Backend Engine

Reads Entities and executes workflows, APIs, and business logic.

```
Workflow Entity
  -> Read Steps
  -> Resolve Relations
  -> Execute Behaviors
  -> Update State
  -> Notify Listeners
```

---

## 5. Database Engine

Reads Entities and manages data persistence.

---

## 6. Permission Engine

Reads Entities and controls access to resources.

---

## 7. AI Engine

Reads Entities and provides intelligent reasoning.

---

## 8. Engine Registration

New engines can be added without modifying existing ones:

```typescript
engineRegistry.register("report", new ReportEngine());
```

---

*This document is part of the Universal Entity Architecture specification.*
