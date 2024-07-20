// import messageSchema from "../Schemas/messageSchema";

import converstionSchema from "../Schemas/converstionSchema.js"
import messageSchema from "../Schemas/messageSchema.js"
import { getReceiverSocketId, io } from "../Socket/socket.js"

const sendMessage = async(req,res)=>{
    try{
        const message = req.body.message
        const receiverId = req.params.id
        const senderId = req.user._id
        //check for conversation with both participants using $all query in mongo
        let findConveration = await converstionSchema.findOne({
            participants:{$all: [senderId, receiverId]}
        })
        //if no converation then create one with both participants
        if(!findConveration){
            findConveration =  await new converstionSchema({participants: [senderId, receiverId]})
        }
        //add message to message schema and save message id to converstaion 
        const newMessage = await new messageSchema({senderId: senderId, receiverId: receiverId, message: message})
        //push to this conversation 
        if(newMessage){
            findConveration.messages.push(newMessage._id)
        }
        //save conversation and message instance
        // newMessage.save()
        // findConveration.save()
        await Promise.all([findConveration.save(), newMessage.save()])
        .then(()=>{
            // SOCKET IO FUNCTIONALITY WILL GO HERE
            const receiverSocketId = getReceiverSocketId(receiverId);
            if (receiverSocketId) {
                // io.to(<socket_id>).emit() used to send events to specific client
                io.to(receiverSocketId).emit("newMessage", newMessage);
            }
            res.json({status: 200, message:"Message Sent", data: newMessage})

        }).catch((err)=>{
            console.log(err)
            res.json({status: 400, message:"There is some error please try again later"})

        })
        
    // parallel execution with promise to reduce time than sequential approach
    }catch(err){
        console.log(err)
        res.json({status: 400, message:"There is some error please try again later"})

    }
}
const getMessages = async (req,res)=>{
   try{
        const receiverId = req.params.id
        const senderId = req.user._id
        const conversation = await converstionSchema.findOne({
            participants: { $all: [senderId, receiverId] },
        }).populate("messages")

        if (!conversation) return res.json({status: 200, data:[]})

        const messages = conversation.messages;

        res.json({status: 200, data:messages})
   }catch(err){
        console.log(err)
        res.json({status: 400, message:"There is some error please try again later"})
   }

}
const getConversations = async (req, res) => {
    try {
      const userId = req.user._id;
      
      // Find all conversations where the logged-in user is a participant
      const conversations = await converstionSchema.find({
        participants: { $in: [userId] },
      }).populate("messages");
  
      if (!conversations.length) return res.json({ status: 200, data: [] });
  
      // Extract messages from all conversations
      const messages = conversations;
  
      res.json({ status: 200, data: messages });
    } catch (err) {
      console.log(err);
      res.json({ status: 400, message: "There is some error, please try again later" });
    }
  };
  


export {sendMessage, getMessages, getConversations}
