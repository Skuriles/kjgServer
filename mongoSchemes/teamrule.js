var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TeamRuleSchema = Schema({
    name: String
});

var TeamRule = mongoose.model('TeamRule', TeamRuleSchema);
module.exports = TeamRule;