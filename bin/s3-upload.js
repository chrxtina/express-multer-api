'use strict';

const fs = require('fs');
const fileType = require('file-type');

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
  return Promise.resolve(options);

};

const logMessage = (upload) => {
  // Get rid of stream for now, to log rest of options in terminal
  // without seeing the stream
  delete upload.Body;
  // Turn pojo into a string
  console.log(`the upload options are ${JSON.stringify(upload)}`);
};

readFile(filename)
.then(parseFile)
.then(upload)
.then(logMessage)
.catch(console.error)
;
