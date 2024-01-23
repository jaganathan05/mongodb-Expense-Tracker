const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ForgetpasswordSchema = new Schema({
    uniqueid:{
        type: String,
        required: true
    },
    isActive:{
        type: Boolean,
        required: true
    },
    userId:{
        type: mongoose.Types.ObjectId,
        ref:'User',
        required: true
    }  
})


module.exports= mongoose.model('ForgetPassword',ForgetpasswordSchema)
