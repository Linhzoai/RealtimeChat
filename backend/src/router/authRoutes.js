import express from 'express';
import AuthController from '../app/controllers/authController.js';
const router = express.Router();
//đăng ký người dùng
router.post('/signup', AuthController.signUp);
//đăng nhập người dùng
router.post('/signin', AuthController.signIn);
//đăng xuất người dùng
router.post('/signout', AuthController.signOut);
//Cấp access token
router.get('/refresh-token', AuthController.refreshToken);
export default router;
