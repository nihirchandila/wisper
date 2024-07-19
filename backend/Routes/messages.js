import express from "express"
const router = express.Router()
import { sendMessage, getMessages,getConversations } from "../Controllers/message.js"
import { verify } from "../Middleware/protectedRoute.js"

router.post("/send/:id", verify, sendMessage)
router.post("/get/:id", verify, getMessages)
router.post("/getConversaiton", verify, getConversations)



export default router   