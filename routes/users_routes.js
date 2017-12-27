var fs = require("fs");
var path = require("path");
var jwt = require("jsonwebtoken");
var mongoose = require("mongoose");
var User = require("../mongoSchemes/user");
var Drink = require("../mongoSchemes/drink");
var Role = require("../mongoSchemes/role");
var bcrypt = require("bcrypt-nodejs");
var tokenhandler = require("./tokenhandler");

module.exports = {
    start: (req, res) => {
        // localhost
        // res.sendFile(path.resolve(__dirname + '/../views/index.html'));
        res.sendFile(path.resolve(__dirname + "/../public/index.html"));
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
    }
};

function getRoles(req, res) {
    tokenhandler.verifyPost(req, (err, decoded) => {
        if (decoded && decoded.name && decoded.name.length > 0) {
            Role.find({ name: { $nin: ["SuperAdmin"] } }, (err, roles) => {
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
    tokenhandler.verifyPost(req, (err, decoded) => {
        if (decoded && decoded.name && decoded.name.length > 0) {
            User.find({ name: { $nin: ["admin"] } }, (err, users) => {
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
    tokenhandler.verifyGet(req, (err, decoded) => {
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
                var date =
                    winners[index].day +
                    "." +
                    winners[index].month +
                    "." +
                    winners[index].year;
                returnUsers.push({
                    name: winners[index].name,
                    total: winners[index].total,
                    date: date
                });
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

function addNewUser(req, res) {
    var user = req.body;
    User.findOne({ name: user.name.toLowerCase() }, (err, regUser) => {
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
                    bcrypt.hash(user.password, null, null, function(err, hash) {
                        if (err) {
                            res.status(500);
                            res.send(err).end();
                            return;
                        }
                        if (hash) {
                            var newUser = new User({
                                name: user.name,
                                password: hash,
                                role: role.id
                            });
                            // user.role = mongoose.Types.ObjectId(role.id);
                            newUser.save(err => {
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
                        } else {
                            res.status(500);
                            res.send("User pw hash was not created").end();
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
    tokenhandler.verifyAdminPost(req, (err, decoded) => {
        if (decoded && decoded.name && decoded.name.length > 0) {
            var delUser = req.body;
            User.findById(delUser._id, (err, user) => {
                if (err) {
                    res.status(500);
                    res.send("Benutzer löschen fehlgeschlagen").end();
                    return;
                }
                user.remove(err => {
                    if (err) {
                        res.status(500);
                        res.send("Benutzer löschen fehlgeschlagen").end();
                        return;
                    }
                });
                res.status(204);
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
    tokenhandler.verifyAdminPost(req, (err, decoded) => {
        if (decoded && decoded.name && decoded.name.length > 0) {
            var oldUser = req.body;
            if (oldUser.name === decoded.name) {
                res.status(500);
                res.send("Eigener Benutzer kann nicht geändert werden").end();
                return;
            }
            var pw = oldUser.password;
            var updateUserModel = {};
            if (pw && pw.length > 0) {
                bcrypt.hash(pw, null, null, function(err, hash) {
                    if (!err && hash) {
                        updateUserModel.password = hash;
                    } else {
                        res.status(500);
                        res.send("Benutzer speichern fehlgeschlagen").end();
                        return;
                    }
                });
            }
            updateUserModel.role = mongoose.Types.ObjectId(oldUser.role);
            User.findByIdAndUpdate(
                oldUser._id,
                updateUserModel, { new: true },
                (err, user) => {
                    if (err) {
                        res.status(500);
                        res.send("Benutzer speichern fehlgeschlagen").end();
                        return;
                    }
                    res.status(204);
                    res.end();
                    return;
                }
            );
        } else {
            res.status(404);
            return;
        }
    });
}

function loginWithToken(req, res) {
    tokenhandler.verifyPost(req, (err, decoded) => {
        if (decoded && decoded.name && decoded.name.length > 0) {
            User.findOne({ name: decoded.name, password: decoded.password }).populate("role").exec(
                (err, regUser) => {
                    if (!err && regUser) {
                        res.send({ user: regUser });
                        return;
                    } else {
                        res.status(403);
                        res.send("Session abgelaufen").end();
                    }
                }
            );
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
                var cert = fs.readFileSync("private.key");
                User.findOne({ name: user.name })
                    .select("password name role")
                    .populate("role")
                    .exec((err, regUser) => {
                        if (!err && regUser) {
                            bcrypt.compare(user.password, regUser.password, function(
                                err,
                                result
                            ) {
                                if (err) {
                                    res.status(500);
                                    res.send(err).end();
                                    return;
                                }
                                var token = jwt.sign({
                                        name: user.name,
                                        password: regUser.password,
                                        role: regUser.role.name
                                    },
                                    cert, { expiresIn: "10y" }
                                );
                                regUser.password = null;
                                res.send({ token: token, user: regUser });
                                return;
                            });
                        } else {
                            res.status(500);
                            res.send("Benutzer nicht gefunden oder PW falsch").end();
                        }
                    });
            }
        });
    } catch (error) {
        res.status(500);
        res.send("Benutzer nicht gefunden oder PW falsch").end();
    }
}
