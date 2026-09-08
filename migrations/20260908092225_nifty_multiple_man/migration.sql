CREATE TABLE "role_workspace" (
	"id" text PRIMARY KEY,
	"user_id" text NOT NULL,
	"target_role_id" text NOT NULL,
	"status" text DEFAULT 'draft' NOT NULL,
	"seniority" text,
	"location" text,
	"specialization" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "target_role" (
	"id" text PRIMARY KEY,
	"user_id" text NOT NULL,
	"type" text NOT NULL,
	"supported_key" text,
	"name" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "role_workspace_user_id_index" ON "role_workspace" ("user_id");--> statement-breakpoint
CREATE INDEX "role_workspace_user_id_updated_at_index" ON "role_workspace" ("user_id","updated_at" DESC NULLS LAST);--> statement-breakpoint
CREATE INDEX "role_workspace_target_role_id_index" ON "role_workspace" ("target_role_id");--> statement-breakpoint
CREATE INDEX "target_role_user_id_index" ON "target_role" ("user_id");--> statement-breakpoint
CREATE INDEX "target_role_user_id_type_index" ON "target_role" ("user_id","type");--> statement-breakpoint
ALTER TABLE "role_workspace" ADD CONSTRAINT "role_workspace_user_id_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "role_workspace" ADD CONSTRAINT "role_workspace_target_role_id_target_role_id_fkey" FOREIGN KEY ("target_role_id") REFERENCES "target_role"("id") ON DELETE RESTRICT;--> statement-breakpoint
ALTER TABLE "target_role" ADD CONSTRAINT "target_role_user_id_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE;