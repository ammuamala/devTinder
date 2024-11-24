const express=require("express");
const userRouter=express.Router();
const { userAuth } = require('../middleware/auth');
const User=require('../models/user')
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

userRouter.get("/feed",userAuth,async(req,res)=>{
    try{
      const loggedInUser=req.user;
      const page=parseInt(req.query.page)//1
      const limit=parseInt(req.query.limit)//10

      const skip=(page-1)*limit

      const connectionRequest=await ConnectionRequest.find({
        $or:[{fromUserId:loggedInUser._id},{toUserId:loggedInUser._id}],
      }).select("fromUserId toUserId")

      const hideUsersFromFeed=new Set();
      connectionRequest.forEach((req)=>{
        hideUsersFromFeed.add(req.fromUserId.toString())
        hideUsersFromFeed.add(req.toUserId.toString())
      });

      const users=await User.find({
        $and:[
           {_id:{$nin:Array.from(hideUsersFromFeed)}},
           {_id:{$ne:loggedInUser._id}},
        ],      
      }).select(USER_SAFE_DATA)
        .skip(skip)
        .limit(limit)

      console.log(users)

      res.send(users)
    } catch (err) {
        res.status(400).send("Error: " + err.message);
    }
});


module.exports=userRouter