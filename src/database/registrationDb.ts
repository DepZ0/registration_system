import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { users } from "../schema";
import { Pool } from "pg";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

export class RegistrationDb {
  constructor(private db: NodePgDatabase, private pool: Pool) {}
  public registration = async (email: string, password: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return { error: "Invalid email format" };
    }

    if (!password || !email) {
      return { error: "Requires a password and either email or nickname" };
    }

    const existingUsers = await this.db.select().from(users).where(eq(users.email, email)).execute();
    if (existingUsers.length > 0) {
      return { error: "User with this email already exists" };
    }

    if (password.length < 6) {
      return { error: "Invalid password. Minimum length 6 characters" };
    }

    const accountsIdGeneration = (await this.db.select().from(users)).length + 1;
    const insertUser = async (user: NewUser) => {
      return this.db.insert(users).values(user);
    };

    const hashedPassword = bcrypt.hashSync(password, 5);
    const newUser: NewUser = { userId: accountsIdGeneration, email: email, password: hashedPassword };
    await insertUser(newUser);
  };
}

type NewUser = typeof users.$inferInsert;
