import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { users } from "../schema";
import { Pool } from "pg";
import { eq } from "drizzle-orm";
import { validateEmail, validatePassword, validateName, validateSurname } from "../util/validation";
import bcrypt from "bcryptjs";

export class ChangeProfileDetailsDb {
  constructor(private db: NodePgDatabase, private pool: Pool) {}

  public changeProfileDetails = async (
    userId: number,
    email?: string,
    password?: string,
    name?: string,
    surname?: string,
    phoneNumber?: string,
    dateOfBirthday?: string,
    description?: string
  ) => {
    const updateData: Partial<NewUser> = {};

    if (email) {
      const emailError = validateEmail(email);
      if (emailError) {
        return emailError;
      }

      const existingUsers = await this.db.select().from(users).where(eq(users.email, email)).execute();
      if (existingUsers.length > 0 && existingUsers[0].userId !== userId) {
        return { error: "User with this email already exists" };
      }

      updateData.email = email;
    }

    if (password) {
      const passwordError = validatePassword(password);
      if (passwordError) {
        return passwordError;
      }

      updateData.password = bcrypt.hashSync(password, 8);
    }

    if (name) {
      const nameError = validateName(name);
      if (nameError) {
        return nameError;
      }

      updateData.name = name;
    }

    if (surname) {
      const surnameError = validateSurname(surname);
      if (surnameError) {
        return surnameError;
      }

      updateData.surname = surname;
    }

    if (phoneNumber) {
      updateData.phoneNumber = phoneNumber;
    }

    if (dateOfBirthday) {
      updateData.dateOfBirthday = dateOfBirthday;
    }

    if (description) {
      updateData.description = description;
    }

    await this.db.update(users).set(updateData).where(eq(users.userId, userId)).execute();

    return { message: "Profile details updated successfully" };
  };
}
type NewUser = typeof users.$inferInsert;
