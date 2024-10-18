const express=require("express");

const app=express()

app.use('/user',(req,res)=>{
    res.send("abrakadabra")
})

app.get('/user',(req,res)=>{
    res.send({firstName:"amala",lastname:"polisetty"})
});



app.post('/user',(req,res)=>{
    res.send("Data successfully saved to the database")
})
app.delete('/user',(req,res)=>{
    res.send("deleted succussfully")
})


app.listen(3000,()=>{
    console.log("server is succussfully listining on 3000...")
})