import { Router } from "express";
import { sendMessage, getMessage } from "../controllers/message.controller.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";

const router = Router();

router.post('/send/:id', verifyJwt, sendMessage);
router.get('/:id', verifyJwt, getMessage);

export default router;