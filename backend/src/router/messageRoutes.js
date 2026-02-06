import express from "express";
import messageController from "../app/controllers/messageController.js";
import {checkFriendship, checkGroupMembership} from "../app/middleware/friendMiddleware.js";
const router = express.Router();

router.post("/direct", checkFriendship, messageController.sendDirectMessage);
router.post("/group",checkGroupMembership, messageController.sendGroupMessages);
export default router;