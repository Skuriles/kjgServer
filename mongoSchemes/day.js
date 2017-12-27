var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var day = Schema({
    name: String,
    date: Date
})

day.pre('remove', function(next) {
    DailyPlan.find({ day: this._id }, (err, days) => {
        const errors = [];
        for (let i = 0; i < days.length; i++) {
            const day = days[i];
            day.set({ day: null })
            day.save((err) => {
                if (err) {
                    next(err);
                    return;
                }
                next()
            })
        };
    })
})

var Day = mongoose.model('Day', day)
module.exports = Day;
