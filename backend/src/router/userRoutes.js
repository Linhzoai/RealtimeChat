import express from "express";
import userController from "../app/controllers/userController.js";
import {upload} from "../app/middleware/uploadMiddleware.js";
const router = express.Router();

router.get("/me", userController.authUser);
router.get("/test", userController.test);
router.get("/search", userController.searchUserByUsername);
router.post("/uploadAvatar", upload.single("avatar"),userController.uploadAvatar);
export default router;