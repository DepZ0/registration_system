import { ChangeProfileDetailsDb } from "../../database/changeProfileDetailsDb";

export class ChangeProfileDetailsService {
  constructor(private changeProfileDetailsDb: ChangeProfileDetailsDb) {}
  public changeDetails = async (
    userId: number,
    email: string,
    password: string,
    name: string,
    surname: string,
    phoneNumber: string,
    dateOfBirthday: string,
    description: string
  ): Promise<{ error?: string; message?: string }> => {
    const changeDetails = await this.changeProfileDetailsDb.changeProfileDetails(
      userId,
      email,
      password,
      name,
      surname,
      phoneNumber,
      dateOfBirthday,
      description
    );
    return changeDetails;
  };
}
