var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = Schema({
    name: String,
    password: String,
    email: String,
    drinks: [{ id: Schema.ObjectId, count: Number }]
})

var User = mongoose.model('User', userSchema);
module.exports = User;