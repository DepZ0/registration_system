import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { refreshTokens, users } from "../schema";
import { eq, sql } from "drizzle-orm";
import jwt from "jsonwebtoken";
import { Pool } from "pg";

export class RefreshTokenDb {
  constructor(private db: NodePgDatabase, pool: Pool) {}

  public refreshToken = async (userAgent: string, refreshToken: string) => {
    const token = await this.db.select().from(refreshTokens).where(eq(refreshTokens.token, refreshToken)).execute();
    if (token.length === 0) {
      return { error: "Invalid refresh token" };
    }

    try {
      jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    } catch (err) {
      return { error: "Invalid refresh token" };
    }

    const accessToken = jwt.sign({ id: token[0].userId }, process.env.JWT_SECRET_KEY, { expiresIn: "1h" });
    return { accessToken };
  };
}
