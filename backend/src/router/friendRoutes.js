import express from "express";
import friendController from "../app/controllers/friendController.js";

const router = express.Router();

//gửi yêu cầu kết bạn
router.post("/requests", friendController.addFriend);
// chấp nhận yêu cầu kết bạn
router.put("/requests/:requestId/accept", friendController.acceptFriend);
// từ chối yêu cầu kết bạn
router.delete("/requests/:requestId/decline", friendController.declineFriend);
// lấy danh sách yêu cầu kết bạn
router.get("/requests", friendController.getFriendRequests);
// lấy danh sách bạn bè
router.get("/", friendController.getAllFriend);

export default router;