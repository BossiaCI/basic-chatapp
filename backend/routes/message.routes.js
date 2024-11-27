import express from 'express';
import { sendMessage, getMessages } from '../controllers/message.controller.js';
import protectRoute from '../middleware/protectRoute.js';

const router = express.Router();

router.get("/:userID", protectRoute, getMessages)
router.post("/send/:userID", protectRoute, sendMessage)

export default router;