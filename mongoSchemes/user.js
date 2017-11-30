var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = Schema({
    name: String,
    password: String,
    email: String,
    checked: Boolean,
    role: { type: Schema.Types.ObjectId, ref: "Role" },
    drinks: [{ type: Schema.Types.ObjectId, ref: "drinkPerUserSchema" }]
})

var User = mongoose.model('User', userSchema);
module.exports = User;