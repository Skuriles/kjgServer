var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var drinkPerUserSchema = Schema({
    drink: [{ type: Schema.ObjectId, ref: "Drink" }],
    count: Number
})

var DrinkUser = mongoose.model('DrinkUser', drinkPerUserSchema);
module.exports = DrinkUser;