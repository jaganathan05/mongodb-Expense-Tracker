const path = require('path');
const User = require('../models/user');
const FPR = require('../models/Forget_Psw_Req');
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
require('dotenv').config();
const Sib = require('sib-api-v3-sdk');
const{v4: UUID} = require('uuid');

const client = Sib.ApiClient.instance
const apiKey = client.authentications['api-key']
apiKey.apiKey = process.env.Email_API_KEY 

exports.getSignup=(req,res,next)=>{
    res.sendFile(path.join(__dirname,'..','views','signup.html'))
}

exports.PostSignup = (req, res, next) => {
    const { name, email, password } = req.body;

    User.findOne({ 'email': email })
        .then(existingUser => {
            if (existingUser) {
                return res.status(200).json({ success: false, message: 'This email already has an account' });
            }

            
            bcrypt.hash(password, 10, async (err, result) => {
                if (err) {
                    console.log(err);
                    return res.status(500).json({ success: false, message: 'Signup failed err',err  });
                }

                const user = new User({
                    name: name,
                    email: email,
                    password: result,
                    Total_Amount: 0

                });

                user.save()
                    .then(response => {
                        return res.status(200).json({ success: true, message: 'Signup successful' });
                    })
                    .catch(saveErr => {
                        console.log(saveErr);
                        return res.status(500).json({ success: false, message: 'Signup failed save', saveErr});
                    });
            });
        })
        .catch(err => {
            console.log(err);
            return res.status(500).json({ success: false, message: 'Signup failed' ,err});
        });
};


exports.getLogin=(req,res)=>{
    res.sendFile(path.join(__dirname,'..','views','login.html'))
}

exports.PostLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log('Email is', email,password);

        const user = await User.findOne( { 'email': email } );

        if (user) {
            const result = await bcrypt.compare(password, user.password);
            if (result === true) {
                return res.status(200).json({
                    success: true,
                    message: "Logged In Successfully",
                    token: generateAccesstoken(user._id, user.email)
                });
            } else {
                return res.status(401).json({success:false,message: 'User not authorized'});
            }
        } else {
            return res.status(404).send({success:false,message:'User not Found'});
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
};

    

    
        
function generateAccesstoken(id,email){
    const secretKey = process.env.Token_SecretKey;
    console.log(secretKey);

    return jwt.sign({userId : id , Email:email},secretKey)
}


exports.Forgetpassword = async (req,res,next)=>{
    const Id = UUID();
    console.log('this is uuid',Id)
    const forgetpswemail = req.body.email;
    const user = await User.findOne({
        'email':forgetpswemail
    });
    
    const tranEmailApi = new Sib.TransactionalEmailsApi();
    const sender = {
    email: 'jaganathanv888@gmail.com',
    name: 'Jaganathan',
}
    const receivers = [
    {
        email: forgetpswemail,
    },
]
try{
    
    const createFPL =  new FPR({
        uniqueid:Id,
        isActive: true,
        userId: user._id
    }) 
    await createFPL.save()
    console.log(forgetpswemail);
    console.log(receivers);
    const sendmail = await tranEmailApi.sendTransacEmail({
        sender,
        to: receivers,
        subject: 'Forget Password Using Email Verification',
        htmlContent:`
        <h1>verification link</h1>
        <a href='http://localhost:3000/password/resetpassword/${Id}'>Visit</a>`
    })
    console.log('email sended')
    return res.json(sendmail)
    
}catch(err){
    console.log(err)
}


}

exports.GetForgetpasswordLink =async (req,res,next)=>{ 
    try{
        const Id = req.params.id;
        console.log(Id)
        const forgetpasswordrequest = await FPR.findOne({
            'uniqueid': Id
        })
        console.log(forgetpasswordrequest.isActive);
        if (forgetpasswordrequest.isActive=== true ){
            return res.sendFile(path.join(__dirname,'..','views','forgetpassword.html'));
        }
        else{
            return res.redirect('/login');
        }
    }
    catch(err){
        console.log(err)
    }
    

}
exports.PostResetPassword=async(req,res,next)=>{
    const { password, id }= req.body;
    const FP = await FPR.findOne({
        'uniqueid': id 
    });
    const userId = FP.userId;
    try{
        const setnewpassword = await bcrypt.hash(password,10);
        const user= await User.findOne({

                '_id': userId
   })
   user.password = setnewpassword;
   FP.isActive= false
   await user.save()
   await FP.save()
        return res.status(200).json({message: 'Password Changed successfully'})
    }
    catch(err){
        console.log(err);
        return res.status(200).json({message: 'something wrong'})
    }
}