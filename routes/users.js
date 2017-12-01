var fs = require('fs');
var path = require('path');
var jwt = require('jsonwebtoken');
var mongoose = require('mongoose');
var User = require('../mongoSchemes/user');

module.exports = {
    start: (req, res) => {
        res.sendFile(path.resolve(__dirname + '/../views/index.html'));
    },
    loginWithToken: (req, res) => {
        loginWithToken(req, res);
    },
    setUserLogin: (req, res) => {
        setUserLogin(req, res);
    },
    addNewUser: (req, res) => {
        addNewUser(req, res);
    },
    updateUser: (req, res) => {
        updateUser(req, res);
    },
    getUserList: (req, res) => {
        getUserList(req, res);
    },
    getUserOverview: (req, res) => {
        getUserOverview(req, res);
    },
    getUserDetails: (req, res) => {
        getUserDetails(req, res);
    },
    checkAdmin: (req, res) => {
        checkAdmin(req, res);
    },
    updateUserDrinks: (req, res) => {
        updateUserDrinks(req, res);
    },
    saveDrink: (req, res) => {
        saveDrink(req, res);
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

function writeFile(users, res) {
    var userFilePath = path.join(filePath, file);
    copyFile(userFilePath, path.join(filePath, "user.backup.json"));
    jsonfile.writeFile(path.join(filePath, file), users, (err) => {
        if (!err) {
            res.status(200).end();
        } else {
            res.status(500).end();
        }
    });
}

function getUserList(req, res) {
    verifyPost(req, (err, decoded) => {
        if (decoded && decoded.name && decoded.name.length > 0) {
            User.find((err, users) => {
                if (err) {
                    res.status(500);
                    res.end();
                    return;
                }
                res.send(users);
                return;
            });
        } else {
            res.status(404);
            return;
        }
    });
}

function getUserOverview(req, res) {
    verifyGet(req, (err, decoded) => {
        if (decoded && decoded.user && decoded.user.length > 0) {
            jsonfile.readFile(path.join(filePath, file), (err, users) => {
                if (!users) {
                    res.status(404);
                    res.end();
                    return;
                }
                var returnUsers = [];
                var champuser = null;
                var blitzchamp = null;
                // total champ 
                var totalOverall = 0;
                var totalBlitz = 0;
                for (var i = 0; i < users.length; i++) {
                    var total = 0;
                    var blitz = 0;
                    for (var j = 0; j < users[i].drinks.length; j++) {
                        total += users[i].drinks[j].count;
                        if (j === 0) {
                            blitz += users[i].drinks[j].count;
                        }
                    }
                    if (total >= totalOverall) {
                        champuser = { name: users[i].name, total: total, date: null };
                        totalOverall = total;
                    }
                    if (blitz >= totalBlitz) {
                        blitzchamp = { name: users[i].name, total: blitz, date: null };
                        totalBlitz = blitz;
                    }
                }
                returnUsers.push(champuser);
                // daily champ
                var usersDaily = getUsersDaily(users);
                var winners = getWinnersPerDay(usersDaily);
                if (!winners || winners.length === 0) {
                    res.status(404);
                    return;
                }
                var index = winners.length - 1;
                var date = winners[index].day + "." + winners[index].month + "." + winners[index].year;
                returnUsers.push({ name: winners[index].name, total: winners[index].total, date: date });
                returnUsers.push(blitzchamp);
                res.send(returnUsers).end();
            });
        } else {
            res.status(404);
            login(res);
            return;
        }
    });
}

function getUserDetails(req, res) {
    verifyPost(req, (err, decoded) => {
        if (decoded && decoded.user && decoded.user.length > 0) {
            jsonfile.readFile(path.join(filePath, file), (err, users) => {
                if (!users) {
                    res.status(404);
                    res.end();
                }
                var userName = req.body.userDetail;
                for (var i = 0; i < users.length; i++) {
                    if (users[i].name === userName) {
                        res.send(users[i]);
                        return;
                    }
                }
                res.send(null);
            });
        } else {
            res.status(403);
            res.end();
            return;
        }
    });
}

function checkAdmin(req, res) {
    verifyPost(req, (err, decoded) => {
        if (decoded && decoded.user && decoded.user.toLowerCase() === "bene") {
            res.end();
        } else {
            res.status(403);
            res.end();
            return;
        }
    });
}

function addNewUser(req, res) {
    var user = new User(req.body);
    var checkUser = user.toObject();
    User.findOne({ name: user.name, password: user.password }, (err, regUser) => {
        if (err) {
            res.status(500);
            res.send(err).end();
            return;
        }
        if (!regUser) {
            Role.findOne({ name: "Knecht" }, (err, role) => {
                if (err) {
                    console.log(err);
                } else {
                    user.role = role.id;
                    user.save((err) => {
                        if (err) {
                            res.status(500);
                            res.send(err).end();
                            return;
                        } else {
                            res.status(204);
                            res.send("Erfolgreich registriert").end();
                            return;
                        }
                    });
                }
            });

        } else {
            res.status(500);
            res.send("Benutzer existiert bereits").end();
        }

    });
}

function updateUser(req, res) {
    verifyPost(req, (err, decoded) => {
        if (decoded && decoded.name && decoded.name.length > 0) {
            var oldUser = req.body;
            User.findByIdAndUpdate(oldUser.id, {
                    $set: { password: oldUser.password }
                }, { new: true },
                (err, user) => {
                    if (err) {
                        res.status(500);
                        res.send("Benutzer speichern fehlgeschlagen").end();
                        return;
                    }
                    res.status(204)
                    res.end();
                    return;

                });
        } else {
            res.status(404);
            return;
        }
    });
}

function saveUserDrink(users, index, type, res) {
    var drinkIndex = parseInt(type);
    var timestamp = new Date().getTime();
    users[index].drinks[drinkIndex].count++;
    users[index].drinks[drinkIndex].timestamp.push(timestamp);
    writeFile(users, res);
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

function sortByDate(a, b) {
    var aDay = a.day;
    var aMonth = a.Month - 1;
    var aYear = a.Year;
    var aDate = new Date(aYear, aMonth, aDay).getTime();
    var bDay = b.day;
    var bMonth = b.Month - 1;
    var bYear = b.Year;
    var bDate = new Date(bYear, bMonth, bDay).getTime();
    return ((aDate < bDate) ? -1 : ((aDate > bDate) ? 1 : 0));
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
        if (decoded && decoded.user && decoded.user.length > 0) {
            fs.access(filePath, (err) => {
                if (err) {
                    fs.mkdir(filePath);
                }
            });
            var drinks = JSON.parse(req.body.drinks);
            var userName = req.body.name;
            var users = [];
            jsonfile.readFile(path.join(filePath, file), (err, users) => {
                for (var i = 0; i < users.length; i++) {
                    if (users[i].name.toLowerCase() === userName.toLowerCase()) {
                        users[i].drinks = drinks;
                        writeFile(users, res);
                        return;
                    }
                }
                res.status(500);
                res.send("Benutzer nicht gefunden - bitte neu einloggen").end();
            });
        } else {
            res.status(404);
            login(res);
            return;
        }
    });
}

function saveDrink(req, res) {
    verifyPost(req, (err, decoded) => {
        if (decoded && decoded.user && decoded.user.length > 0) {
            fs.access(filePath, (err) => {
                if (err) {
                    fs.mkdir(filePath);
                }
            });
            var type = req.body.type;
            var users = [];
            jsonfile.readFile(path.join(filePath, file), (err, users) => {
                if (!users) {
                    users = [];
                }
                for (var i = 0; i < users.length; i++) {
                    if (users[i].name.toLowerCase() === decoded.user) {
                        saveUserDrink(users, i, type, res);
                        return;
                    }
                }
                res.status(500);
                res.send("Benutzer nicht gefunden - bitte neu einloggen").end();
            });
        } else {
            res.status(404);
            login(res);
            return;
        }
    });
}

function loginWithToken(req, res) {
    verifyPost(req, (err, decoded) => {
        if (decoded && decoded.name && decoded.name.length > 0) {
            User.findOne({ name: decoded.name, password: decoded.password }, (err, regUser) => {
                if (!err && regUser) {
                    // info https://github.com/angular/angular/issues/18680
                    res.status(204);
                    res.send("login").end();
                    return;
                } else {
                    res.status(403);
                    res.send("Session abgelaufen").end();
                }
            })
        } else {
            res.status(403);
            res.send("Session abgelaufen").end();
            return;
        }
    });
}

function setUserLogin(req, res) {
    try {
        User.find(function(err, users) {
            if (users && users.length > 0) {
                var user = new User(req.body).toObject();
                var cert = fs.readFileSync('private.key');
                console.log(user.name);
                var token = jwt.sign({ name: user.name, password: user.password }, cert, { expiresIn: '10y' });

                User.findOne({ name: user.name, password: user.password }, (err, regUser) => {
                    if (!err && regUser) {
                        res.send({ token });
                        return;
                    } else {
                        res.status(500);
                        res.send("Benutzer nicht gefunden oder PW falsch").end();
                    }
                })
            }

        });
    } catch (error) {
        res.status(500);
        res.send("Benutzer nicht gefunden oder PW falsch").end();
    }
}