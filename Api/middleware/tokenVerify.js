require('dotenv').config()
const jwt=require("jsonwebtoken");
// const config = process.env;


console.log("dnkjhkjdh", process.env.TOKEN_KEY)
// const config=process.env;

const verifyToken=(req,res,next)=>{
    const token=req.body.token || req.query.token || req.headers.authorization;
    if(!token){
        return res.status(403).send({msg:"Token required for auth"});
    }
    try{
        console.log(process.env.TOKEN_KEY)
        console.log(token)
        const decoded=jwt.verify(token,process.env.TOKEN_KEY);
        console.log(decoded)
        console.log(decoded.user_id)
        console.log(decoded.user_role)
        req.user=decoded.user_id;
        req.role=decoded.user_role;
    }
    catch(err){
        console.log(err);
        return res.status(401).send({msg:"Token is expired plz login user"});
    }
    return next();
}
module.exports=verifyToken;