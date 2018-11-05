const AWS = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');
const Jimp = require('jimp');
const fileType = require('file-type');
const guid = require('../helpers/uuid');

const config = new AWS.Config({
  accessKeyId: '',
  secretAccessKey: '',
  region: 'us-west-1',
  params: {
    Bucket: 'sdbeer2',
  },
});
const s3 = new AWS.S3(config);


const uploadToS3 = (req, res) => {
  // console.log('uploadtos3 entry');
  const upload = multer({
    storage: multerS3({
      s3,
      bucket: 'sfbeer',
      metadata(req, file, cb) {
        // console.log(file);
        cb(null, { fieldname: file.fieldname });
      },
    }),
  });
  upload.any()(req, res, (err) => {
    if (err) {
      // console.log(err);
    }
    res.json(req.files[0].location);
  });
};

const uploadEventImage = (req, res) => {
  multer().any()(req, res, () => {
    // if (err) {
    // console.log(err);
    // }
    const firstFile = req.files[0];
    if (!firstFile) {
      return res.json({ err: 'missing file' });
    }
    const type = fileType(firstFile.buffer);
    const uuid = guid().slice(0, 15);
    new Jimp(firstFile.buffer, (err, image) => { // eslint-disable-line
      image.cover(1200, 600)
        // .quality(10)
        .getBuffer(type.mime, (err, buffer) => { // eslint-disable-line
          s3.putObject({
            Body: buffer,
            Key: uuid,
            Bucket: 'sdbeer2',
          }, (err, data) => { // eslint-disable-line
            if (data && !err) {
              // console.log(data);
              const newUrl = `https://s3-us-west-1.amazonaws.com/sfbeer/${uuid}`;
              return res.json(newUrl);
            }
            return res.json(err || { err: 'unknown error' });
          });
        });
    });
  });
};


module.exports = { uploadToS3, uploadEventImage };
