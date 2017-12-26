var path = require("path");
var mongoose = require("mongoose");
var User = require("../mongoSchemes/user");
var Drink = require("../mongoSchemes/drink");
var UserDrink = require("../mongoSchemes/drinkPerUser");
var Role = require("../mongoSchemes/role");
var Tools = require("../tools/tools");
var tokenhandler = require("./tokenhandler");

mongoose.Promise = Promise;

module.exports = {
    getDrinks: (req, res) => {
        getDrinks(req, res);
    },
    getUserDrinks: (req, res) => {
        getUserDrinks(req, res);
    },
    getUserOverview: (req, res) => {
        getUserOverview(req, res);
    },
    addUserDrink: (req, res) => {
        addUserDrink(req, res);
    },
    saveDrink: (req, res) => {
        saveDrink(req, res);
    },
    deleteDrink: (req, res) => {
        deleteDrink(req, res);
    },
    getDailyLeaders: (req, res) => {
        getDailyLeaders(req, res);
    }
};

function getDailyLeaders(req, res) {
    tokenhandler.verifyPost(req, (err, decoded) => {
        if (decoded && decoded.name && decoded.name.length > 0) {
            var now = new Date().getTime();
            var oneDay = 86400000;
            var yesterday = now - oneDay;
            UserDrink.find({ createdAt: { $gte: new Date(yesterday) } })
                .populate({
                    path: "user",
                    select: "name"
                })
                .exec((err, dailyDrinks) => {
                    if (err) {
                        res.status(500);
                        res.end();
                        return;
                    }
                    var dailyWinner = getTotalWinner(dailyDrinks);
                    Drink.findOne({ name: "Blitzkolben" }, (err, drink) => {
                        UserDrink.find({ drink: drink.id })
                            .populate({
                                path: "user",
                                select: "name"
                            })
                            .exec((err, blitzis) => {
                                if (err) {
                                    res.status(500);
                                    res.end();
                                    return;
                                }
                                var dailyWinnersBlitz = getTotalWinner(blitzis);
                                UserDrink.find({})
                                    .populate({
                                        path: "user",
                                        select: "name"
                                    })
                                    .exec((err, users) => {
                                        if (err) {
                                            res.status(500);
                                            res.end();
                                            return;
                                        }
                                        var winnerTotal = getTotalWinner(users);
                                        var response = {
                                            dailyWinner: dailyWinner,
                                            dailyWinnersBlitz: dailyWinnersBlitz,
                                            winnerUserTotal: winnerTotal
                                        };
                                        res.send(response);
                                        return;
                                    });
                            });
                    });
                });
        }
    });
}

function getUserDrinks(req, res) {
    tokenhandler.verifyPost(req, (err, decoded) => {
        if (decoded && decoded.name && decoded.name.length > 0) {
            var userids = req.body;
            UserDrink.find({ user: { $in: userids } })
                .populate("user drink")
                .exec((err, userDrinks) => {
                    if (err) {
                        res.status(500);
                        res.end();
                        return;
                    }
                    var drinkList = [];
                    for (var i = 0; i < userDrinks.length; i++) {
                        var found = false;
                        for (var j = 0; j < drinkList.length; j++) {
                            if (drinkList[j].userid === userDrinks[i].user._id) {
                                var drinkFound = false;
                                for (let k = 0; k < drinkList[j].drinks.length; k++) {
                                    const drink = drinkList[j].drinks[k];
                                    if (drink.drinkId === userDrinks[i].drink._id) {
                                        drinkFound = true;
                                        drink.count++;
                                        break;
                                    }
                                }
                                if (!drinkFound) {
                                    drinkList[j].drinks.push({
                                        drinkId: userDrinks[i].drink._id,
                                        drinkName: userDrinks[i].drink.name,
                                        count: 1
                                    });
                                }
                                found = true;
                                break;
                            }
                        }
                        if (!found) {
                            var overviewItem = {
                                userName: userDrinks[i].user.name,
                                userid: userDrinks[i].user._id
                            };
                            overviewItem.drinks = [];
                            overviewItem.drinks.push({
                                drinkId: userDrinks[i].drink._id,
                                drinkName: userDrinks[i].drink.name,
                                count: 1
                            });
                            drinkList.push(overviewItem);
                        }
                    }
                    for (let i = 0; i < drinkList.length; i++) {
                        const drinks = drinkList[i].drinks;
                        drinks.sort(Tools.sortByDrinkName);
                    }
                    res.send(drinkList);
                    return;
                });
        } else {
            res.status(404);
            return;
        }
    });
}

function getDrinks(req, res) {
    tokenhandler.verifyPost(req, (err, decoded) => {
        if (decoded && decoded.name && decoded.name.length > 0) {
            Drink.find()
                .sort({ name: 1 })
                .exec((err, drinks) => {
                    if (err) {
                        res.status(500);
                        res.end();
                        return;
                    }
                    drinks.sort(Tools.sortByDrinkName);
                    res.send(drinks);
                    return;
                });
        } else {
            res.status(404);
            return;
        }
    });
}

function addUserDrink(req, res) {
    tokenhandler.verifyPost(req, (err, decoded) => {
        if (decoded && decoded.name && decoded.name.length > 0) {
            var addDrink = req.body;
            if (!addDrink.add) {
                UserDrink.findOne({ user: addDrink.userId, drink: addDrink.drinkId }, {}, { sort: { created_at: -1 } },
                    function(err, data) {
                        if (err) {
                            res.status(500);
                            res.send("Speichern fehlgeschlagen").end();
                            return;
                        }
                        data.remove();
                        res.status(204);
                        res.send("Speichern erfolgreich").end();
                    }
                );
            } else {
                var drinkId = mongoose.Types.ObjectId(addDrink.drinkId);
                var userId = mongoose.Types.ObjectId(addDrink.userId);
                var userDrink = new UserDrink({
                    user: userId,
                    drink: drinkId
                });
                userDrink.save((err, drink) => {
                    if (err) {
                        res.status(500);
                        res.send("Speichern fehlgeschlagen").end();
                        return;
                    } else {
                        console.log(drink);
                        res.status(204);
                        res.send("Speichern erfolgreich").end();
                    }
                });
            }
        }
    });
}

function deleteDrink(req, res) {
    tokenhandler.verifyAdminPost(req, (err, decoded) => {
        if (decoded && decoded.name && decoded.name.length > 0) {
            var editDrink = req.body;
            if (editDrink._id) {
                Drink.findById(editDrink._id, (err, drink) => {
                    if (err) {
                        res.status(500);
                        res.send("Getränk löschen fehlgeschlagen").end();
                        return;
                    }
                    if (drink.name === "Blitzkolben") {
                        res.status(500);
                        res.send("Nur Gott selbst kann den Blitzkolben löschen").end();
                    }
                    drink.remove(err => {
                        if (err) {
                            res.status(500);
                            res.send("Getränk löschen fehlgeschlagen").end();
                            return;
                        } else {
                            res.status(204);
                            res.end();
                            return;
                        }
                    });
                });
            } else {
                res.status(404);
                return;
            }
        }
    });
}

function saveDrink(req, res) {
    tokenhandler.verifyAdminPost(req, (err, decoded) => {
        if (decoded && decoded.name && decoded.name.length > 0) {
            var editDrink = req.body;
            if (editDrink._id) {
                Drink.findByIdAndUpdate(
                    editDrink._id, {
                        $set: { name: editDrink.name }
                    }, { new: true },
                    (err, drink) => {
                        if (err) {
                            res.status(500);
                            res.send("Getränk speichern fehlgeschlagen").end();
                            return;
                        }
                        res.status(204);
                        res.end();
                        return;
                    }
                );
            } else {
                var newDrink = new Drink(req.body);
                newDrink.save((err, drink) => {
                    if (err) {
                        res.status(500);
                        res.send(err).end();
                        return;
                    } else {
                        res.status(204);
                        res.end();
                        return;
                    }
                });
            }
        } else {
            res.status(404);
            return;
        }
    });
}

function getTotalWinner(usersDrinks) {
    var userCounter = [];
    for (let i = 0; i < usersDrinks.length; i++) {
        const user = usersDrinks[i].user;
        var found = false;
        for (let j = 0; j < userCounter.length; j++) {
            const userCount = userCounter[j];
            if (userCount.user._id === user._id) {
                userCount.count++;
                found = true;
            }
        }
        if (!found) {
            userCounter.push({ user: user, count: 1 });
        }
    }
    var winner = { user: null, count: 0 };
    for (let t = 0; t < userCounter.length; t++) {
        var count = userCounter[t].count;
        if (count > winner.count) {
            winner = userCounter[t];
        }
    }
    return winner;
}
