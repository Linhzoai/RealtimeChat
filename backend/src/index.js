
//Khái báo hàm từ các file tiện ích
import configApp from "./config/configApp.js";
import router from "./router/index.js";
import connectDB from "./config/database.js";
import {server, app} from "./socket/index.js";

//cấu hình app
configApp(app);
//khai báo router
router(app);

//khai báo port
const port = process.env.DB_PORT || 8080;
const host = process.env.DB_HOST || "localhost";

//khai báo kết nối database
connectDB().then(()=>{
    //khởi động server
    server.listen(port, host, () => console.log(`Server is running on http://${host}:${port}`));
});
