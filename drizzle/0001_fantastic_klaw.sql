CREATE TABLE "borrow_request" (
	"id" text PRIMARY KEY NOT NULL,
	"item_id" text NOT NULL,
	"requester_id" text NOT NULL,
	"message" text,
	"start_date" text,
	"end_date" text,
	"status" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "borrow_request" ADD CONSTRAINT "borrow_request_item_id_item_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."item"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "borrow_request" ADD CONSTRAINT "borrow_request_requester_id_user_id_fk" FOREIGN KEY ("requester_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;