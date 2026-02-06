export const imageFilter = (req, file, cb) => {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
        req.fileValidationError = 'Please upload an image';
        return cb(new Error('Please upload an image'), false);
    }
    cb(null, true);
};
