const mongoose = require('mongoose');
const Promise = require('bluebird');
const bcrypt =  require('bcryptjs');

const UserSchema = mongoose.Schema({
    created_at:Date,
    updated_at:Date,
    firstName: String,
    lastName: String,
    email:  String,
    middleName:String,
    hashedpassword:String,
    status: {
        type: String,
        enum: ['active', 'inActive'],
        default: 'active',
        trim: true
    },
});

UserSchema.index({email:1},{unique:true})
UserSchema.pre('save',function(next){
    var that = this
    var now = new Date().getTime()
    this.updated_at = now
    if(!this.created_at){
        this.created_at =  now
    }
    if(!that.isNew) return next();
    next()
})


/**
 * Statics Methods
**/
UserSchema.statics.ImportSingleUser = Promise.promisify(function (userLine, callback) {
    UserSchema.statics.getByCombinedKey(userLine).then(async function (existingUser) {
console.log(existingUser,'existingUser')

        var eventObj = await UserSchema.statics.HandleUser(existingUser, userLine);
        return callback(null, eventObj);

    }).catch(function (err) {
        console.log('Some errors in get By CombinedKey');
        // For now just hard code response
        return callback(err, null);
    });
});


UserSchema.statics.getByCombinedKey = function (userLine) {
    console.log(userLine,'userLine')
    return new Promise(function (resolve, reject) {
        try {
            //here check exits or not
            var searchObj = {};
            if (!(typeof userLine._id === 'undefined') && userLine._id != null && userLine._id != '') {
                searchObj._id = userLine._id;
            } else {
                searchObj = {
                    email: userLine.email,
                };
            }
            User.findOne(searchObj)
                .exec().then(function (eventObj) {
                    return resolve(eventObj);
                }).catch(function (err) {
                    console.log('Some errors in User query');
                    // For now just hard code response
                    return reject(err);
                });
        } catch (err) {
            return reject(err);
        }
    }); //Promise
};

UserSchema.statics.HandleUser = Promise.promisify(async function (existingUser, userLine, cb) {
    if (existingUser == null) {
        // event doesn't exist, create one
        var newUser = new User();
        newUser.status = 'active';

        newUser.firstName = userLine.firstName;
        newUser.lastName = userLine.lastName;
        newUser.email = userLine.email;
        newUser.middleName = userLine.middleName;
       
        let salt = await bcrypt.genSalt(10)
        newUser.hashedpassword = await bcrypt.hash(userLine.password, salt)
        User.create(newUser, function (err, eventObj) {
            if (err) {
                return cb(err, eventObj);
            } else {
                return cb(null, eventObj);
            }
        });

    } else {

        existingUser.firstName = userLine.firstName;
        existingUser.lastName = userLine.lastName;
        existingUser.middleName = userLine.middleName;
        
        let salt = await bcrypt.genSalt(10)
        existingUser.hashedpassword = await bcrypt.hash(userLine.password, salt)
        existingUser.save(function (err) {
            if (err) {
                return cb(err, existingUser);
            } else {
                return cb(null, existingUser);
            }
        });

    }

});

// module.exports = mongoose.model('User',UserSchema)

const User = mongoose.model('User', UserSchema);
module.exports = User;