import express from "express";
import conversationController from "../app/controllers/conversationController.js";
import {checkFriendship} from "../app/middleware/friendMiddleware.js";

const router = express.Router();

router.post("/", checkFriendship, conversationController.createConversation);
router.get("/", conversationController.getConversation);
router.get("/:conversationId/messages",conversationController.getMessages);
router.patch("/:conversationId/seen", conversationController.markAsSeen);
export default router;