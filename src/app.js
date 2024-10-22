const express=require("express");

const app=express()

app.use("/user",(req,res,next)=>{
    console.log("request handler 1");
    res.send("response 1");
    next();
},(req,res,next)=>{
    console.log("request handler 2");
    res.send("response 2");
    next();
})

app.listen(3000,()=>{
    console.log("server is succussfully listining on 3000...")
})