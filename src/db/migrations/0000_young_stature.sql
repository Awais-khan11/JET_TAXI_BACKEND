CREATE TABLE "bookings" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" varchar(255) NOT NULL,
	"code" varchar(6),
	"expires_at" timestamp,
	"name" varchar(255),
	"phone" varchar(20),
	"route" varchar(255),
	"date" varchar(50),
	"time" varchar(50),
	"passengers" integer,
	"payment_method" varchar(50),
	CONSTRAINT "bookings_email_unique" UNIQUE("email")
);
