CREATE TABLE IF NOT EXISTS "Domains" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"weight" integer NOT NULL,
	"order_position" integer NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Topics" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"domain_id" uuid NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"content" text NOT NULL,
	"order_position" integer NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "UserTopicProgress" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"topic_id" uuid NOT NULL,
	"is_confident" boolean DEFAULT false NOT NULL,
	"notes" json,
	"videos" json,
	"last_updated" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Topics" ADD CONSTRAINT "Topics_domain_id_Domains_id_fk" FOREIGN KEY ("domain_id") REFERENCES "public"."Domains"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "UserTopicProgress" ADD CONSTRAINT "UserTopicProgress_user_id_User_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."User"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "UserTopicProgress" ADD CONSTRAINT "UserTopicProgress_topic_id_Topics_id_fk" FOREIGN KEY ("topic_id") REFERENCES "public"."Topics"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "domain_name_idx" ON "Topics" USING btree ("domain_id","name");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "domain_id_idx" ON "Topics" USING btree ("domain_id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "user_topic_idx" ON "UserTopicProgress" USING btree ("user_id","topic_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "user_id_idx" ON "UserTopicProgress" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "topic_id_idx" ON "UserTopicProgress" USING btree ("topic_id");