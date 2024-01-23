const express = require('express');
const path = require('path');
const cors = require('cors');
const body_parser= require('body-parser'); 
const app = express() ;
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const fs = require('fs');
const mongoose = require('mongoose');
app.use(express.json());

const router = require('./routes/route');
const purchase_router = require('./routes/purchase');
app.use(express.static(path.join(__dirname,'public')))
app.use(body_parser.urlencoded({ extended: false }));
app.use(router);
app.use('/purchase',purchase_router);
app.use(cors());
app.use(helmet());

const accessLogStream = fs.createWriteStream(
    path.join(__dirname,'access.log'),
    {flags: 'a'}
)

app.use(compression());
app.use(morgan('combined',{stream:accessLogStream }));

require('dotenv').config();

mongoose.connect(process.env.mongo_db_connection).then(res=>{
    app.listen(3000)
    console.log('connected')
})