const Razorpay = require('razorpay');
require('dotenv').config();


exports.Premium_membership = async (req,res,next)=>{
    try{
        var rzp = new Razorpay({
            key_id: process.env.Razorpay_Key_Id,
            key_secret: process.env.Razorpay_Key_Secret
            
        })
        const amount= 2500;

        rzp.orders.create({
            amount, currency: 'INR'
        }, (err, order) => {
            if (err) {
                // Handle the error, log it, and respond with an error message
                console.error('Razorpay error:', err, err.description, err.code);
                return res.status(500).json({ error: 'Razorpay error' });
            }
            // Process the order when there are no errors
            req.user.order={ orderid: order.id, status: 'PENDING' }
               req.user.save().then(() => {
                    return res.status(201).json({ order_id:order.id, key_id: rzp.key_id });
                })
                .catch((err) => {
                    console.error('Order creation error:', err);
                    return res.status(500).json({ error: 'Order creation error' });
                });
        });
        
    }
    catch(err){
        console.log(err);
        console.log('21')
        res.status(403).json({ message: ' something Went Wrong', error : err})

    }

}
exports.updateTransactionStatus = async (req, res) => {
    try {
      const { payment_id, order_id } = req.body;
      console.log(payment_id,order_id);
      req.user.order=({
        order_id: order_id,
        paymentid: payment_id,
        status: "SUCCESSFULL",
      });
      
      req.user.ispremiumuser = true
  
      req.user.save()
        .then(() => {
          return res
            .status(202)
            .json({ success: true, message: "Transaction Successfull" });
        })
        .catch((error) => {
          throw new Error(error);
        });
    } catch (err) {
      console.log(err);
      res.status(403).josn({ error: err, message: "Something went Wrong" });
    }
  };