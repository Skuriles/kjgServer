var mongoose = require('mongoose');
var DailyPlanEle = require('./dailyPlanEle');
var Day = require('./day');
var Schema = mongoose.Schema;

var dailyplan = Schema({
    day: { type: Schema.ObjectId, ref: "Day" },
    morning: { type: Schema.ObjectId, ref: "DailyPlanEle" },
    afternoon: { type: Schema.ObjectId, ref: "DailyPlanEle" },
    evening: { type: Schema.ObjectId, ref: "DailyPlanEle" }
})

var DailyPlan = mongoose.model('DailyPlan', dailyplan)
module.exports = DailyPlan;
