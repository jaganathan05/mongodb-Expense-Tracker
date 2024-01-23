const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ExpenseSchema = new Schema({
    amount:{
        type:Number,
        required: true
    },
    description:{
        type:String,
        required: true
    },
    catagory:{
        type:String,
        required: true
    },
    userId:{
        type: mongoose.Types.ObjectId,
        ref:'User',
        required: true
    }  
},
{
    timestamps: true 
})


module.exports= mongoose.model('Expense',ExpenseSchema)