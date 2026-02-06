import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    hashPassword: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    displayName:{
        type: String,
        required: true,
        trim: true
    },
    avatarUrl:{
        type: String,
    },
    avatarId:{
        type: String,
    },
    bio: {
        type: String,
        maxLength: 500,
    },
    phoneNumber: {
        type: String,
        sparse: true,
    },
    
},{
    timestamps: true,
});

const User = mongoose.model("User", UserSchema);
export default User;
