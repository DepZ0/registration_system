import { RequestHandler } from "express";
import { Controller } from "./Controller";
import { RefreshTokenService } from "../services/refreshTokenService";

export class RefreshTokenController extends Controller {
  constructor(private refreshTokenService: RefreshTokenService) {
    super("/refresh-token");
    this.initializeRoutes();
  }

  private initializeRoutes = () => {
    this.router.post("/", this.refreshToken);
  };

  private refreshToken: RequestHandler = async (req, res) => {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(403).json({ error: "Access is forbidden" });
    }

    const result = await this.refreshTokenService.refreshToken(req.headers["user-agent"] || "unknown", refreshToken);

    if (result?.error) {
      return res.status(403).json({ error: result.error });
    }

    return res.status(200).json({ accessToken: result.accessToken });
  };
}
