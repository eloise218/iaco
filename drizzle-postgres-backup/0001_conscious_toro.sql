ALTER TABLE "user_profiles" ALTER COLUMN "investment_objectives" SET DEFAULT '{}';--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "verified" boolean DEFAULT false;