var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Day = require('./day')

var programPoint = Schema({
    shortName: String,
    description: String,
    material: [String],
    attachments: [String],
    people: [String]
})

programPoint.pre('remove', function(next) {
    Day.find({ $or: [{ 'morning': this._id }, { 'afternoon': this._id }, { 'evening': this._id }] }, (err, days) => {
        const errors = [];
        for (let i = 0; i < days.length; i++) {
            const day = days[i];
            if (day.morning && day.morning.equals(this._id)) {
                day.set({ morning: null })
                day.save((err) => {
                    if (err) {
                        next(err);
                    }
                })
            }
            if (day.afternoon && day.afternoon.equals(this._id)) {
                day.set({ afternoon: null })
                day.save((err) => {
                    if (err) {
                        next(err);
                    }
                })
            }
            if (day.evening && day.evening.equals(this._id)) {
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

var ProgramPoint = mongoose.model('ProgramPoint', programPoint)
module.exports = ProgramPoint;
