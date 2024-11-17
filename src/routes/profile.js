 const express=require("express");
 const profileRouter=express.Router()
//  const jwt=require('jsonwebtoken')
 const {userAuth}=require('../middleware/auth');
const { validateEditProfileData } = require("../utils/validation");
const bcrypt=require("bcrypt")
const User=require("../models/user");

profileRouter.get("/profile/view", userAuth, async(req,res)=>{
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

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
    try {
       if (!validateEditProfileData(req)) {
          throw new Error("Invalid edit request");
       }
 
       const loggedInUser = req.user;
       console.log(loggedInUser);

       Object.keys(req.body).forEach((key)=>(loggedInUser[key]=req.body[key]))

       await loggedInUser.save()
 
       res.json({
        message:`${loggedInUser.firstName},your profile updated successfully`,
        data:loggedInUser
       });
    } catch (err) {
       res.status(400).send("Error: " + err.message);
    }
 });


 profileRouter.patch("/profile/password",userAuth,async(req,res)=>{
    try{
        const user = req.user
        const{password,updatedPassword}=req.body;
      
        //validate old password
        const isMatch=await bcrypt.compare(password,user.password)
        if(!isMatch){
            throw new Error("password is incorrect")
        }

        //validate new password
        if(updatedPassword.length<8){
            throw new Error("password should be at least  8 characters")
        }

        //Hash and update the new password 
        user.password = updatedPassword
        user.password = await bcrypt.hash(updatedPassword, 10);

        //save the updated user
        await user.save()
        res.json({message:'password changed succufully'})
    }catch(err){
        res.status(400).send("Error: "+ err.message)
    }
 })
module.exports=profileRouter