import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { users } from "../schema";
import { eq } from "drizzle-orm";
import { Pool } from "pg";

export class ProfileDb {
  constructor(private db: NodePgDatabase, private pool: Pool) {}

  public findPofile = async (userId: number) => {
    const profile = await this.db.select().from(users).where(eq(users.userId, userId));

    return { ...profile[0], password: undefined };
  };
}
