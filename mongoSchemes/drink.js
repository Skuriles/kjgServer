var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var drinkSchema = Schema({
    name: String
})

var Drink = mongoose.model('Drink', drinkSchema)
module.exports = Drink;