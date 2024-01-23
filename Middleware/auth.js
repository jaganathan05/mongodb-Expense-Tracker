const jwt = require('jsonwebtoken');
const User = require('../models/user');
require('dotenv').config();

const authentication = async (req,res,next)=>{
    try{
        const token = req.header("Authorization")
        //console.log(token);
        const SecretKey = process.env.Token_SecretKey;
        const user = jwt.verify(token,SecretKey);
        const userId = user.userId
        User.findOne({'_id': userId}).then(user=>{
            //console.log(JSON.stringify(user));
            req.user=user;
            next()
        }).catch(err=>{throw new Error(err)})
    }catch(err){
        console.log(err);
        return res.status(401).json({success:false})
    }

}
module.exports={
    authentication
}