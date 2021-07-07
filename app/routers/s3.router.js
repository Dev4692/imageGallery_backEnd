let express = require('express');
let router = express.Router();
 
let upload = require('../config/multer.config.js');

const awsWorker = require('../controllers/s3.controller.js');
 
router.post('/api/files/upload', upload.single("file"), awsWorker.doUpload);


 
module.exports = router;