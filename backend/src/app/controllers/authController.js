import bcrypt from 'bcrypt';
import User from '../models/User.js';
import Session from '../models/Session.js';
import jwt from 'jsonwebtoken'; 
import crypto from 'crypto';
const saltRounds = 10;
const ACCESS_TOKEN_TTL = '30m';
const REFRESH_TOKEN_TTL = 14 * 24 * 60 * 60 * 1000;
class AuthController {

    //Đăng ký người dùng
    signUp = async (req, res) => {
        try {
            const { username, email, password, firstName, lastName, phoneNumber, } = req.body;
            if (!username || !email || !password ) {
                return res.status(400).json({ message: 'Các trường username, email, password, displayName là bắt buộc', });
            }

            //kiểm tra xem username đã tồn tại chưa
            const duplicate = await User.findOne({ username });
            if (duplicate) {
                return res.status(409).json({ message: 'Username đã tồn tại' });
            }

            //mã hóa password
            const hashPassword = await bcrypt.hash(password, saltRounds);

            //tạo user mới
            await User.create({
                username,
                email,
                hashPassword,
                displayName: `${firstName} ${lastName}`,
                phoneNumber,
            });

            //return
            return res.sendStatus(204);
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: 'Lỗi khi gọi signup' });
        }
    };
    
    //Đăng nhập người dùng
    signIn = async (req, res) =>{
        try{
            const {username, password} = req.body;
            if(!username || !password){
                return res.status(400).json({message: 'Các trường username, password không được để trống'});
            }
            //kiểm tra username có tồn tại hay không
            const user = await User.findOne({username});
            if(!user){
                return res.status(401).json({message: 'username không tồn tại'});
            }
            else{
                const isPasswordValid = await bcrypt.compare(password, user.hashPassword);
                if(!isPasswordValid){
                    return res.status(401).json({message: 'Sai mật khẩu'});
                }
                else{
                    //tạo access token và refresh token
                    const accessToken = jwt.sign(
                        {userId: user._id},
                        process.env.ACCESS_TOKEN_SECRET,
                        {expiresIn: ACCESS_TOKEN_TTL}
                    );

                    const refreshToken = crypto.randomBytes(64).toString('hex');
                    //tạo session mới để lưu thông tin refresh token
                    await Session.create({
                        userId: user._id,
                        refreshToken,
                        expiresAt: Date.now() + REFRESH_TOKEN_TTL,
                    })
                    //trả refresh token cho cookie
                    res.cookie('refreshToken', refreshToken, {
                        httpOnly: true,
                        secure: true,
                        sameSite: 'none', //backend và frontend deployment khác nhau
                        maxAge: REFRESH_TOKEN_TTL,
                    })

                    //trả access token cho response
                    return res.json({message: `${user.displayName} đã đăng nhập thành công`, accessToken});
                }
            }

        }
        catch(error){
            console.log(error);
            return res.status(500).json({ message: 'Lỗi khi gọi signIn' });
        }
    }

    //Đăng xuất người dùng
    signOut = async (req, res) => {
        try{
            const refreshToken = req.cookies?.refreshToken;
            if(!refreshToken){
                return res.status(401).json({message: 'Không tìm thấy refresh token'});
            }
            else{
                //xóa refresh token
                await Session.deleteOne({refreshToken});
                //xóa cookie
                res.clearCookie('refreshToken');
                return res.sendStatus(204);
            }
            
        }
        catch(error){
            console.log(error);
            return res.status(500).json({ message: 'Lỗi khi gọi signOut' });
        }
    }

    //Cấp access token
    refreshToken = async (req, res) => {
        try{
            //lây refreshtoken từ cookie
            const token= req.cookies?.refreshToken;
            if(!token){
                return res.status(401).json({message: 'Không tìm thấy refresh token'});
            }
            //so sánh với refresh token trong database
            const session = await Session.findOne({refreshToken: token});
            if(!session){
                return res.status(403).json({message: 'Refresh token không hợp lệ'});
            }

            //kiểm tra xem refresh token có còn hiệu lực hay không
            if(session.expiresAt <  new Date()){
                return res.status(403).json({message: 'Refresh token đã hết hạn'});
            }

            //tạo access token mới
            const accessToken = jwt.sign(
                {userId: session.userId},
                process.env.ACCESS_TOKEN_SECRET,
                {expiresIn: ACCESS_TOKEN_TTL}
            );

            //return
            return res.status(200).json({accessToken});
        }
        catch(err){
            console.log("Lỗi khi gọi refreshToken", err);
            return res.status(500).json({ message: 'Lỗi hệ thống' });
        }
    }
}

export default new AuthController();
