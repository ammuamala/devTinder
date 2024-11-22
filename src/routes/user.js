const express=require("express");
const userRouter=express.Router();
const { userAuth } = require('../middleware/auth');
const ConnectionRequest=require('../models/connectionRequest')

const USER_SAFE_DATA="firstName lastName photoUrl age gender about skills"

userRouter.get("/user/request/received",userAuth,async(req,res)=>{
    try{
        const loggeInuser=req.user 
        
        const connectionRequest=await ConnectionRequest.find({
            toUserId:loggeInuser._id,
            status:"accepted"
        }).populate("fromUserId",["firstName","lastName"])
        res.json({message:"Data fetched successfully",data:connectionRequest})

    }catch(err){
        req.statusCode(400).send("Error: "+err.message)
    }
})

userRouter.get("/user/connections",userAuth,async(req,res)=>{
    try{
        const loggedInuser=req.body

        const connectionRequest=await ConnectionRequest.find({
            $or:[
                {toUserId:loggedInuser._id,status:"accepted"},
                {fromUserId:loggedInuser._id,status:"accepted"},
                {toUserId:loggedInuser._id,status:"rejected"},
                {fromUserId:loggedInuser._id,status:"rejected"}
            ],
           
                
          
        })
        .populate("fromUserID",USER_SAFE_DATA)
        .populate("toUserId",USER_SAFE_DATA)

        console.log(connectionRequest)

        const data=connectionRequests.map((row)=>{
            if(row.fromUserId._id.toString() === loggedInuser._id.toString()){
                return row.toUserId;
            }
            return row.fromUserId
        })
        res.json({data});
    }catch(err){
        req.statusCode(400).send("Error: "+err.message)
    }
})



module.exports=userRouter