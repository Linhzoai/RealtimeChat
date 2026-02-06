import User from '../models/User.js';
import Friend from '../models/Friend.js';
import FriendRequest from '../models/FriendRequest.js';

class friendController {
    addFriend = async (req, res) => {
        try {
            let { to, message } = req.body;
            let from = req.user._id.toString();
            //kiểm tra xem clinet có tự gửi lời mời kết bạn cho chính mk
            if (from === to) {
                return res.status(301).json({ message: 'Không thể gửi lời mời cho chính mình' });
            }
            //Kiểm tra xem to có tồn tại hay không
            const userExists = await User.findOne({ _id: to });
            if (!userExists) {
                return res.status(302).json({ message: 'Ngươi dùng không tồn tại' });
            }
            const [alreadyFriend, request] = await Promise.all([
                Friend.findOne({ $or: [{ userA: from, userB: to }, { userA: to, userB: from }] }),
                FriendRequest.findOne({ $or: [{ from: from, to: to }, { from: to, to: from }] }),
            ]);
            if (alreadyFriend) {
                return res.status(303).json({ message: 'Hai người đã là bạn bè' }); 
            }
            if (request) {
                return res.status(304).json({ message: 'Đã có lời mời kết bạn đang chờ' });
            }
            await FriendRequest.create({ from, to, message });
            return res.status(201).json({ message: 'Gửi lời mời kết bạn thành công' });
        } catch (err) {
            console.log('Lỗi khi gửi yêu cầu kết bạn: ' + err);
            return res.status(500).json({ message: 'Lỗi hệ thống' });
        }
    };
    acceptFriend = async (req, res) => {
        try {
            const requestId = req.params.requestId;
            const userId = req.user._id;
            //kiểm tra request id có tồn tại
            const request = await FriendRequest.findById(requestId);
            if (!request) {
                return res.status(404).json({ message: 'Không tìm thấy request Id' });
            }
            //đảm bảo chỉ ng nhận mới có thể chấp nhận yêu cầu  
            if (!request.to.equals(userId)) {
                return res.status(403).json({ message: 'Không có quyền chấp nhận yêu cầu này' });
            }
            //tạo bản ghi friend
            const existedFriend = await Friend.findOne({
                $or: [
                    { userA: request.from, userB: request.to },
                    { userA: request.to, userB: request.from },
                ],
            });
            if (existedFriend) {
                return res.status(400).json({ message: 'Hai người đã là bạn bè' });
            }
            await Friend.create({ 
                userA: request.from, 
                userB: request.to 
            });
            //xóa bản ghi yêu cầu kết bạn cũ
            await FriendRequest.deleteOne({ _id: requestId });
            //lấy dữ liệu ng gửi
            const from = await User.findById(request.from).select('_id displayName avataUrl').lean();
            return res.status(200).json({ message: 'Chấp nhận yêu cầu kết bạn thành công', newFriend: from, });
        } catch (err) {
            console.log('Lỗi khi chấp nhận yêu cầu kết bạn: ' + err);
            return res.status(500).json({ message: 'Lỗi hệ thống' });
        }
    };

    //Từ chối yêu cầu kết bạn
    declineFriend = async (req, res) => {
        try {
            const requestId = req.params.requestId;
            const userId = req.user._id.toString();
            //Kiểm tra requestId có tồn tai không
            const request = await FriendRequest.findById(requestId);
            if(!request){
                return res.status(404).json({ message: 'Không tìm thấy request Id' });
            }
            //Đảm bảo chỉ ng nhận/ng gửi ms có thể từ chối lời mời kết bạn
            if(!request.to.equals(userId)&& !request.from.equals(userId)){
                return res.status(403).json({ message: 'Không có quyền từ chối yêu cầu này' });
            }
            //Xóa bản ghi yêu cầu kết bạn
            await FriendRequest.deleteOne({ _id: requestId });
            return res.status(204).json({ message: 'Từ chối yêu cầu kết bạn thành công' });
        } catch (err) {
            console.log('Lỗi khi từ chối yêu cầu kết bạn: ' + err);
            return res.status(500).json({ message: 'Lỗi hệ thống' });
        }
    };  
    getAllFriend = async (req, res) => {
        try {
            const userId = req.user._id;
            const friendShip = 
                await Friend.find({$or: [{userA: userId},{userB: userId}]})
                .populate("userA", "_id displayName avatarUrl username")
                .populate('userB', "_id displayName avatarUrl username").lean();
            if(!friendShip.length){
                return res.status(200).json({friend: []}); 
            }
            const friend = friendShip.map((f)=> f.userA._id.equals(userId)? f.userB: f.userA);
            return res.status(200).json({friend});
        } catch (err) {
            console.log('Lỗi khi lấy danh sách bạn bè: ' + err);
            return res.status(500).json({ message: 'Lỗi hệ thống' });
        }
    };
    getFriendRequests = async (req, res) => {
        try {
            const userId = req.user._id;
            const populateFields = "_id username displayName avatarUrl";
            const [send, received]= await Promise.all([
                FriendRequest.find({from: userId}).select('to').populate('to',populateFields).lean(),
                FriendRequest.find({to: userId}).select('from').populate('from',populateFields).lean(),
            ])
            return res.status(200).json({send, received});
        } catch (err) {
            console.log('Lỗi khi lấy danh sách yều cầu kết bạn: ' + err);
            return res.status(500).json({ message: 'Lỗi hệ thống' });
        }
    };
}

export default new friendController();
