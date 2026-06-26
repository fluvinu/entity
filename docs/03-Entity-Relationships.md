# 03 - Entity Relationship Model

## Universal Entity Architecture (UEA)

**Version:** 1.0  
**Status:** Technical Specification

---

## 1. Overview

This document defines how Entities connect to form a graph structure. Applications in UEA are graphs, not isolated systems.

---

## 2. Graph Philosophy

In UEA, everything is connected:

```
Application
  contains -> Dashboard
    contains -> Card
      contains -> Button
        calls -> Workflow
          calls -> API
            writes -> Database
              returns -> Dashboard
```

---

## 3. Relation Model

A Relation is a directed edge between two Entities with a labeled type.

| Field | Type | Description |
|-------|------|-------------|
| `id` | integer | Unique identifier |
| `sourceId` | integer | The originating Entity |
| `relation` | string | The type of relationship |
| `targetId` | integer | The target Entity |
| `metadata` | object | Additional context |

---

## 4. Relation Types

### 4.1 Containment: `contains` / `belongsTo`

Hierarchical parent-child relationships.

### 4.2 Invocation: `calls`

One Entity triggers the behavior of another.

### 4.3 Dependency: `dependsOn`

One Entity requires another to function.

### 4.4 Data Access: `reads` / `writes`

Data flow relationships.

### 4.5 Inheritance: `extends` / `inherits`

Property and behavior inheritance.

### 4.6 Reference: `references`

Non-owning, non-containment reference.

---

## 5. Graph Properties

- **Directed Graph** - All relations are directional
- **Cyclic Graphs** - Cycles are allowed and meaningful
- **Multi-Relations** - Multiple relations between same pair
- **Self-Relations** - An Entity can relate to itself

---

## 6. Storage Model

```sql
CREATE TABLE entity_relations (
  id          SERIAL PRIMARY KEY,
  source_id   BIGINT UNSIGNED NOT NULL,
  relation    VARCHAR(50) NOT NULL,
  target_id   BIGINT UNSIGNED NOT NULL,
  metadata    JSON,
  created_at  TIMESTAMP DEFAULT NOW(),
  
  INDEX source_idx (source_id),
  INDEX target_idx (target_id),
  INDEX relation_idx (relation)
);
```

---

*This document is part of the Universal Entity Architecture specification.*
