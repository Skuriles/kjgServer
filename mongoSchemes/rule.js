var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var RuleSchema = Schema({
    name: String
});

var Rule = mongoose.model('Rule', RuleSchema);
module.exports = Rule;