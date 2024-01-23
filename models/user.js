const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name:{
        type:String,
        required: true
    },
    email:{
        type:String,
        required: true
    },
    password:{
        type:String,
        required: true
    },
    Total_Amount:{
        type: Number,
        required: true
    },
    order:{
        type: Object
    },
    ispremiumuser:{
        type: Boolean
    }
})


module.exports= mongoose.model('User',userSchema)