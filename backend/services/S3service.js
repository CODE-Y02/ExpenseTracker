//aws
const AWS = require("aws-sdk");

// upload file to s3
const uploadToS3 = (data, fileName) => {
  const BUCKET_NAME = process.env.S3_BUCKET_NAME;
  const IAM_USER_ACCESS_KEY = process.env.IAM_USER_ACCESS_KEY;
  const IAM_USER_SECRET_KEY = process.env.IAM_USER_SECRET_KEY;

  let s3bucket = new AWS.S3({
    accessKeyId: IAM_USER_ACCESS_KEY,
    secretAccessKey: IAM_USER_SECRET_KEY,
  });

  var params = {
    Bucket: BUCKET_NAME,
    Key: fileName,
    Body: data,
    ACL: "public-read",
  };

  return new Promise((resolve, reject) => {
    s3bucket.upload(params, (err, s3successResponse) => {
      if (err) {
        // console.log("\n \n something Went wrong ", err);
        reject(err);
      } else {
        // console.log("\n \n Success ", s3successResponse);
        resolve(s3successResponse.Location);
        // return s3successResponse.Location;
      }
    });
  });
};

module.exports = {
  uploadToS3,
};
