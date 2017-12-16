var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var drinkPerUserSchema = Schema({
    user: { type: Schema.ObjectId, ref: "User" },
    drink: { type: Schema.ObjectId, ref: "Drink" }
}, {
    timestamps: true
})

var UserDrink = mongoose.model('UserDrink', drinkPerUserSchema);
module.exports = UserDrink;