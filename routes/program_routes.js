var Day = require("../mongoSchemes/day");
var mongoose = require("mongoose");
var ProgramPoint = require("../mongoSchemes/programPoint");
var tokenhandler = require("./tokenhandler");
var Tools = require("../tools/tools");

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
      var dayObj = new Day(req.body);  
      if (!dayObj._id || dayObj._id === "") {
        dayObj._id = new mongoose.mongo.ObjectID();       
      }          
      Day.findOneAndUpdate(
        { _id: dayObj._id },
        dayObj,
        { upsert: true },
        (err, day) => {
          if (err) {
            res.status(500);
            res.send(err);
            return;
          }  
          res.sendStatus(204);
          return;   
        }
      );
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
        day.remove(err => {
          if (err) {
            res.status(500);
            res.send(err);
            return;
          } else {
            res.sendStatus(204);
            return;
          }
        });
      });
    } else {
      res.sendStatus(404);
      return;
    }
  });
}

function deleteProgramPoint(req, res) {    
  tokenhandler.verifyPost(req, (err, decoded) => {
    if (decoded && decoded.name && decoded.name.length > 0) {
        ProgramPoint.findById(req.body._id, (err, programPoint) => {
        if (err) {
          res.status(500);
          res.send(err);
          return;
        }
        programPoint.remove(err => {
          if (err) {
            res.status(500);
            res.send(err);
            return;
          } else {
            res.send(204);
            return;
          }
        });
      });
    } else {
      res.sendStatus(404);
      return;
    }
  });
}

function getProgramPoints(req, res) {
  tokenhandler.verifyPost(req, (err, decoded) => {
    if (decoded && decoded.name && decoded.name.length > 0) {
        ProgramPoint.find((err, programPoints) => {
        if (err) {
          res.status(500);
          res.send(err);
          return;
        }
        res.send(programPoints);
      });
    } else {
      res.sendStatus(404);
      return;
    }
  });
}

function updateProgramPoint(req, res) {
  tokenhandler.verifyPost(req, (err, decoded) => {
    if (decoded && decoded.name && decoded.name.length > 0) {
      var programPointObj = new ProgramPoint(req.body);
      if (!programPointObj._id || programPointObj._id === "") {
        programPointObj._id = new mongoose.mongo.ObjectID();
      }
      ProgramPoint.findOneAndUpdate(
        { _id: programPointObj._id },
        programPointObj,
        { upsert: true },
        (err, programPoint) => {
          if (err) {
            res.status(500);
            res.send(err);
            return;
          }
          res.sendStatus(204);
          return;
        }
      );
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
        days.sort(Tools.sortByDate);
        res.send(days);
      });
    } else {
      res.sendStatus(404);
      return;
    }
  });
}
