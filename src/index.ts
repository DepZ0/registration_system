import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { App } from "./app";
import "dotenv/config";
import { RegistrationDb } from "./database/registrationDb";
import { RegistrationService } from "./express/services/registrationService";
import { RegistrationController } from "./express/controllers/registrationController";
import { LoginDb } from "./database/loginDb";
import { LoginService } from "./express/services/loginService";
import { LoginController } from "./express/controllers/loginController";
import { ChangeProfileDetailsDb } from "./database/changeProfileDetailsDb";
import { ChangeProfileDetailsService } from "./express/services/changeProfileDetailsService";
import { ChangeProfileDetailsController } from "./express/controllers/changeProfileDetailsController";
import { LogoutDb } from "./database/logoutDb";
import { LogoutService } from "./express/services/logoutService";
import { LogoutController } from "./express/controllers/logoutController";
import { RefreshTokenDb } from "./database/refreshTokenDb";
import { RefreshTokenService } from "./express/services/refreshTokenService";
import { RefreshTokenController } from "./express/controllers/refreshTokenController";
import { DeleteAccountDb } from "./database/deleteAccountDb";
import { DeleteAccountService } from "./express/services/deleteAccountService";
import { DeleteAccountController } from "./express/controllers/deleteAccountController";

async function main() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const db = drizzle(pool, { logger: false });

  await migrate(db, { migrationsFolder: "drizzle" });

  const registrationDb = new RegistrationDb(db, pool);
  const registrationService = new RegistrationService(registrationDb);
  const registrationController = new RegistrationController(registrationService);

  const loginDb = new LoginDb(db, pool);
  const loginService = new LoginService(loginDb);
  const loginController = new LoginController(loginService);

  const changeProfileDetailsDb = new ChangeProfileDetailsDb(db, pool);
  const changeProfileDetailsService = new ChangeProfileDetailsService(changeProfileDetailsDb);
  const changeProfileDetailsController = new ChangeProfileDetailsController(changeProfileDetailsService);

  const logoutDb = new LogoutDb(db, pool);
  const logoutService = new LogoutService(logoutDb);
  const logoutController = new LogoutController(logoutService);

  const refreshTokenDb = new RefreshTokenDb(db, pool);
  const refreshTokenService = new RefreshTokenService(refreshTokenDb);
  const refreshTokenController = new RefreshTokenController(refreshTokenService);

  const deleteAccountDb = new DeleteAccountDb(db, pool);
  const deleteAccountService = new DeleteAccountService(deleteAccountDb);
  const deleteAccountController = new DeleteAccountController(deleteAccountService);

  const app = new App(3000, [
    registrationController,
    loginController,
    changeProfileDetailsController,
    logoutController,
    refreshTokenController,
    deleteAccountController,
  ]);
  app.start();
}

main();
