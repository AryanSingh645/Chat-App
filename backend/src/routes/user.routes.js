import { Router } from "express";
import { loginUser, signupUser } from "../controllers/auth.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const router  = Router();

router.route("/signup").post(
    upload.single('avatar'),
    signupUser
);

router.route("/login").post(loginUser)


export default router;