CREATE TABLE "dealer" (
	"id" serial PRIMARY KEY NOT NULL,
	"username" varchar NOT NULL,
	"email" varchar NOT NULL,
	"password" varchar NOT NULL,
	"salt" varchar NOT NULL,
	"createdAt" timestamp DEFAULT now()
);
