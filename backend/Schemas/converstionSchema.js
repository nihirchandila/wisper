import mongoose from "mongoose"
const conversationSchema = mongoose.Schema({
    participants: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user"
        }
    ],
    messages:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "message",
            default: []
        }
    ]

}, {timestamps:true})
export default mongoose.model("conversation", conversationSchema)

