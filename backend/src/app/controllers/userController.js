import User from "../models/User.js";
import { uploadImageFromBuffer } from "../middleware/uploadMiddleware.js";
class UserController {
    authUser = (req, res) => {
        try {
            const user = req.user;
            return res.status(200).json({
                message: 'User đã được xác thực',
                user,
            });
        } catch (err) {
            console.log('Lỗi khi gọi authUser: ', err);
            return res.status(500).json({ message: 'Lỗi hệ thống' });
        }
    };
    test = (req, res) =>{
        return res.status(204).json({message: "oke"});
    }
    searchUserByUsername = async (req,  res)=>{
        try{
            const {username} = req.query;
            if(!username || username.trim()===""){
                return res.status(400).json({message: "Thiếu thông tin username"});
            }
            const user = await User.findOne({username}).select("_id displayName username avatarUrl ");
            return res.status(200).json({message: "tìm thấy user",user});

        }
        catch(err){
            console.log('Lỗi khi gọi searchUserByUsername: ', err);
            return res.status(500).json({ message: 'Lỗi hệ thống' });
        }
    };
    uploadAvatar = async (req, res)=>{
        try{
            const file = req.file;
            const userId = req.user._id;
            console.log(file);
            if(!file) return res.status(400).json({message: "Không có file upload"});
            const result = await uploadImageFromBuffer(file.buffer);
            const updatedUser = await User.findByIdAndUpdate(
                userId,
                {
                    avatarUrl: result.secure_url,
                    avatarId: result.public_id,
                },
                {new: true}
            ).select("avatarUrl");
            if(!updatedUser) return res.status(400).json({message: "Không thể update avatar"});
            return res.status(200).json({
                message: "Upload avatar thành công",
                avatarUrl: updatedUser.avatarUrl
            })
        }
        catch(err){
            console.log('Lỗi khi gọi uploadAvatar: ', err);
            return res.status(500).json({ message: 'Lỗi hệ thống' });
        }
    }
}

export default new UserController();
