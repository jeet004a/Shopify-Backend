import {pgTable,serial, varchar, text, timestamp} from 'drizzle-orm/pg-core';

export const user=pgTable("users",{
    id: serial("id").primaryKey(),
    firstName: varchar("first_name",{length: 255}).notNull(),
    lastName: varchar("last_name",{length:255}),
    email: varchar("email",{length:255}).notNull(),
    password: varchar("password").notNull(),
    salt: varchar("salt").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull()
})