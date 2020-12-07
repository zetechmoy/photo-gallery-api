import { Router } from "express";
import { login, changePassword } from "../controllers/auth.controller";
import { checkJsonWebToken } from "../libs/checkJwt";

const router = Router();
//Login route
router.post("/login", login);

//Change my password
router.post("/change-password", [checkJsonWebToken], changePassword);

export default router;
