ALTER TABLE "product" ADD COLUMN "updatedAt" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "dealer" ADD COLUMN "role" varchar DEFAULT 'Dealer';