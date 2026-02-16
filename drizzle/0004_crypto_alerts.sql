CREATE TABLE `crypto_alerts` (
	`id` char(36) NOT NULL,
	`user_id` varchar(255) NOT NULL,
	`symbol` varchar(20) NOT NULL,
	`pair_symbol` varchar(20) NOT NULL,
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
ALTER TABLE `crypto_alerts` ADD CONSTRAINT `crypto_alerts_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
CREATE INDEX `crypto_alerts_user_id_idx` ON `crypto_alerts` (`user_id`);
--> statement-breakpoint
CREATE INDEX `crypto_alerts_symbol_idx` ON `crypto_alerts` (`symbol`);
--> statement-breakpoint
CREATE INDEX `crypto_alerts_user_active_idx` ON `crypto_alerts` (`user_id`,`triggered`,`acknowledged`);
