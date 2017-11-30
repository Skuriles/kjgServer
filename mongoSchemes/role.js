var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var roleSchema = Schema({
    name: String
})

var Role = mongoose.model('Role', roleSchema)
module.exports = Role;