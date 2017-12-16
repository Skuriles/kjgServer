var fs = require('fs');
var path = require('path');
var jwt = require('jsonwebtoken');
var mongoose = require('mongoose');
var User = require('../mongoSchemes/user');
var Drink = require('../mongoSchemes/drink');
var Role = require('../mongoSchemes/role');

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
    deleteUser: (req, res) => {
        deleteUser(req, res);
    },
    getUserList: (req, res) => {
        getUserList(req, res);
    },
    getRoles: (req, res) => {
        getRoles(req, res);
    },
    getUserOverview: (req, res) => {
        getUserOverview(req, res);
    },
    getUserDetails: (req, res) => {
        getUserDetails(req, res);
    }
}

function verifyPost(req, callback) {
    var token = req.headers.authorization;
    var cert = fs.readFileSync('private.key'); // get public key
    jwt.verify(token, cert, callback);
}

function getRoles(req, res) {
    verifyPost(req, (err, decoded) => {
        if (decoded && decoded.name && decoded.name.length > 0) {
            Role.find((err, roles) => {
                if (err) {
                    res.status(500);
                    res.end();
                    return;
                }
                res.send(roles);
                return;
            });
        } else {
            res.status(404);
            return;
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

function addNewUser(req, res) {
    var user = req.body;
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
                    var newUser = new User({ name: user.name, password: user.password, role: role.id });
                    // user.role = mongoose.Types.ObjectId(role.id);
                    newUser.save((err) => {
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

function deleteUser(req, res) {
    verifyPost(req, (err, decoded) => {
        if (decoded && decoded.name && decoded.name.length > 0) {
            var delUser = req.body;
            User.findById(delUser._id, (err, user) => {
                if (err) {
                    res.status(500);
                    res.send("Benutzer löschen fehlgeschlagen").end();
                    return;
                }
                user.remove((err) => {
                    if (err) {
                        res.status(500);
                        res.send("Benutzer löschen fehlgeschlagen").end();
                        return;
                    }
                })
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

function updateUser(req, res) {
    verifyPost(req, (err, decoded) => {
        if (decoded && decoded.name && decoded.name.length > 0) {
            var oldUser = req.body;
            if (oldUser.name = decoded.name) {
                res.status(500);
                res.send("Eigener Benutzer kann nicht geändert werden").end();
                return;
            }
            var pw = oldUser.password;
            var updateUserModel = {};
            if (pw && pw.length > 0) {
                updateUserModel.password = pw;
            }
            updateUserModel.role = mongoose.Types.ObjectId(oldUser.role);
            User.findByIdAndUpdate(oldUser._id, updateUserModel, { new: true },
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

function loginWithToken(req, res) {
    verifyPost(req, (err, decoded) => {
        if (decoded && decoded.name && decoded.name.length > 0) {
            User.findOne({ name: decoded.name, password: decoded.password }, (err, regUser) => {
                if (!err && regUser) {
                    res.send({ user: regUser });
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
                        res.send({ token: token, user: regUser });
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