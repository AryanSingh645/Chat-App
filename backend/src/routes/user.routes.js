import { Router } from "express";
import { loginUser, logoutUser, signupUser } from "../controllers/auth.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJwt } from "../middlewares/auth.middleware.js"

const router  = Router();

router.route("/signup").post(
    upload.single('avatar'),
    signupUser
);

router.route("/login").post(loginUser);
router.route("/logout").post(verifyJwt, logoutUser);



export default router;