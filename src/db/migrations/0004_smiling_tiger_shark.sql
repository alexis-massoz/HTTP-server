ALTER TABLE "users" ADD COLUMN "token" varchar(256) DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_token_unique" UNIQUE("token");