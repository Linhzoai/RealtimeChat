export default imageFilter = (req, file, cb)=>{
    if(!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)){
        return cb(new Error("Upload only image"), false);
    }
    return cb(null, true);
}