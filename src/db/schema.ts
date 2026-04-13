import { pgTable, serial, varchar, integer, timestamp } from "drizzle-orm/pg-core";

export const bookings = pgTable("bookings", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  code: varchar("code", { length: 6 }),
  expiresAt: timestamp("expires_at"),
  name: varchar("name", { length: 255 }),
  phone: varchar("phone", { length: 20 }),
  route: varchar("route", { length: 255 }),
  date: varchar("date", { length: 50 }),
  time: varchar("time", { length: 50 }),
  passengers: integer("passengers"),
  paymentMethod: varchar("payment_method", { length: 50 }),
});