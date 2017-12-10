var fs = require('fs');
var path = require('path');
var jwt = require('jsonwebtoken');
var mongoose = require('mongoose');
var User = require('../mongoSchemes/user');
var Drink = require('../mongoSchemes/drink');
var UserDrink = require('../mongoSchemes/drinkPerUser');
var Role = require('../mongoSchemes/role');
var Tools = require('../tools/tools');

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
    updateUserDrinks: (req, res) => {
        updateUserDrinks(req, res);
    },
    saveDrink: (req, res) => {
        saveDrink(req, res);
    },
    deleteDrink: (req, res) => {
        deleteDrink(req, res);
    },
    getDailyWinners: (req, res) => {
        getDailyWinners(req, res);
    }
}

function verifyPost(req, callback) {
    var token = req.headers.authorization;
    var cert = fs.readFileSync('private.key'); // get public key
    jwt.verify(token, cert, callback);
}

function getUserDrinks(req, res) {
    verifyPost(req, (err, decoded) => {
        if (decoded && decoded.name && decoded.name.length > 0) {
            var userids = req.body;
            UserDrink.find({ user: { $in: userids } }).populate('user drink').exec((err, userDrinks) => {
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
                            drinkList[j].drinks.push({
                                drinkId: userDrinks[i].drink._id,
                                drinkName: userDrinks[i].drink.name,
                                count: userDrinks[i].count
                            });
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
                            count: userDrinks[i].count
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
    verifyPost(req, (err, decoded) => {
        if (decoded && decoded.name && decoded.name.length > 0) {
            Drink.find().sort({ name: 1 }).exec((err, drinks) => {
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

function getDailyWinners(req, res) {
    verifyGet(req, (err, decoded) => {
        if (decoded && decoded.user && decoded.user.length > 0) {
            jsonfile.readFile(path.join(filePath, file), (err, users) => {
                if (!users) {
                    users = [];
                    res.send(users);
                    return;
                }
                var usersDaily = getUsersDaily(users);
                var winners = getWinnersPerDay(usersDaily)
                res.send(winners);
                return;
            });
        } else {
            res.status(404);
            login(res);
            return;
        }
    });
}

function getWinnersPerDay(users) {
    var dayWinners = [];
    for (var i = 0; i < users.length; i++) {
        for (var j = 0; j < users[i].dayTotal.length; j++) {
            var dayTotal = users[i].dayTotal[j];
            var newEntry = true;
            for (var k = 0; k < dayWinners.length; k++) {
                if (dayWinners[k].day === dayTotal.day && dayWinners[k].month === dayTotal.month && dayWinners[k].year === dayTotal.year) {
                    if (dayWinners[k].total < dayTotal.total) {
                        dayWinners[k].name = users[i].name;
                        dayWinners[k].total = dayTotal.total;

                    }
                    if (dayWinners[k].total == dayTotal.total) {
                        if (dayWinners[k].name.indexOf(users[i].name) === -1) {
                            dayWinners[k].name = dayWinners[k].name + " & " + users[i].name;
                        }
                    }
                    newEntry = false;
                    break;
                }
            }
            if (newEntry) {
                dayWinners.push({ name: users[i].name, day: dayTotal.day, month: dayTotal.month, year: dayTotal.year, total: dayTotal.total });
            }
        }
    }
    return dayWinners.sort(sortByDate);
}

function getUsersDaily(users) {
    var usersDaily = [];
    // {day, user, total}
    for (var i = 0; i < users.length; i++) {
        var userDayTotal = {};
        userDayTotal.name = users[i].name;
        userDayTotal.dayTotal = [];
        for (var j = 0; j < users[i].drinks.length; j++) {
            for (var k = 0; k < users[i].drinks[j].timestamp.length; k++) {
                var timestamp = users[i].drinks[j].timestamp[k];
                var date = new Date(timestamp);
                var day = date.getDate();
                var month = date.getMonth() + 1;
                var year = date.getFullYear();
                var dayFound = false;
                for (var t = 0; t < userDayTotal.dayTotal.length; t++) {
                    if (userDayTotal.dayTotal[t].day === day && userDayTotal.dayTotal[t].month === month && userDayTotal.dayTotal[t].year === year) {
                        if (!userDayTotal.dayTotal[t].total) {
                            userDayTotal.dayTotal[t].total = 1;
                        } else {
                            userDayTotal.dayTotal[t].total++;
                        }
                        dayFound = true;
                        break;
                    }
                }
                if (!dayFound) {
                    userDayTotal.dayTotal.push({ day: day, month: month, year: year, total: 1 });
                }
            }
        }
        usersDaily.push(userDayTotal);
    }
    return usersDaily;
}

function updateUserDrinks(req, res) {
    verifyPost(req, (err, decoded) => {
        if (decoded && decoded.name && decoded.name.length > 0) {
            var userDrink = req.body;
            if (userDrink) {
                var updateDrinkUser = [];
                var promises = [];
                var errors = [];
                for (var i = 0; i < userDrink.drinks.length; i++) {
                    var promise = UserDrink.update({ user: userDrink.userid, drink: userDrink.drinks[i].drinkId }, { count: userDrink.drinks[i].count }, { upsert: true });
                    promises.push(promise);
                }
                Promise.all(promises)
                    .then(values => {
                        if (errors.length > 0) {
                            console.log(errors);
                            res.status(500);
                            res.send("Speichern fehlgeschlagen").end();
                            return;
                        } else {
                            res.status(204);
                            res.end();
                            return;
                        }
                    })
                    .catch(err => {
                        res.status(500);
                        res.send("Speichern fehlgeschlagen").end();
                        return;
                    });
            }

        } else {
            res.status(404);
            return;
        }
    });
}

function deleteDrink(req, res) {
    verifyPost(req, (err, decoded) => {
        if (decoded && decoded.name && decoded.name.length > 0) {
            var editDrink = req.body;
            if (editDrink._id) {
                Drink.findById(editDrink._id,
                    (err, drink) => {
                        if (err) {
                            res.status(500);
                            res.send("Getränk löschen fehlgeschlagen").end();
                            return;
                        }
                        drink.remove((err) => {
                            if (err) {
                                res.status(500);
                                res.send("Getränk löschen fehlgeschlagen").end();
                                return;
                            } else {
                                res.status(204)
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
    verifyPost(req, (err, decoded) => {
        if (decoded && decoded.name && decoded.name.length > 0) {
            var editDrink = req.body;
            if (editDrink._id) {
                Drink.findByIdAndUpdate(editDrink._id, {
                        $set: { name: editDrink.name }
                    }, { new: true },
                    (err, drink) => {
                        if (err) {
                            res.status(500);
                            res.send("Getränk speichern fehlgeschlagen").end();
                            return;
                        }
                        res.status(204)
                        res.end();
                        return;

                    });
            } else {
                var newDrink = new Drink(req.body);
                newDrink.save((err, drink) => {
                    if (err) {
                        res.status(500);
                        res.send(err).end();
                        return;
                    } else {
                        res.status(204)
                        res.end();
                        return;
                    }
                })
            }

        } else {
            res.status(404);
            return;
        }
    });
}