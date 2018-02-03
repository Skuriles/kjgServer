var Rule = require("../mongoSchemes/rule");
var TeamRule = require("../mongoSchemes/teamrule");
var fs = require("fs");
var mongoose = require("mongoose");
var tokenhandler = require("./tokenhandler");

module.exports = {
  updateRule: (req, res) => {
    updateRule(req, res);
  },
  deleteRule: (req, res) => {
    deleteRule(req, res);
  },
  getRules: (req, res) => {
    getRules(req, res);
  },
  updateTeamRule: (req, res) => {
    updateTeamRule(req, res);
  },
  deleteTeamRule: (req, res) => {
    deleteTeamRule(req, res);
  },
  getTeamRules: (req, res) => {
    getTeamRules(req, res);
  }
};

function getRules(req, res) {
    tokenhandler.verifyPost(req, (err, decoded) => {
        if (decoded && decoded.name && decoded.name.length > 0) {
            Rule.find((err, rules) => {
                if (err) {
                    res.status(500);
                    res.end();
                    return;
                }
                res.send(rules);
                return;
            });
        } else {
            res.sendStatus(404);
            return;
        }
    });
}

function updateRule(req, res) {
    tokenhandler.verifyPost(req, (err, decoded) => {
        if (decoded && decoded.name && decoded.name.length > 0) {
            var updateRuleModel = {};
            updateRuleModel.name = req.body.name;
            if(!req.body._id){
                var rule = new Rule(updateRuleModel);
                rule.save((err, rule) => {
                    if (err) {
                        res.status(500);
                        res.end();
                        return;
                    }
                    res.send(204);
                    return;
                });
            } else {                
                Rule.findByIdAndUpdate(updateRuleModel._id, {$set: { name: updateRuleModel.name }}, (err, rule) => {
                    if (err) {
                        res.status(500);
                        res.end();
                        return;
                    }
                    res.send(204);
                    return;
                });
            }
           
        } else {
            res.sendStatus(404);
            return;
        }
    });
}

function deleteRule(req, res) {
    tokenhandler.verifyAdminPost(req, (err, decoded) => {
        if (decoded && decoded.name && decoded.name.length > 0) {
            var delRule = req.body;
            Rule.findById(delRule._id, (err, rule) => {
                if (err) {
                    res.status(500);
                    res.send("Regel löschen fehlgeschlagen").end();
                    return;
                }
                rule.remove(err => {
                    if (err) {
                        res.status(500);
                        res.send("Regel löschen fehlgeschlagen").end();
                        return;
                    }
                });
                res.status(204);
                res.end();
                return;
            });
        } else {
            res.sendStatus(404);
            return;
        }
    });
}

function getTeamRules(req, res) {
    tokenhandler.verifyPost(req, (err, decoded) => {
        if (decoded && decoded.name && decoded.name.length > 0) {
            TeamRule.find((err, rules) => {
                if (err) {
                    res.status(500);
                    res.end();
                    return;
                }
                res.send(rules);
                return;
            });
        } else {
            res.sendStatus(404);
            return;
        }
    });
}

function updateTeamRule(req, res) {
    tokenhandler.verifyPost(req, (err, decoded) => {
        if (decoded && decoded.name && decoded.name.length > 0) {
            var updateRuleModel = {};
            updateRuleModel.name = req.body.name;
            if(!req.body._id){
                var rule = new TeamRule(updateRuleModel);
                rule.save((err, rule) => {
                    if (err) {
                        res.status(500);
                        res.end();
                        return;
                    }
                    res.send(204);
                    return;
                });
            } else {                
                TeamRule.findByIdAndUpdate(updateRuleModel._id, {$set: { name: updateRuleModel.name }}, (err, rule) => {
                    if (err) {
                        res.status(500);
                        res.end();
                        return;
                    }
                    res.send(204);
                    return;
                });
            }
           
        } else {
            res.sendStatus(404);
            return;
        }
    });
}

function deleteTeamRule(req, res) {
    tokenhandler.verifyAdminPost(req, (err, decoded) => {
        if (decoded && decoded.name && decoded.name.length > 0) {
            var delRule = req.body;
            TeamRule.findById(delRule._id, (err, rule) => {
                if (err) {
                    res.status(500);
                    res.send("Regel löschen fehlgeschlagen").end();
                    return;
                }
                rule.remove(err => {
                    if (err) {
                        res.status(500);
                        res.send("Regel löschen fehlgeschlagen").end();
                        return;
                    }
                });
                res.status(204);
                res.end();
                return;
            });
        } else {
            res.sendStatus(404);
            return;
        }
    });
}