CREATE TABLE `account` (
	`id` varchar(255) NOT NULL,
	`user_id` varchar(255) NOT NULL,
	`account_id` varchar(255) NOT NULL,
	`provider_id` varchar(255) NOT NULL,
	`access_token` text,
	`refresh_token` text,
	`id_token` text,
	`access_token_expires_at` timestamp,
	`refresh_token_expires_at` timestamp,
	`scope` varchar(255),
	`password` text,
	`created_at` timestamp NOT NULL,
	`updated_at` timestamp NOT NULL,
	CONSTRAINT `account_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `binance_credentials` (
	`user_id` varchar(255) NOT NULL,
	`api_key_encrypted` text NOT NULL,
	`api_secret_encrypted` text NOT NULL,
	`is_active` boolean DEFAULT true,
	`last_sync` timestamp,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()),
	CONSTRAINT `binance_credentials_user_id` PRIMARY KEY(`user_id`)
);
--> statement-breakpoint
CREATE TABLE `chat_messages` (
	`id` char(36) NOT NULL,
	`user_id` varchar(255) NOT NULL,
	`content` text NOT NULL,
	`role` varchar(20) NOT NULL,
	`metadata` json DEFAULT (JSON_OBJECT()),
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `chat_messages_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `crypto_alerts` (
	`id` char(36) NOT NULL,
	`user_id` varchar(255) NOT NULL,
	`symbol` varchar(20) NOT NULL,
	`pair_symbol` varchar(20) NOT NULL,
	`alert_type` varchar(20) DEFAULT 'price',
	`is_active` boolean DEFAULT true,
	`threshold` decimal(20,8) NOT NULL,
	`initial_price` decimal(20,8) NOT NULL,
	`initial_side` varchar(5) NOT NULL,
	`triggered` boolean DEFAULT false,
	`triggered_at` timestamp,
	`triggered_price` decimal(20,8),
	`acknowledged` boolean DEFAULT false,
	`acknowledged_at` timestamp,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()),
	CONSTRAINT `crypto_alerts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `portfolio_assets` (
	`id` char(36) NOT NULL,
	`user_id` varchar(255) NOT NULL,
	`symbol` varchar(50) NOT NULL,
	`amount` decimal(20,8) NOT NULL,
	`last_sync` timestamp DEFAULT (now()),
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()),
	CONSTRAINT `portfolio_assets_id` PRIMARY KEY(`id`),
	CONSTRAINT `portfolio_assets_user_symbol_idx` UNIQUE(`user_id`,`symbol`)
);
--> statement-breakpoint
CREATE TABLE `price_cache` (
	`symbol` varchar(50) NOT NULL,
	`price` decimal(20,8) NOT NULL,
	`change_24h` decimal(20,8) NOT NULL,
	`change_percent_24h` decimal(10,4) NOT NULL,
	`last_updated` timestamp DEFAULT (now()),
	CONSTRAINT `price_cache_symbol` PRIMARY KEY(`symbol`)
);
--> statement-breakpoint
CREATE TABLE `session` (
	`id` varchar(255) NOT NULL,
	`user_id` varchar(255) NOT NULL,
	`expires_at` timestamp NOT NULL,
	`token` text NOT NULL,
	`created_at` timestamp NOT NULL,
	`updated_at` timestamp NOT NULL,
	`ip_address` varchar(255),
	`user_agent` text,
	CONSTRAINT `session_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `user_profiles` (
	`user_id` varchar(255) NOT NULL,
	`experience_level` varchar(50) NOT NULL DEFAULT 'beginner',
	`investment_objectives` json DEFAULT (JSON_ARRAY()),
	`risk_tolerance` varchar(50) DEFAULT 'low',
	`completed_onboarding` boolean DEFAULT false,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()),
	CONSTRAINT `user_profiles_user_id` PRIMARY KEY(`user_id`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` varchar(255) NOT NULL,
	`phone` varchar(50),
	`email` varchar(255) NOT NULL,
	`email_verified` boolean DEFAULT false,
	`verified` boolean DEFAULT false,
	`verification_status` varchar(50) DEFAULT 'pending',
	`name` varchar(255),
	`image` text,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()),
	CONSTRAINT `users_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `verification` (
	`id` varchar(255) NOT NULL,
	`identifier` varchar(255) NOT NULL,
	`value` text NOT NULL,
	`expires_at` timestamp NOT NULL,
	`created_at` timestamp,
	`updated_at` timestamp,
	CONSTRAINT `verification_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `account` ADD CONSTRAINT `account_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `binance_credentials` ADD CONSTRAINT `binance_credentials_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `chat_messages` ADD CONSTRAINT `chat_messages_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `crypto_alerts` ADD CONSTRAINT `crypto_alerts_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `portfolio_assets` ADD CONSTRAINT `portfolio_assets_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `session` ADD CONSTRAINT `session_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `user_profiles` ADD CONSTRAINT `user_profiles_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `binance_credentials_is_active_idx` ON `binance_credentials` (`is_active`);--> statement-breakpoint
CREATE INDEX `binance_credentials_last_sync_idx` ON `binance_credentials` (`last_sync`);--> statement-breakpoint
CREATE INDEX `chat_messages_user_id_idx` ON `chat_messages` (`user_id`);--> statement-breakpoint
CREATE INDEX `chat_messages_role_idx` ON `chat_messages` (`role`);--> statement-breakpoint
CREATE INDEX `chat_messages_created_at_idx` ON `chat_messages` (`created_at`);--> statement-breakpoint
CREATE INDEX `crypto_alerts_user_id_idx` ON `crypto_alerts` (`user_id`);--> statement-breakpoint
CREATE INDEX `crypto_alerts_symbol_idx` ON `crypto_alerts` (`symbol`);--> statement-breakpoint
CREATE INDEX `crypto_alerts_user_active_idx` ON `crypto_alerts` (`user_id`,`triggered`,`acknowledged`);--> statement-breakpoint
CREATE INDEX `portfolio_assets_user_id_idx` ON `portfolio_assets` (`user_id`);--> statement-breakpoint
CREATE INDEX `portfolio_assets_symbol_idx` ON `portfolio_assets` (`symbol`);--> statement-breakpoint
CREATE INDEX `portfolio_assets_last_sync_idx` ON `portfolio_assets` (`last_sync`);--> statement-breakpoint
CREATE INDEX `price_cache_last_updated_idx` ON `price_cache` (`last_updated`);--> statement-breakpoint
CREATE INDEX `user_profiles_experience_level_idx` ON `user_profiles` (`experience_level`);--> statement-breakpoint
CREATE INDEX `user_profiles_completed_onboarding_idx` ON `user_profiles` (`completed_onboarding`);