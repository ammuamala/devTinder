const mongoose = require("mongoose")
const validator=require("validator")
const bcrypt=require("bcrypt");
const jwt=require("jsonwebtoken")

const userSchema= mongoose.Schema({
    firstName:{
        type:String,
        required:true
    },
    lastName:{
        type:String
    },
    emailId:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        validate: {
            validator: validator.isEmail, // Use validator.isEmail directly here
            message: "Invalid email address"
          }
        },
    password:{
        type:String,
        required:true,
        minLength:4,
        
    },
    age:{
        type:Number
    },
    gender:{
        type:String,
        enum:{
            values:["male","female","other"],
            message:`{VALUE} is not a valid gender type`
        },
    },
    photoUrl:{
        type:String,
        default:"https://pixabay.com/images/search/user/",
    },
    about:{
        type:String
    },
    skills:{
        type:[String],
      
    },
},{
    timestamps:true
})

userSchema.index({firstName:1});
userSchema.index({gender:1});

userSchema.methods.getJWT=async function(){
    const user=this 
    const token=await jwt.sign({_id:user._id},"amala1234",{
        expiresIn:"7d"
    });
    return token
}

userSchema.methods.validatePassword=async function(passwordInputByUser){
    const user=this
    const passwordHash=user.password
    const isPasswordvalid=await bcrypt.compare(passwordInputByUser,passwordHash);
    return isPasswordvalid;
}

module.exports=mongoose.model("User",userSchema)