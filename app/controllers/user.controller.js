const User = require('../models/user.model.js');
const UserSchema = require('../models/user.model').schema;
const db = require('../config/mongodb.config.js');
const bcrypt =  require('bcryptjs');
const jwt = require('jsonwebtoken');

//Create or update User
exports.manageUser = async function (req, res) {
  console.log( req.body,'userDetails')
  let userDetails = req.body;
  try {
      let retUser = await UserSchema.statics.ImportSingleUser(userDetails);
      return res.json(retUser);

  } catch (ex) {
      let e = ex;
      console.log(ex)
  }
};

exports.getAllUser = function (req, res) {
    try {
      User.find({status:'active'}, function (err, users) {
        if (err) {
          console.log(
            'Some error' + err
          );
  
          return res.status(404).json({
            msg: "Users not found" 
        });            
        }
  
        if (!users) {
            return res.status(404).json({
                msg: "users not found" 
            });            
        }
  
        return res.status(200).json(users);
      });
    } catch (e) {
      console.log(e);
    }
  }


exports.login = async function (req, res) {
  //check userId
  console.log('req.body1', req.body)
  const validUser = await User.findOne({ email: req.body.emailId })
  console.log('req.body125', validUser)
  if (!validUser) return res.status(400).send('Invalid Email Id')
  console.log('req.body12', validUser)
  //check password

  const validPass = await bcrypt.compare(req.body.password, validUser.hashedpassword)
  if (!validPass) return res.status(400).send('Invalid Password')
  console.log('req.body13', validPass)
  // create token
  const token = await jwt.sign({ _id: validUser._id }, 'acvsucbubcuffhidhu')
  console.log('req.body14', token)
  res.header("auth-token", token).send({ token: token ,user: validUser })
}