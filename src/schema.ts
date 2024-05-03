import { pgTable, varchar, integer, date, text, timestamp } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  userId: integer("id"),
  email: varchar("email", { length: 200 }),
  password: varchar("password", { length: 80 }),
  name: varchar("name", { length: 50 }),
  surname: varchar("surname", { length: 50 }),
  phoneNumber: varchar("phoneNumber", { length: 30 }),
  dateOfBirthday: date("dateOfBirthday"),
  description: varchar("description", { length: 300 }),
});

export const refreshTokens = pgTable("refreshTokens", {
  id: integer("id"),
  userId: integer("userId"),
  token: text("token"),
  createdAt: timestamp("createdAt"),
  expiresIn: date("expiresIn"),
  device: varchar("device", { length: 200 }),
});
