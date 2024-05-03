import { Controller } from "./Controller";
import { ChangeProfileDetailsService } from "../services/changeProfileDetailsService";
import { Response, RequestHandler } from "express";
import { authenticateToken, RequestWithUser } from "../../util/authenticateToken";

export class ChangeProfileDetailsController extends Controller {
  constructor(private changeProfileDetailsService: ChangeProfileDetailsService) {
    super("/details");
    this.initializeRoutes();
  }

  private initializeRoutes = () => {
    this.router.post("/", authenticateToken, this.changeDetails);
  };

  private changeDetails: RequestHandler = async (req: RequestWithUser, res: Response) => {
    const { email, password, name, surname, phoneNumber, dateOfBirthday, description } = req.body;
    const userId = Number(req.user?.id);
    const result = await this.changeProfileDetailsService.changeDetails(
      userId,
      email,
      password,
      name,
      surname,
      phoneNumber,
      dateOfBirthday,
      description
    );

    if (result?.error) {
      return res.status(400).json({ error: result.error });
    }

    return res.status(200).json(result);
  };
}
