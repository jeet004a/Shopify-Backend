
import { relations } from 'drizzle-orm'
import { integer, timestamp ,varchar} from 'drizzle-orm/pg-core'
import { serial } from 'drizzle-orm/pg-core'
import {pgTable} from 'drizzle-orm/pg-core'


export const orders=pgTable('orders',{
    id: serial("id").primaryKey(),
    orderNumber: varchar("order_number",{ length: 255 }).notNull().unique(),
    customerId: integer("customer_id").notNull(),
    amount: integer("amount").notNull(),
    status: varchar("status").notNull(),
    txnId: varchar("txn_id").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow()
})


export const orderLineItems=pgTable('order_line_items',{
    id: serial("id").primaryKey(),
    itemName: varchar("item_name").notNull(),
    qty: integer("qty").notNull(),
    price: integer("price").notNull(),
    orderId: integer("order_id").references(()=>orders.id,{onDelete:"cascade"}).notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow()
})

export const orderRelations=relations(orders,({many})=>({
    lineItems: many(orderLineItems)
}))

export const orderItemRelations=relations(orderLineItems,({one})=>({
    order: one(orders,{
        fields: [orderLineItems.id],
        references: [orders.id]
    })
}))