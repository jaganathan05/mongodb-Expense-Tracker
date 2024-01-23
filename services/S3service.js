const AWS = require('aws-sdk');
const uploadToS3=(data, filename)=>{
    const BUKETNAME = 'expensetracker012';
    const IAM_USER_KEY = process.env.iamuserkey;
    const IAM_USER_SECRET =process.env.iamusersecret;
   
    let s3bucket = new AWS.S3({
      accessKeyId: IAM_USER_KEY,
      secretAccessKey: IAM_USER_SECRET,
      Bucket: BUKETNAME,
      
    })
    var params= {
      Bucket : BUKETNAME,
      Key : filename,
      Body : data,
      ACL : 'public-read'
    }
    return new Promise((resolve,reject)=>{
      s3bucket.upload(params,(err,s3response)=>{
        if(err){
          console.log('somthing wrong ', err);
          reject(err);
        }
        else{
          resolve(s3response.Location)
        }
      })
    })
}

module.exports= {uploadToS3} ;