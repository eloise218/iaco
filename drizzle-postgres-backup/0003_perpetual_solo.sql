ALTER TABLE "users" ALTER COLUMN "verification_status" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "verification_status" SET DEFAULT 'pending';