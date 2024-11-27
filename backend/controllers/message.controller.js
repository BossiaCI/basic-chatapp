import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";

export const sendMessage = async (req, res) => {
    console.log("message sent", req.params.userID)
    try {
      const { message } = req.body;
      const { userID:receiverID } = req.params;
      const senderID = req.user._id;

      // check in db if there is an occurence of conversation
      let conversation =await Conversation.findOne({
        participants: { $all: [senderID, receiverID] },
      })

      // if conversation does not exists
      if(!conversation){
        conversation = await Conversation.create({
            participants: [senderID, receiverID],
        })
      }

      const newMessage = new Message({
        senderID,
        receiverID,
        message,
      })

      if(newMessage){
        conversation.messages.push(newMessage._id);
      }

      // SOCKET IO WILL GO HERE


      // await conversation.save();
      // await newMessage.save();

      // this will run in parallel
      await Promise.all([conversation.save(), newMessage.save()]);

    res.status(201).json(newMessage)

    } catch (error) {
        console.log("Error in sendMessage controller: ", error.message);
        res.status(500).json({error: "Internal server error"})
    }
}

export const getMessages = async (req, res) => {
  try {
    const { userID:userToChatID } = req.params;
    const senderID = req.user._id;
    const conversation = await Conversation.findOne({
      participants: { $all: [senderID, userToChatID] },
    }).populate("messages"); // NOT REFERENCE BUT ACTUAL MESSAGES 

    if(!conversation) return res.status(200).json([]);

    const messages = conversation.messages;

    res.status(200).json(messages);

  } catch (error) {
    console.log("Error in getMessages controller: ", error.message);
    res.status(500).json({error: "Internal server error"})
  }
}