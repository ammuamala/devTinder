const express=require("express");
const connectDB=require("./config/database")
const app=express()
const mongoose=require("mongoose");
const User=require("./models/user")

app.post("/signup",async(req,res)=>{
    //creat a new instance of the user model
    const user=new User({
        firstName:"krishna",
        lastName:"pabolu",
        emailId:"pabolu.krishna@gmail.com",
        password:"jdshla132",
    })
    try{
        await user.save()
        res.send("user added successfaully")
    }catch(err){
        res.status(400).send("Error saving the user:"+ err.message)
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
