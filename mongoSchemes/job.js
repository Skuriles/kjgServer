var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var job = Schema({
    name: String,
    description: String,
    persons: [String]
})

var Job = mongoose.model('Job', job)
module.exports = Job;
