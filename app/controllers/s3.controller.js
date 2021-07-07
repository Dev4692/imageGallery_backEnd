const s3 = require('../config/s3.config.js');
const env = require('../config/s3.env.js');
 

//upload image to s3 bucket using following method

exports.doUpload = (req, res) => {
	const params = {
		Bucket: env.Bucket,
		Key: req.file.originalname,
		Body: req.file.buffer
	}
	
	s3.upload(params, (err, data) => {
		if (err) {
			res.status(500).send("Error -> " + err);
		}
		res.send("File uploaded successfully!= " + req.file.originalname);
	});
}

// exports.listKeyNames = (req, res) => {
// 	const params = {
// 		Bucket: env.Bucket
// 	}

// 	var keys = [];
// 	s3.listObjectsV2(params, (err, data) => {
//         if (err) {
// 			console.log(err, err.stack); // an error occurred
// 			res.send("error -> "+ err);
//         } else {
//             var contents = data.Contents;
//             contents.forEach(function (content) {
//                 keys.push(content.Key);
// 			});
// 			res.send(keys);
// 		}
// 	});
// }

