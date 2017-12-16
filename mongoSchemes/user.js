var mongoose = require('mongoose');
var UserDrink = require('./drinkPerUser');
var Schema = mongoose.Schema;

var userSchema = Schema({
    name: String,
    password: { type: String, select: false },
    email: String,
    checked: Boolean,
    role: { type: Schema.Types.ObjectId, ref: "Role" }
})

userSchema.pre('remove', function(next) {
    UserDrink.find({ user: this._id }).remove((err) => {
        if (err) {
            console.log(err);
        } else {
            next();
        }
    })
})

var User = mongoose.model('User', userSchema);
module.exports = User;