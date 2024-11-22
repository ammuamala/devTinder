const mongoose=require("mongoose");

const connectionRequestSchema=new mongoose.Schema({
    fromUserId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",//reference to the user collection
        required:true,
    },
    toUserId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
    },
    status:{
        type:String,
        required:true,
        enum:{
            values:['ignore','interested','accepted','rejected'],
            message:`{VALUES} is incorrected status type`
        },
    },
},
{timestamps:true},
)

connectionRequestSchema.pre("save",function(next){
    const connectionRequest=this
    //check if the fromUserId is same as to UserId
    if(connectionRequest.fromUserId.equals(connectionRequest.toUserId)){
        return next(new Error("Cannot send a connection request to yourself"));
    }
    next();
})


const connectionRequestModel=new mongoose.model(
    "ConnectionRequest",
    connectionRequestSchema
)

module.exports=connectionRequestModel;