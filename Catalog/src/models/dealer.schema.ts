// import { serial } from "drizzle-orm/mysql-core";
import { pgTable,serial, timestamp, varchar } from "drizzle-orm/pg-core";

export const dealer=pgTable('dealer',{
    id: serial("id").primaryKey().notNull(),
    username: varchar("username").notNull(),
    email: varchar("email").notNull(),
    password: varchar("password").notNull(),
    role: varchar("role").default('Dealer'),
    salt: varchar("salt").notNull(),
    createdAt: timestamp("createdAt").defaultNow()
})