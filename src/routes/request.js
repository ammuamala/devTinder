const express=require("express");
const requestRouter=express.Router();
const User = require("../models/user");
const {userAuth}=require("../middleware/auth");
const ConnectionRequest=require("../models/connectionRequest")

requestRouter.post("/request/send/:status/:toUserId",userAuth,async(req,res)=>{
    try{
        const fromUserId=req.user._id;
        const toUserId=req.params.toUserId;
        const status=req.params.status;

        const allowedStatus=["ignore","interested"];
        if(!allowedStatus.includes(status)){
            return res.status(400).json({message:"Invalid status type: "+status})
        }

        //If there is an existing connectionRequest
        const existingConnectionRequest=await ConnectionRequest.findOne({
            $or:[
                {fromUserId,toUserId},
                {fromUserId:toUserId,toUserId:fromUserId},
            ],
        });
        if(existingConnectionRequest){
            return res 
            .status(400)
            .send({message:"Connection Request Already Exists!!"})
        }
        //if u give random id which is not present in db,it gives a error
        const toUser=await User.findById(toUserId)
        if(!toUser){
            return res.status(404).json({message:"user not found"})
        }
        
        const connectionRequest=new ConnectionRequest({
            fromUserId,
            toUserId,
             status,
        })
        const data=await connectionRequest.save();
        res.json({message:"connection Request sent succussfully",
        data,
        })
   }catch(err){
        res.status(400).send("ERROR: "+err.message);
    }
})

module.exports=requestRouter