CREATE TABLE `payments` (
	`id` char(36) NOT NULL,
	`user_id` varchar(255) NOT NULL,
	`stripe_session_id` varchar(255) NOT NULL,
	`stripe_payment_intent_id` varchar(255),
	`amount` int NOT NULL,
	`currency` varchar(10) NOT NULL DEFAULT 'eur',
	`status` varchar(50) NOT NULL DEFAULT 'pending',
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()),
	CONSTRAINT `payments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `users` ADD `stripe_customer_id` varchar(255);--> statement-breakpoint
ALTER TABLE `users` ADD `is_premium` boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE `users` ADD `premium_since` timestamp;--> statement-breakpoint
ALTER TABLE `payments` ADD CONSTRAINT `payments_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `payments_user_id_idx` ON `payments` (`user_id`);--> statement-breakpoint
CREATE INDEX `payments_stripe_session_idx` ON `payments` (`stripe_session_id`);