const express=require("express");
const connectDB=require("./config/database")
const app=express()
const mongoose=require("mongoose");
const User=require("./models/user");
const { ReturnDocument } = require("mongodb");

app.use(express.json())

app.post("/signup",async(req,res)=>{
   
    // //creat a new instance of the user model
    const user=new User(req.body)
    try{
        await user.save()
        res.send("user added successfaully")
    }catch(err){
        res.status(400).send("Error saving the user:"+ err.message)
    }
})

//Get user by email
app.get('/user',async(req,res)=>{
  const userEmail=req.body.emailId

  try{
    const user=await User.find({emailId:userEmail})
    if(user.length===0){
        res.status(404).send("user not found")
    }else{
        res.send(user)
    }
    
  }catch(err){
    res.status(404).send("something went wrong")
  }
})

//Get all the users
app.get("/feed", async(req,res)=>{
    try{
        const users=await User.find({})
        res.send(users)
    }catch(err){
        res.status(400).send("something went wrong")
    }
})

//GET USER BY EMAIL
app.get("/oneuser",async(req,res)=>{
    const userEmail=req.body.id;
    try{
        const user=await User.findById({_id:userEmail})
        res.send(user)
    }catch(err){
        res.status(400).send("something went wrong")
    }
})

//Delete user by Id
app.delete("/user",async(req,res)=>{
    const userId=req.body.userId;
    try{
        const user=await User.findByIdAndDelete(userId)
        res.send("user deleted succussfully")

    }catch(err){
        res.status(400).send('something went wrong')
    }
})

//update data of the user
app.patch("/user",async(req,res)=>{
    const userId=req.body.userId;
    const data=req.body;

    try{
        const user=await User.findByIdAndUpdate({_id:userId},data,{returnDocument:"after"})
        console.log(user)
        res.send("user updated successfully")
    }
   
    catch(err){
        res.status(400).send('something went wrong')
    }
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
