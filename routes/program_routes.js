var Day = require("../mongoSchemes/day");
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
                res.send(204);
                return;
            });
        } else {
            res.status(404);
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
                        res.send(204);
                        return;
                    }
                });
            })
        } else {
            res.status(404);
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
            res.status(404);
            return;
        }
    });
}
