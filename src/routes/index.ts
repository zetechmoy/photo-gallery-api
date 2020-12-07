import { Router } from 'express'
import { getPhotos, createPhoto, deletePhoto, getPhoto, updatePhoto } from '../controllers/photo.controller'
import auth from "./auth";
import user from "./user";
import photo from "./photo";

const router = Router();

router.use("/auth", auth);
router.use("/user", user);

// photo
router.use("/photo", photo);


export default router;
