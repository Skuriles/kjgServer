var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Day = require('./day');
var fs = require("fs");

var programPoint = Schema({
    shortName: String,
    description: String,
    material: [String],
    attachments: [String],
    links: [String],
    people: [String]
})

programPoint.pre('remove', function(next) {
    var attPath = "./attachments/" + this._id;
    fs.readdir(attPath, (err, files) => {        
        files.forEach(file => {          
              fs.unlink(file);
          });
          fs.rmdir(attPath, (err)=> {
              if(err){
                  console.log(err);
              }
          });
      })
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

programPoint.post('findOneAndUpdate', function(point) { 
    var attPath = "./attachments/" + point._id;
    if (fs.existsSync(attPath)) {
    fs.readdir(attPath, (err, files) => {        
        if(err){
            console.log(err);
        }
        files.forEach(file => {
          if(point.attachments.indexOf(file) === -1) {
              fs.unlink(attPath + "\\" + file, (err)=> {
                  if(err){
                      console.log(err);
                  }
              });
          }
        });       
      })
    } 
})

var ProgramPoint = mongoose.model('ProgramPoint', programPoint)
module.exports = ProgramPoint;
