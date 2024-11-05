const express=require("express");
const connectDB=require("./config/database")
const app=express()
const mongoose=require("mongoose");
const User=require("./models/user");
const { ReturnDocument } = require("mongodb");
const{validateSignUpData}=require("./utils/validation")
const cookieParser=require("cookie-parser")
const jwt=require('jsonwebtoken')
const {userAuth}=require('./middleware/auth')

app.use(express.json())
app.use(cookieParser())

const bcrypt=require("bcrypt")

app.post("/signup",async(req,res)=>{
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
    
   
app.post("/login",async(req,res)=>{
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

app.get("/profile",userAuth,async(req,res)=>{
    try{
        const user=req.user
        res.send(user)

    }catch(err){
        res.status(400).send("Error:"+err.message)
    }
    
})

app.post("/sendConnectionRequest",userAuth,async(req,res)=>{
    //Read user data
    const user=req.user

    //send connection request
    console.log("sending connection request");

    res.send(user.firstName + "  sent the connect request")
})


connectDB()
.then(()=>{
    console.log("database connection established...")
    app.listen(3000,()=>{
        console.log("server is succussfully listining on 3000...")
    })

}).catch((err)=>{
    console.log("database cannot be connected")
})
