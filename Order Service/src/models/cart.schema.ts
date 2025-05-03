
import { relations } from 'drizzle-orm'
import { integer, timestamp ,varchar} from 'drizzle-orm/pg-core'
import { serial } from 'drizzle-orm/pg-core'
import {pgTable} from 'drizzle-orm/pg-core'

export const carts=pgTable('carts',{
    id: serial("id").primaryKey(),
    customerId: integer("customer_id").unique().notNull(),
    createdAt:timestamp('created_at').notNull().defaultNow(),
    updatedAt:timestamp('updated_at').notNull().defaultNow()
})


export const cartLineItems=pgTable('cart_line_items',{
    id: serial("id").primaryKey(),
    productId: integer("product_id").notNull(),
    cartId: integer("cart_id").references(()=>carts.id,{onDelete:"cascade"}).notNull(),
    itemName: varchar("item_name").notNull(),
    category: varchar("category").notNull(),
    qty: integer("qty").notNull(),
    price: integer("price").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
})

export const cartRelations=relations(carts,({many})=>({
    lineItems: many(cartLineItems)
}))

export const lineItemsRelations=relations(cartLineItems,({one})=>({
    cart:one(carts,{
        fields: [cartLineItems.cartId],
        references: [carts.id]
    })
}))