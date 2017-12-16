var mongoose = require('mongoose');
var UserDrink = require('./drinkPerUser');
var Schema = mongoose.Schema;

var drinkSchema = Schema({
    name: String
})

drinkSchema.pre('remove', function(next) {
    UserDrink.find({ drink: this._id }).remove((err) => {
        if (err) {
            console.log(err);
        } else {
            next();
        }
    })
})
var Drink = mongoose.model('Drink', drinkSchema)
module.exports = Drink;