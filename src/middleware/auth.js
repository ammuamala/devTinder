const adminAuth=(req,res,next)=>{
    console.log("admin auth is getting checked");
    const token='xyz';
    const isAdminAuthrized=token==='xyz';
    if(!isAdminAuthrized){
        res.status(401).send("admin is unauthrized")
    }else{
        next()
    }
}

const userAuth=(req,res,next)=>{
    console.log("user auth is getting checked");
    const token='xyz';
    const isAdminAuthrized=token==='abcdjfhai';
    if(!isAdminAuthrized){
        res.status(401).send("user is unauthrized");
    }else{
        next()
    }
}

module.exports={adminAuth,userAuth}

