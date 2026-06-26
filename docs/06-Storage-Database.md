# 06 - Storage & Database Design

## Universal Entity Architecture (UEA)

**Version:** 1.0  
**Status:** Technical Specification

---

## 1. Overview

This document defines the storage layer of the UEA platform.

---

## 2. Core Tables

### entities
Primary table storing all Entities.

### entity_relations
Graph connections between Entities.

### entity_behaviors
Actions that Entities can perform.

### entity_roles
Roles that Entities play.

### execution_logs
Runtime execution tracking.

### system_events
Event-driven architecture messages.

---

## 3. Benefits

- **Flexibility** - New types require no schema changes
- **Unified Queries** - Same queries work for all types
- **Graph Queries** - Recursive CTEs for traversal

---

*This document is part of the Universal Entity Architecture specification.*
