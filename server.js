const express = require('express');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.json())

// Configuring the database

const dbConfig = require('./app/config/mongodb.config.js');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

// Connecting to the database

mongoose.connect(dbConfig.url,{ useNewUrlParser: true ,useUnifiedTopology: true})
.then(() => {
    console.log("Successfully connected to MongoDB.");    

}).catch(err => {
    console.log('Could not connect to MongoDB.');
    process.exit();
});
const cors = require('cors')
const corsOptions = {
  origin: 'http://localhost:4200',
  optionsSuccessStatus: 200
}
app.use(cors(corsOptions))
 
//api routes

let router = require('./app/routers/s3.router.js');
app.use('/', router);
require('./app/routers/user.router.js')(app);
 
// Create a Server

const server = app.listen(8080, function () {
 
  let host = server.address().address
  let port = server.address().port
 
  console.log("App listening at http://%s:%s", host, port); 
})