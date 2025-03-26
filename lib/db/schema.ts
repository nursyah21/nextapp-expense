import { sql } from "drizzle-orm";
import { integer, pgTable, varchar } from "drizzle-orm/pg-core";

export const expensetable = pgTable("expenses", {
    id: varchar({ length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
    description: varchar({ length: 255 }).notNull(),
    amount: integer().notNull(),
    userid: varchar({ length: 36 }).notNull().references(() => usertable.id),
});

export const usertable = pgTable("users", {
    id: varchar({ length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
    email: varchar({ length: 255 }).notNull(),
    password: varchar({ length: 255 }).notNull(),
});