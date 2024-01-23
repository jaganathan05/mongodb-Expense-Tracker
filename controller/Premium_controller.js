const path = require('path');
const User = require('../models/user');
const Expenses = require('../models/expense');

exports.ShowLeaderBoard=async(req,res,next)=>{
    try{
        const UserLeaderBoardDetails = await User.find({
                }).sort({Total_Amount: 'desc'})
        return res.status(200).json(UserLeaderBoardDetails);
    }
    catch(err){
        console.log(err);
    }

}