const mongoose = require("mongoose")
const validator=require("validator")

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
        validate(value){
            if(!["male","female","others"].includes(value)){
                throw new error("gender data is not valid")
                
            }
        }
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

module.exports=mongoose.model("User",userSchema)