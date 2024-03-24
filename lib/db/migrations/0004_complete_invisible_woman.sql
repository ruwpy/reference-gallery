ALTER TABLE "oauth_account" ADD PRIMARY KEY ("user_id");--> statement-breakpoint
ALTER TABLE "folder" ADD COLUMN "name" text NOT NULL;--> statement-breakpoint
ALTER TABLE "project" ADD COLUMN "name" text NOT NULL;