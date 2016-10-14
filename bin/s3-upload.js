// bin/s3-upload.js
'use strict';

const fs = require('fs');

const upload = require('../lib/s3-upload').upload;

const mongoose = require('../app/middleware/mongoose');
const Upload = require('../app/models/upload');

const filename = process.argv[2] || '';
const comment = process.argv[3] || 'No comment';

const readFile = (filename) => {
  return new Promise((resolve, reject) => {
    fs.readFile(filename, (error, data) => {
      if (error) {
        reject(error);
      }

      resolve(data);
    });
  });
};

const createUpload = (response) => {
  let upload = {
    location: response.Location,
    comment: comment,
  };
  return Upload.create(upload);
};

const logMessage = (response) => {
  console.log(`${JSON.stringify(response)}`);
};

readFile(filename)
.then(upload)
.then(createUpload)
.then(logMessage)
.catch(console.error)
.then(() => mongoose.connection.close())
;
