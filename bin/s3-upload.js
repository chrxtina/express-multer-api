'use strict';

// this has to come  before anything else
require('dotenv').config();

const fs = require('fs');
const fileType = require('file-type');
const AWS = require('aws-sdk');

const filename = process.argv[2] || '';

const readFile = (filename) => {
  return new Promise ((resolve, reject) => {
    fs.readFile(filename, (error, data) => {
      if (error) {
        reject(error);
      }

    resolve(data);
    });
  });
};

// return a default object in case that fileType is given an unsupported
// filetype to read
const mimeType = (data) => {
  return Object.assign({
    ext: 'bin',
    mime: 'application/octet-stream',
  },fileType(data));
};

const parseFile = (fileBuffer) => {
  let file = mimeType(fileBuffer);
  file.data = fileBuffer;
  return file;
};

const s3 = new AWS.S3({
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  }
});

const upload = (file) => {
  const options = {
    // Get bucket name from AWS console
    Bucket: 'silentbucket',
    // Attach fileBuffer as a stream to send to S3
    Body: file.data,
    // Allow anyone to access the URL of the uploaded file
    ACL: 'public-read',
    // Tell S3 what the mime-type is
    ContentType: file.mime,
    // Pick a filename for S3 to use for the upload
    Key: `test/test.${file.ext}`
  };
  // Don't upload yet, just pass data down Promise chain
  // return Promise.resolve(options);
  return new Promise ((resolve, reject)=>{
    s3.upload(options, (error, data)=>{
      if (error){
        reject(error);
      }
      resolve (data);
    });
  });
};

const logMessage = (response) => {
  // Turn pojo into a string to see in console
  console.log(`the response from AWS was options ${JSON.stringify(response)}`);
};

readFile(filename)
.then(parseFile)
.then(upload)
.then(logMessage)
.catch(console.error)
;
