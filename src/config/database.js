const mongoose= require('mongoose');


const connectDB=async() => {
    await mongoose.connect(
        "mongodb+srv://polisettyamala:Ammuamala@namastenode.ibj8g.mongodb.net/devTinder"
    );
};


module.exports=connectDB