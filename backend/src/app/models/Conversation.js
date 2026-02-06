import mongoose from "mongoose";

const participantSchema = new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    joinAt: {
        type: Date,
        default: Date.now(),
    }
},{ _id: false, })

const groupSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true,
    },
    createBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    }

},{_id: false})

const lastMessageSchema = new mongoose.Schema({
    _id: { type: String },
    content: {
        type: String,
        default: null,
    },
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    }
},{_id: false, timestamps: true})

const conversationSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['direct', 'group'],
        required: true,
    },
    participants: [{
        type:  participantSchema,
        required: true,
    }],
    group: {
        type: groupSchema,
    },
    lastMessageAt: {
        type: Date,
    },
    seenBy: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
    lastMessage: {
        type: lastMessageSchema,
        default: null,
    },
    unreadCount: {
        type: Map,
        of: Number,
        default:{},
    }
}, {timestamps: true})

conversationSchema.index({'participants.userId': 1, 'lastMessageAt': -1});

export default mongoose.model('Conversation', conversationSchema);