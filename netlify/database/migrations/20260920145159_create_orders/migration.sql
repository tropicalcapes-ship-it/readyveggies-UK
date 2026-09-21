CREATE TABLE "orders" (
	"id" serial PRIMARY KEY,
	"reference" text NOT NULL UNIQUE,
	"customer_name" text NOT NULL,
	"email" text NOT NULL,
	"phone" text,
	"address" text NOT NULL,
	"postcode" text NOT NULL,
	"delivery_day" text NOT NULL,
	"notes" text,
	"items" jsonb NOT NULL,
	"subtotal_pence" integer NOT NULL,
	"delivery_pence" integer NOT NULL,
	"total_pence" integer NOT NULL,
	"created_at" timestamp DEFAULT now()
);
