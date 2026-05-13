CREATE TABLE "event_templates" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"theme" text DEFAULT '' NOT NULL,
	"time" text DEFAULT '19:00' NOT NULL,
	"total" integer DEFAULT 30 NOT NULL,
	"host" text DEFAULT '' NOT NULL,
	"tags" text[] DEFAULT '{}' NOT NULL,
	"created_at" timestamp DEFAULT now()
);
