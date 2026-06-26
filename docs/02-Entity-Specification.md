# 02 - Universal Entity Specification

## Universal Entity Architecture (UEA)

**Version:** 1.0  
**Status:** Technical Specification

---

## 1. Overview

This document defines the fundamental Entity model that powers the entire UEA platform. Every feature, component, and behavior in the system is represented as an Entity.

---

## 2. Entity Structure

Every Entity contains the following sections:

```
Entity
├── Identity
├── Properties
├── State
├── Relations
├── Behaviors
├── Children
└── Metadata
```

---

## 3. Identity

Defines what uniquely identifies the Entity.

| Field | Type | Description |
|-------|------|-------------|
| `id` | integer | System-generated unique identifier |
| `name` | string | Human-readable name of the Entity |
| `kind` | string | The type/category of the Entity |
| `version` | string | Semantic version of the Entity definition |

---

## 4. Properties

Describes what the Entity **is**. Properties are static descriptors that define the Entity's characteristics. Properties are **completely dynamic** - there is no fixed schema.

### Examples

```json
{
  "text": "Login",
  "width": 200,
  "color": "blue",
  "fontSize": 18,
  "apiUrl": "/login",
  "tableName": "users"
}
```

---

## 5. State

Represents **runtime** information about the Entity. State changes during execution.

### Examples

```json
{
  "loading": false,
  "selected": true,
  "hidden": false,
  "disabled": false,
  "expanded": true,
  "error": null,
  "success": true
}
```

---

## 6. Relations

Defines how Entities **connect** to each other. Relations create a graph structure.

### Supported Relation Types

| Relation | Description |
|----------|-------------|
| `contains` | Parent-child containment |
| `belongsTo` | Membership in a group |
| `calls` | Invocation of another Entity |
| `dependsOn` | Dependency relationship |
| `reads` | Read access to data |
| `writes` | Write access to data |
| `extends` | Extension/inheritance |
| `inherits` | Property inheritance |
| `references` | Non-owning reference |

---

## 7. Behaviors

Defines possible **actions** that an Entity can perform or respond to.

### Examples

- `click` - Triggered on user interaction
- `submit` - Form submission
- `save` - Persist data
- `validate` - Check data integrity
- `execute` - Run a workflow
- `sendEmail` - Send notification
- `navigate` - Change location

---

## 8. Children

Any Entity can contain child Entities. There is no depth limit.

### Composition Hierarchy

```
Entity
  -> Component
    -> Section
      -> Page
        -> Feature
          -> Application
```

---

## 9. Metadata

Extra information about the Entity.

| Field | Type | Description |
|-------|------|-------------|
| `createdBy` | string | User/system that created the Entity |
| `createdAt` | datetime | Creation timestamp |
| `updatedAt` | datetime | Last modification timestamp |
| `permissions` | object | Access control rules |
| `tags` | array | Categorization tags |
| `owner` | string | Entity owner |

---

## 10. Entity Roles

An Entity may play multiple roles. Role defines interpretation, not structure.

### Supported Roles

| Role | Interpreted By |
|------|---------------|
| `UI` | UI Engine |
| `DATA` | Database Engine |
| `WORKFLOW` | Backend Engine |
| `API` | Backend Engine |
| `DATABASE` | Database Engine |
| `PERMISSION` | Permission Engine |
| `NOTIFICATION` | Notification Engine |
| `PLUGIN` | Plugin Engine |
| `AI_TOOL` | AI Engine |
| `SCHEDULER` | Scheduler Engine |
| `REPORT` | Report Engine |
| `SEARCH_INDEX` | Search Engine |
| `COMPONENT` | UI Engine |
| `PAGE` | UI Engine |
| `APPLICATION` | All Engines |

---

## 11. Database Schema

```sql
CREATE TABLE entities (
  id          SERIAL PRIMARY KEY,
  name        VARCHAR(255) NOT NULL,
  kind        VARCHAR(100) NOT NULL DEFAULT 'entity',
  version     VARCHAR(20) NOT NULL DEFAULT '1.0',
  properties  JSON,
  state       JSON,
  metadata    JSON,
  created_at  TIMESTAMP DEFAULT NOW(),
  updated_at  TIMESTAMP DEFAULT NOW()
);
```

---

*This document is part of the Universal Entity Architecture specification.*
