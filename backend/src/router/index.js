import authRoutes from "./authRoutes.js";
import userRoutes from "./userRoutes.js";
import authMiddleware from "../app/middleware/authMiddleware.js";
import friendRoutes from "./friendRoutes.js";
import messageRoutes from "./messageRoutes.js";
import conversationRoute from "./conversationRoute.js";
const router = (app) =>{
    //public routes
    app.use("/api/auth", authRoutes);
    
    //private routes
    app.use(authMiddleware);
    app.use("/api/users", userRoutes);
    app.use("/api/friends", friendRoutes);
    app.use("/api/message", messageRoutes);
    app.use("/api/conversation", conversationRoute);
};
export default router;