const express = require('express');
const router = express.Router();
const auth_middleware = require('../Middleware/auth');
const purchase_controller = require('../controller/purchase_controller');

 router.get('/premium_membership',auth_middleware.authentication,purchase_controller.Premium_membership);

 router.post('/updatetransactionstatus',auth_middleware.authentication,purchase_controller.updateTransactionStatus)

module.exports=router;