var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var DailyPlan = require('./dailyPlan');

var dailyPlanEle = Schema({
    shortName: String,
    description: String,
    material: [String],
    attachments: [String],
    people: [String]
})

dailyPlanEle.pre('remove', function(next) {
    DailyPlan.find({ $or: [{ 'morning': this._id }, { 'afternoon': this._id }, { 'evening': this._id }] }, (err, days) => {
        const errors = [];
        for (let i = 0; i < days.length; i++) {
            const day = days[i];
            if (day.morning === this._id) {
                day.set({ morning: null })
                day.save((err) => {
                    if (err) {
                        next(err);
                    }
                })
            }
            if (day.afternoon === this._id) {
                day.set({ afternoon: null })
                day.save((err) => {
                    if (err) {
                        next(err);
                    }
                })
            }
            if (day.evening === this._id) {
                day.set({ evening: null })
                day.save((err) => {
                    if (err) {
                        next(err);
                    }
                })
            }
        }
        next();
    })
})

var DailyPlanEle = mongoose.model('DailyPlanEle', dailyPlanEle)
module.exports = DailyPlanEle;
