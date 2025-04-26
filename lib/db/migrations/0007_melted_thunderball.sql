CREATE TABLE IF NOT EXISTS "ContentItems" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"topic_id" uuid NOT NULL,
	"type" varchar NOT NULL,
	"content" text NOT NULL,
	"order_position" integer NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "UserContentProgress" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"content_item_id" uuid NOT NULL,
	"is_completed" boolean DEFAULT false NOT NULL,
	"notes" json,
	"videos" json,
	"last_updated" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
DROP TABLE "UserTopicProgress";--> statement-breakpoint
DROP INDEX IF EXISTS "domain_name_idx";--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ContentItems" ADD CONSTRAINT "ContentItems_topic_id_Topics_id_fk" FOREIGN KEY ("topic_id") REFERENCES "public"."Topics"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "UserContentProgress" ADD CONSTRAINT "UserContentProgress_user_id_User_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."User"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "UserContentProgress" ADD CONSTRAINT "UserContentProgress_content_item_id_ContentItems_id_fk" FOREIGN KEY ("content_item_id") REFERENCES "public"."ContentItems"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "topic_id_idx" ON "ContentItems" USING btree ("topic_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "type_idx" ON "ContentItems" USING btree ("type");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "topic_type_idx" ON "ContentItems" USING btree ("topic_id","type");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "user_id_idx" ON "UserContentProgress" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "content_item_id_idx" ON "UserContentProgress" USING btree ("content_item_id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "user_content_item_idx" ON "UserContentProgress" USING btree ("user_id","content_item_id");--> statement-breakpoint
ALTER TABLE "Topics" DROP COLUMN IF EXISTS "content";