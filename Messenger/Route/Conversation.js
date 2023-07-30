import express, { response } from "express"
import formidable from "express-formidable"
import Conversation from "../Modal/Conversation.js";


const router = express.Router()

//new conv

router.post("/", formidable() ,async (req, res) => {
  const senderIdConver = await Conversation.find({
    members:[req.fields.senderId,req.fields.receiverId]
  })
  const receiverIdConver = await Conversation.find({
    members:[req.fields.receiverId,req.fields.senderId]
  })
  if(senderIdConver[0] || receiverIdConver[0]){
    res.status(200).send({success:false,conversation:senderIdConver[0] || receiverIdConver[0],message:"conversation already built"});
  } else {
    const newConversation = new Conversation({
      members: [req.fields.senderId, req.fields.receiverId],
    });
  
    try {
      const savedConversation = await newConversation.save();
      res.status(200).send({success:true,conversation:savedConversation,message:"created success"});
    } catch (err) {
      res.status(500).send({success:false,err});
    }
  }
  });
  
  //get conv of a user
  
  router.get("/:userId", async (req, res) => {
    try {
      const conversation = await Conversation.find(
        {members:{ $in: [req.params.userId]}}
        );
      res.status(200).send({success:true,conversation});
    } catch (err) {
      res.status(500).send({success:false,err});
    }
  });

export default router