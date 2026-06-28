CREATE TABLE `entities` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`kind` varchar(100) NOT NULL DEFAULT 'entity',
	`version` varchar(20) NOT NULL DEFAULT '1.0',
	`properties` json,
	`state` json,
	`metadata` json,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `entities_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `entity_behaviors` (
	`id` int AUTO_INCREMENT NOT NULL,
	`entity_id` bigint unsigned NOT NULL,
	`name` varchar(100) NOT NULL,
	`behavior_type` varchar(50) NOT NULL DEFAULT 'action',
	`config` json,
	`is_active` int DEFAULT 1,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `entity_behaviors_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `entity_relations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`source_id` bigint unsigned NOT NULL,
	`relation` varchar(50) NOT NULL,
	`target_id` bigint unsigned NOT NULL,
	`metadata` json,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `entity_relations_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `entity_roles` (
	`id` int AUTO_INCREMENT NOT NULL,
	`entity_id` bigint unsigned NOT NULL,
	`role` enum('UI','DATA','WORKFLOW','API','DATABASE','PERMISSION','NOTIFICATION','PLUGIN','AI_TOOL','SCHEDULER','REPORT','SEARCH_INDEX','COMPONENT','PAGE','APPLICATION') NOT NULL,
	`config` json,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `entity_roles_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `execution_logs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`entity_id` bigint unsigned NOT NULL,
	`behavior_id` bigint unsigned,
	`execution_type` varchar(50) NOT NULL DEFAULT 'manual',
	`status` enum('pending','running','completed','failed','cancelled') NOT NULL DEFAULT 'pending',
	`input` json,
	`output` json,
	`error` text,
	`duration_ms` int,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `execution_logs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `system_events` (
	`id` int AUTO_INCREMENT NOT NULL,
	`event_type` varchar(50) NOT NULL,
	`entity_id` bigint unsigned,
	`payload` json,
	`processed` int DEFAULT 0,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `system_events_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE INDEX `kind_idx` ON `entities` (`kind`);--> statement-breakpoint
CREATE INDEX `name_idx` ON `entities` (`name`);--> statement-breakpoint
CREATE INDEX `created_at_idx` ON `entities` (`created_at`);--> statement-breakpoint
CREATE INDEX `behavior_entity_idx` ON `entity_behaviors` (`entity_id`);--> statement-breakpoint
CREATE INDEX `behavior_type_idx` ON `entity_behaviors` (`behavior_type`);--> statement-breakpoint
CREATE INDEX `source_idx` ON `entity_relations` (`source_id`);--> statement-breakpoint
CREATE INDEX `target_idx` ON `entity_relations` (`target_id`);--> statement-breakpoint
CREATE INDEX `relation_idx` ON `entity_relations` (`relation`);--> statement-breakpoint
CREATE INDEX `role_entity_idx` ON `entity_roles` (`entity_id`);--> statement-breakpoint
CREATE INDEX `role_idx` ON `entity_roles` (`role`);--> statement-breakpoint
CREATE INDEX `exec_entity_idx` ON `execution_logs` (`entity_id`);--> statement-breakpoint
CREATE INDEX `exec_status_idx` ON `execution_logs` (`status`);--> statement-breakpoint
CREATE INDEX `exec_created_idx` ON `execution_logs` (`created_at`);--> statement-breakpoint
CREATE INDEX `event_type_idx` ON `system_events` (`event_type`);--> statement-breakpoint
CREATE INDEX `event_entity_idx` ON `system_events` (`entity_id`);--> statement-breakpoint
CREATE INDEX `event_processed_idx` ON `system_events` (`processed`);