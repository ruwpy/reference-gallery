CREATE TABLE IF NOT EXISTS "users_to_projects" (
	"user_id" text NOT NULL,
	"project_id" text NOT NULL,
	CONSTRAINT "users_to_projects_project_id_user_id_pk" PRIMARY KEY("project_id","user_id")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "users_to_projects" ADD CONSTRAINT "users_to_projects_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "users_to_projects" ADD CONSTRAINT "users_to_projects_project_id_project_id_fk" FOREIGN KEY ("project_id") REFERENCES "project"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
