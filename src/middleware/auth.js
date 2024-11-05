const jwt=require("jsonwebtoken");
const User=require("../models/user")

const userAuth=async (req,res,next)=>{
    //read the token from cookie
    try{
    const {token}=req.cookies;
    if(!token){
        throw new Error("Invalid token!!!!!!!")
    }

    //validate the token
    const decodedMessage=await jwt.verify(token,"amala1234")

    const {_id}=decodedMessage;

    //find user
    const user=await User.findById(_id)
    if(!user){
        throw new Error("user not found")
    }
    req.user=user
    next();
}catch(err){
    res.status(400).send("ERROR: "+err.message)
}

}

module.exports={userAuth}

