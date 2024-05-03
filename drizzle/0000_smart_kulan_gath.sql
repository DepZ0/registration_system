CREATE TABLE IF NOT EXISTS "refreshTokens" (
	"id" integer,
	"userId" integer,
	"token" text,
	"createdAt" timestamp,
	"expiresIn" date,
	"device" varchar(200)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" integer,
	"email" varchar(200),
	"password" varchar(80),
	"name" varchar(50),
	"surname" varchar(50),
	"phoneNumber" varchar(30),
	"dateOfBirthday" date,
	"description" varchar(300)
);
