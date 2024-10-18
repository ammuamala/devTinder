const express=require("express");

const app=express()

app.get('/user/:userId/:password/:name',(req,res)=>{
    console.log(req.params)
    res.send({firstName:'amala',lastName:'polisetty'})
})

app.listen(3000,()=>{
    console.log("server is succussfully listining on 3000...")
})