
import { Router } from "express";
import { checkJsonWebToken } from "../libs/checkJwt";
import { checkRole } from "../libs/checkRole";
import upload from '../libs/multer';
import { createPhoto, getPhoto, getPhotos, deletePhoto, updatePhoto } from "../controllers/photo.controller";

const router = Router();


//get pics
router.get("/list", [checkJsonWebToken], getPhotos);

//upload pic
router.post("/", [checkJsonWebToken], upload.single('image'), createPhoto);

//manage pic
router.get("/:id", [checkJsonWebToken], getPhoto)
router.delete("/:id", [checkJsonWebToken], deletePhoto)
router.put("/:id", [checkJsonWebToken], updatePhoto);

export default router;
