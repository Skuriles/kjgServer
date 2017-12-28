var Day = require("../mongoSchemes/day");
var DailyPlanEle = require("../mongoSchemes/dailyPlanEle");
var tokenhandler = require("./tokenhandler");

module.exports = {
    updateDay: (req, res) => {
        updateDay(req, res);
    },
    deleteDay: (req, res) => {
        deleteDay(req, res);
    },
    getDays: (req, res) => {
        getDays(req, res);
    },
    getProgramPoints: (req, res) => {
        getProgramPoints(req, res);
    },
    deleteProgramPoint: (req, res) => {
        deleteProgramPoint(req, res);
    },
    updateProgramPoint: (req, res) => {
        updateProgramPoint(req, res);
    }
};

function updateDay(req, res) {
    tokenhandler.verifyPost(req, (err, decoded) => {
        if (decoded && decoded.name && decoded.name.length > 0) {
            var dayobj = new Day(req.body);
            Day.findOneAndUpdate({ _id: dayobj._id }, dayobj, { upsert: true }, (err, day) => {
                if (err) {
                    res.status(500);
                    res.send(err);
                    return;
                }
                res.sendStatus(204);
                return;
            });
        } else {
            res.sendStatus(404);
            return;
        }
    });
}

function deleteDay(req, res) {
    tokenhandler.verifyPost(req, (err, decoded) => {
        if (decoded && decoded.name && decoded.name.length > 0) {
            Day.findById(req.body._id, (err, day) => {
                if (err) {
                    res.status(500);
                    res.send(err);
                    return;
                }
                day.remove((err) => {
                    if (err) {
                        res.status(500);
                        res.send(err);
                        return;
                    } else {
                        res.sendStatus(204);
                        return;
                    }
                });
            })
        } else {
            res.sendStatus(404);
            return;
        }
    });
}

function deleteProgramPoint(req, res) {
    tokenhandler.verifyPost(req, (err, decoded) => {
        if (decoded && decoded.name && decoded.name.length > 0) {
            DailyPlanEle.findById(req.body._id, (err, dailyPlanEle) => {
                if (err) {
                    res.status(500);
                    res.send(err);
                    return;
                }
                dailyPlanEle.remove((err) => {
                    if (err) {
                        res.status(500);
                        res.send(err);
                        return;
                    } else {
                        res.send(204);
                        return;
                    }
                });
            })
        } else {
            res.sendStatus(404);
            return;
        }
    });
}

function getProgramPoints(req, res) {
    tokenhandler.verifyPost(req, (err, decoded) => {
        if (decoded && decoded.name && decoded.name.length > 0) {
            DailyPlanEle.find((err, dailyPlanEles) => {
                if (err) {
                    res.status(500);
                    res.send(err);
                    return;
                }
                res.send(dailyPlanEles);
            })
        } else {
            res.sendStatus(404);
            return;
        }
    });
}

function updateProgramPoint(req, res) {
    tokenhandler.verifyPost(req, (err, decoded) => {
        if (decoded && decoded.name && decoded.name.length > 0) {
            var dailyPlanEleObj = new DailyPlanEle(req.body);
            DailyPlanEle.findOneAndUpdate({ _id: dailyPlanEleObj._id }, dailyPlanEleObj, { upsert: true }, (err, dailyPlanEle) => {
                if (err) {
                    res.status(500);
                    res.send(err);
                    return;
                }
                res.sendStatus(204);
                return;
            });
        } else {
            res.sendStatus(404);
            return;
        }
    });
}

function getDays(req, res) {
    tokenhandler.verifyPost(req, (err, decoded) => {
        if (decoded && decoded.name && decoded.name.length > 0) {
            Day.find((err, days) => {
                if (err) {
                    res.status(500);
                    res.send(err);
                    return;
                }
                res.send(days);
            })
        } else {
            res.sendStatus(404);
            return;
        }
    });
}
