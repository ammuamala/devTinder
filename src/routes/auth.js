const express=require("express");
const authRouter=express.Router();
const{validateSignUpData}=require("../utils/validation")
const User=require("../models/user");
const bcrypt=require("bcrypt")

authRouter.post("/signup",async(req,res)=>{
    try{
      //validate of data
      validateSignUpData(req);

      const {firstName,lastName,emailId,password}=req.body;

      //Encrypt the password
      const passwordHash=await bcrypt.hash(password,10);
      console.log(passwordHash)
 
      //creat a new instance of the user model
       const user=new User({
        firstName,
        lastName,
        emailId,
        password:passwordHash
       })

       await user.save()
       res.send("user added successfaully")
    }catch(err){
        res.status(400).send("Error saving the user:"+ err.message)
    }
})

authRouter.post("/login",async(req,res)=>{
    try{
        const {emailId,password}=req.body;

        const user=await User.findOne({emailId:emailId})
        if(!user){
            throw new Error("Invalid emailId")
        }
        const isPasswordvalid =await user.validatePassword(password)

        if(isPasswordvalid){
            //Create JWT Token
           const token=await user.getJWT()
            //Add the token to cookie and send the response back to the user
            res.cookie("token",token,{
                expires:new Date(Date.now()+8*360000)
            })
            res.send("login succussfully")

        }else{
            throw new Error("Invalid password")
        }
    }catch(err){
        res.status(400).send("Error saving the user:"+ err.message)
    }
})

module.exports=authRouter;