import { Router } from "express";
import { listAll, getOneById, newUser, editUser, deleteUser } from "../controllers/user.controller";
import { checkRole } from "../libs/checkRole";
import { checkJsonWebToken } from "../libs/checkJwt";

const router = Router();

//Get all users
router.get("/", [checkJsonWebToken, checkRole(["ADMIN"])], listAll);

// Get one user
router.get("/:id", [checkJsonWebToken, checkRole(["ADMIN"])], getOneById);

//Create a new user
router.post("/", [checkJsonWebToken, checkRole(["ADMIN"])], newUser);

//Edit one user
router.patch("/:id", [checkJsonWebToken, checkRole(["ADMIN"])], editUser);

//Delete one user
router.delete("/:id", [checkJsonWebToken, checkRole(["ADMIN"])], deleteUser);

export default router;
