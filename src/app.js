const express=require("express");

const app=express()

app.use('/test',(req,res)=>{
    res.send("hello from the server")
});

app.use('/hello',(req,res)=>{
    res.send("hello hello hello")
})

app.listen(3000,()=>{
    console.log("server is succussfully listining on 3000...")
})