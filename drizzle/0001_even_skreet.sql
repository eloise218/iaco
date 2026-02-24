CREATE TABLE `cookie_consent` (
	`user_id` varchar(255) NOT NULL,
	`consented_at` timestamp NOT NULL DEFAULT (now()),
	`last_refreshed_at` timestamp NOT NULL DEFAULT (now()),
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()),
	CONSTRAINT `cookie_consent_user_id` PRIMARY KEY(`user_id`)
);
--> statement-breakpoint
ALTER TABLE `cookie_consent` ADD CONSTRAINT `cookie_consent_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;