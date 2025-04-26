ALTER TABLE "ContentItems" ALTER COLUMN "content" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "ContentItems" ADD COLUMN "name" text NOT NULL;