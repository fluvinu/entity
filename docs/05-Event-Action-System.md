# 05 - Event & Action System

## Universal Entity Architecture (UEA)

**Version:** 1.0  
**Status:** Technical Specification

---

## 1. Overview

This document defines how Entities communicate, trigger actions, and respond to events.

---

## 2. Core Concepts

- **Events** - Messages that something has occurred
- **Actions** - Behaviors executed in response to events
- **Listeners** - Subscribe to events and trigger actions

---

## 3. Event Types

### Entity Lifecycle Events
- `entity.created`, `entity.updated`, `entity.deleted`

### State Change Events
- `state.changed`, `state.transition`

### Behavior Events
- `behavior.triggered`, `behavior.completed`, `behavior.failed`

### Execution Events
- `execution.started`, `execution.completed`, `execution.failed`

---

## 4. Behavior Execution Model

1. **Direct Invocation** - User action triggers behavior
2. **Event-Driven Invocation** - State change triggers behavior
3. **Scheduled Invocation** - Time-based trigger

---

## 5. Execution Lifecycle

```
PENDING -> RUNNING -> COMPLETED/FAILED/CANCELLED
```

---

*This document is part of the Universal Entity Architecture specification.*
