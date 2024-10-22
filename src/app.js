const express=require("express");

const app=express()

const {adminAuth,userAuth}=require("./middleware/auth")

app.use('/admin',adminAuth,userAuth)

app.get('/user',(req,res)=>{
    res.send("get all users")
})

app.get('/admin/getAlldata',(req,res)=>{
    res.send("all data sent")
   
    
});
app.get("/admin/deleteUser",(req,res)=>{
   res.send("deleted a user");
   
})

app.listen(3000,()=>{
    console.log("server is succussfully listining on 3000...")
})