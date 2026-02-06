import mongoose from "mongoose";

const friendSchema = new mongoose.Schema({
    userA: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    userB: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    }
})

friendSchema.pre('save', function(next){
    const a = this.userA;
    const b = this.userB;
    if(a > b){
        this.userA = new mongoose.Types.ObjectId(b);
        this.userB = new mongoose.Types.ObjectId(a);
    }
    next;
})

friendSchema.index({userA: 1, userB: 1}, {unique: true});

export default mongoose.model("Friend", friendSchema);
