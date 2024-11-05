 const express=require("express");
 const profileRouter=express.Router()
//  const jwt=require('jsonwebtoken')
 const {userAuth}=require('../middleware/auth')

profileRouter.get("/profile",userAuth,async(req,res)=>{
    try{
        const user=req.user
        res.send(user)

    }catch(err){
        res.status(400).send("Error:"+err.message)
    }
    
})

profileRouter.post("/sendConnectionRequest",userAuth,async(req,res)=>{
    //Read user data
    const user=req.user

    //send connection request
    console.log("sending connection request");

    res.send(user.firstName + "  sent the connect request")
})

module.exports=profileRouter