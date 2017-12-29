var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var day = Schema({
    name: String,
    date: Date,
    morning: { type: Schema.ObjectId, ref: "ProgramPoint" },
    afternoon: { type: Schema.ObjectId, ref: "ProgramPoint" },
    evening: { type: Schema.ObjectId, ref: "ProgramPoint" }
})

var Day = mongoose.model('Day', day)
module.exports = Day;
