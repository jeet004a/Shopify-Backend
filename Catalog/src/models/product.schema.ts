// import { serial } from 'drizzle-orm/mysql-core'
import {pgTable,serial,varchar,integer, timestamp} from 'drizzle-orm/pg-core'
import { dealer } from './dealer.schema'

export const product=pgTable('product',{
    id: serial("id").primaryKey().notNull(),
    name: varchar("name",{length:255}).notNull(),
    description: varchar("description",{length:255}).notNull(),
    category: varchar("category").notNull(),
    price: integer("price").notNull(),
    imageUrl: varchar("imageUrl",{length:255}).notNull(),
    stock: integer("stock").notNull(),
    dealerId: integer("dealerId").references(()=>dealer.id).notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().notNull()
})