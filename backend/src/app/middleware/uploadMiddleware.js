import multer from "multer";
import {v2 as cloudinary} from "cloudinary";
import { imageFilter } from "../../helper/uploadHelper.js";
export const upload = multer({
    storage: multer.memoryStorage(),
    limits:{
        fileSize: 1024 * 1024 * 10,//10mb
    },
})
const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, Path2D.join(__dirname, "../public/images"));
    },
    filename: function(req, file, cb){
        cb(null, Date.now() + "-" + req.body?.conversationId + "-" +file.originalname);
    }
});

export const uploadImage = multer({storage, fileFilter: imageFilter});
export const uploadImageFromBuffer = (buffer, options)=>{
    return new Promise((resolve, reject)=>{
        const uploadStream = cloudinary.uploader.upload_stream({
            folder: "realtime-chat/avatars",
            resource_type: "image",
            transformation: [{width: 200, height: 200, crop: "fill"}],
            ...options
        },
        (error, result)=>{
            if(error){
                reject(error);
            }else{
                resolve(result);
            }
        });
        uploadStream.end(buffer);
    })
}