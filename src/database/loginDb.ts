import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { refreshTokens, users } from "../schema";
import { Pool } from "pg";
import { and, eq, sql } from "drizzle-orm";
import { validateEmail, validatePassword } from "../util/validation";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export class LoginDb {
  constructor(private db: NodePgDatabase, private pool: Pool) {}

  public login = async (userAgent: string, email: string, password: string) => {
    const emailError = validateEmail(email);
    if (emailError) {
      return emailError;
    }

    const passwordError = validatePassword(password);
    if (passwordError) {
      return passwordError;
    }

    const user = await this.db.select().from(users).where(eq(users.email, email)).execute();
    if (user.length === 0) {
      return { error: "User with this email not found" };
    }

    const passwordIsValid = bcrypt.compareSync(password, user[0].password);
    if (!passwordIsValid) {
      return { error: "Incorrect password" };
    }

    const accessToken = jwt.sign({ id: user[0].userId }, process.env.JWT_SECRET_KEY, { expiresIn: "1h" });
    const refreshToken = jwt.sign({ id: user[0].userId }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "7d" });

    const sessionsIdGeneration = (await this.db.select().from(refreshTokens)).length + 1;
    const existingToken = await this.db
      .select()
      .from(refreshTokens)
      .where(and(eq(refreshTokens.userId, Number(user[0].userId)), eq(refreshTokens.device, userAgent)))
      .execute();

    let refreshTokenExpiresIn;
    if (existingToken.length === 0) {
      refreshTokenExpiresIn = new Date();
      refreshTokenExpiresIn.setDate(refreshTokenExpiresIn.getDate() + 7); // 7 days later

      await this.db
        .insert(refreshTokens)
        .values({
          id: sessionsIdGeneration,
          userId: user[0].userId,
          token: refreshToken,
          createdAt: sql`CURRENT_TIMESTAMP`,
          expiresIn: sql`NOW() + INTERVAL '7 days'`,
          device: userAgent,
        })
        .execute();
    } else {
      refreshTokenExpiresIn = existingToken[0].expiresIn;

      await this.db
        .update(refreshTokens)
        .set({
          token: refreshToken,
          createdAt: sql`CURRENT_TIMESTAMP`,
          expiresIn: sql`NOW() + INTERVAL '7 days'`,
        })
        .where(eq(refreshTokens.device, userAgent))
        .execute();
    }

    return { accessToken, refreshToken, refreshTokenExpiresIn };
  };
}
