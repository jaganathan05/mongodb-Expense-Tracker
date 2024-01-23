const path = require('path');
const User = require('../models/user');
const Expenses = require('../models/expense');
const bcrypt = require('bcrypt');

const S3service = require('../services/S3service');
require('dotenv').config();
const AWS = require('aws-sdk');


exports.GetCreatePage = (req,res)=>{
    res.sendFile(path.join(__dirname,'..','views','create-expense.html'))
}

exports.CreateExpense = async (req, res) => {
  const { amount, description, catagory } = req.body;
  try {
      const newExpense = new Expenses( {
          amount: amount,
          description: description,
          catagory: catagory,
          createdAt: new Date(),
          userId: req.user._id
      });
      console.log(newExpense)
      req.user.Total_Amount = Number(req.user.Total_Amount) + Number(amount);
      await newExpense.save();
      await req.user.save();
      return res.status(200).json({ success: true, message: 'Expense created successfully.' });
  } catch (err) {
      return res.status(500).json({ success: false, error: err.message });
  }
};


  exports.GetExpenses = async (req, res) => {
    try {
      const page = req.query.page || 1; // Get the page number from the query parameters
      let itemsPerPage = 10; // Number of expenses per page
      const Rows_per_page = req.query.Rows;
      console.log('rows',Number(Rows_per_page))
      if(Rows_per_page){
        itemsPerPage=Number(Rows_per_page);
      }
      const start= (page - 1) * itemsPerPage;

      const expenses = await Expenses.find({'userId': req.user._id}).sort({ createdAt: 'desc' }).skip(start).limit(itemsPerPage)
      const Total_count = await Expenses.countDocuments({'userId': req.user._id})
      
      let order = false
      
       if(req.user.order.status==='SUCCESSFULL'){
        order= true
   
      }
  
      if (order===false) {
        return res.json({
          result: expenses,
          totalCount: Total_count,
          message: 'No Premium',
          pagination_data :{
            currentPage: Number(page),
            hasNextPage: itemsPerPage*Number(page)< Total_count,
            nextPage: Number(page)+1,
            hasPreviousPage:Number( page) > 1,
            PreviousPage: Number(page)-1,
            lastPage: Math.ceil(Total_count/itemsPerPage)}
        });
      } else {
        return res.json({
          result: expenses,
          pagination_data :{
            currentPage: Number(page),
            hasNextPage: itemsPerPage*Number(page)< Total_count,
            nextPage: Number(page)+1,
            hasPreviousPage:Number( page) > 1,
            PreviousPage: Number(page)-1,
            lastPage: Math.ceil(Total_count/itemsPerPage)}
          ,
          message: 'SUCCESSFULL'
        });
      }
      
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  };
    
      

exports.DeleteExpense = async (req, res) => {
    try {
        const Id = req.params.id;
        const expense = await Expenses.findOne({'_id':Id});


        const UpdatedAmount = Number(req.user.Total_Amount) - Number(expense.amount);
        req.user.Total_Amount = UpdatedAmount;
        await Expenses.deleteOne({'_id':Id});
        await req.user.save()
        return res.status(200).json({ success: true, message: 'Expense successfully Deleted' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

exports.DownloadExpenses= async (req,res)=>{
  
    try{
      const UserId = req.user._id  
      const Expense = await Expenses.find({'userId': UserId});
      const filename = `Expense${UserId}${new Date()}.txt`;
      const fileurl = await S3service.uploadToS3(JSON.stringify(Expense),filename);
      return res.status(200).json({fileurl,success:true})
    }
    catch(err){
      console.log(err)
      return res.status(500).json({ fileurl, success:false, err: err})
    }
    
    
}

  
  