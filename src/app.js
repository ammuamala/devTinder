const express=require("express");
const connectDB=require("./config/database")
const app=express()
const mongoose=require("mongoose");
const User=require("./models/user");
const { ReturnDocument } = require("mongodb");
const{validateSignUpData}=require("./utils/validation")
// const cookieParser=require("cookie-parser")

app.use(express.json())
// app.use(cookieParser())

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
        const isPasswordvalid =await bcrypt.compare(password,user.password)

        if(isPasswordvalid){
            // res.cookie("token","abcdefhidoajfakddddddddmadmowierjkjdsnf")
            // res.send("login succusfully")
        }else{
            throw new Error("Invalid password")
        }
    }catch(err){
        res.status(400).send("Error saving the user:"+ err.message)
    }
})

// app.get("/profile",async(req,res)=>{
//     const cookie=req.cookies;

//     console.log(cookie);
//     res.send("Reading cookies")
// })
   

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
app.patch("/user/:userId",async(req,res)=>{
    const userId=req.params?.userId;
    const data=req.body;

    const ALLOWED_UPDATES=["userId","photoUrl","firstName","lastName","skills","age","gender"]
    const isUpdatedAllowed=Object.keys(data).every((k)=>ALLOWED_UPDATES.includes(k))

    if(!isUpdatedAllowed){
        res.status(400).send("update not allowed")
    }
    if(data?. skills. length > 10){ 
        throw new Error("skills or not more than 10")
     }
    try{
        const user=await User.findByIdAndUpdate({_id:userId},data,{runValidators:true},)
        
        res.send("user updated successfully")
       
    }catch(err){
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
