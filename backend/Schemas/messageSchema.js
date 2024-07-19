import mongoose from "mongoose";

const messageSchema = mongoose.Schema({
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    receiverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    message: {
        type: String,
        required: true
    }

}, {timestamps: true})
export default mongoose.model("message", messageSchema)