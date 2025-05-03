ALTER TABLE "product" ADD COLUMN "dealerId" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "product" ADD COLUMN "createdAt" timestamp DEFAULT now();--> statement-breakpoint
ALTER TABLE "product" ADD CONSTRAINT "product_dealerId_dealer_id_fk" FOREIGN KEY ("dealerId") REFERENCES "public"."dealer"("id") ON DELETE no action ON UPDATE no action;