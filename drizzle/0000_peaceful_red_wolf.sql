CREATE TYPE "public"."reservation_status" AS ENUM('pending', 'confirmed', 'seated', 'cancelled', 'no_show');--> statement-breakpoint
CREATE TABLE "closures" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "closures_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"date" date NOT NULL,
	"starts_at" time,
	"ends_at" time,
	"reason" varchar(140),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "opening_hours" (
	"day_of_week" integer PRIMARY KEY NOT NULL,
	"opens_at" time NOT NULL,
	"closes_at" time NOT NULL,
	"closed" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE "reservations" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "reservations_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"reference" varchar(8) NOT NULL,
	"date" date NOT NULL,
	"starts_at" time NOT NULL,
	"party_size" integer NOT NULL,
	"table_id" integer,
	"status" "reservation_status" DEFAULT 'confirmed' NOT NULL,
	"guest_name" varchar(120) NOT NULL,
	"guest_email" varchar(200) NOT NULL,
	"guest_phone" varchar(40) NOT NULL,
	"notes" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"cancelled_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "tables" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "tables_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" varchar(40) NOT NULL,
	"seats" integer NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "tables_name_unique" UNIQUE("name")
);
--> statement-breakpoint
ALTER TABLE "reservations" ADD CONSTRAINT "reservations_table_id_tables_id_fk" FOREIGN KEY ("table_id") REFERENCES "public"."tables"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "closures_date_idx" ON "closures" USING btree ("date");--> statement-breakpoint
CREATE UNIQUE INDEX "reservations_reference_idx" ON "reservations" USING btree ("reference");--> statement-breakpoint
CREATE INDEX "reservations_date_time_idx" ON "reservations" USING btree ("date","starts_at");