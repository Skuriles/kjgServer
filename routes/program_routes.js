var Day = require("../mongoSchemes/day");
var fs = require("fs");
var mongoose = require("mongoose");
var ProgramPoint = require("../mongoSchemes/programPoint");
var Job = require("../mongoSchemes/job");
var tokenhandler = require("./tokenhandler");
var Tools = require("../tools/tools");
var multer = require("multer");
var path = require('path');

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
  },
  getJobs: (req, res) => {
    getJobs(req, res);
  },
  updateJob: (req, res) => {
    updateJob(req, res);
  },
  deleteJob: (req, res) => {
    deleteJob(req, res);
  },
  upload: (req, res) => {
    upload(req, res);
  },
  download: (req, res) => {
    download(req, res);
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
        { upsert: true, new: true },
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

function getJobs(req, res) {
  tokenhandler.verifyPost(req, (err, decoded) => {
    if (decoded && decoded.name && decoded.name.length > 0) {
      Job.find((err, jobs) => {
        if (err) {
          res.status(500);
          res.send(err);
          return;
        }
        res.send(jobs);
      });
    } else {
      res.sendStatus(404);
      return;
    }
  });
}

function updateJob(req, res) {
  tokenhandler.verifyPost(req, (err, decoded) => {
    if (decoded && decoded.name && decoded.name.length > 0) {
      var jobObj = new Job(req.body);
      if (!jobObj._id || jobObj._id === "") {
        jobObj._id = new mongoose.mongo.ObjectID();
      }
      Job.findOneAndUpdate(
        { _id: jobObj._id },
        jobObj,
        { upsert: true },
        (err, job) => {
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

function deleteJob(req, res) {
  tokenhandler.verifyPost(req, (err, decoded) => {
    if (decoded && decoded.name && decoded.name.length > 0) {
      Job.findById(req.body._id, (err, job) => {
        if (err) {
          res.status(500);
          res.send(err);
          return;
        }
        job.remove(err => {
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

function upload(req, res) {
  tokenhandler.verifyPost(req, (err, decoded) => {
    if (decoded && decoded.name && decoded.name.length > 0) {      
      var storage = multer.diskStorage({
        //multers disk storage settings
        destination: function(req, file, cb) {        
          var uploadPath = path.join(APPROOTPATH, "attachments", req.headers.programid);
          if (!fs.existsSync(uploadPath)) {           
            fs.mkdir(uploadPath, err => cb(err, uploadPath));
          } else {
            cb(null, uploadPath);
          }
        },
        filename: function(req, file, cb) {
          cb(null, file.originalname);
        }
      });
      var upload = multer({
        //multer settings
        storage: storage
      }).single("file");

      /** API path that will upload the files */

      upload(req, res, function(err) {
      
        if (err) { 
           console.log("folder does not exist " + uploadPath)
          res.send(err);
          return;
        }
        res.sendStatus(204);
      });
    }
  });
}

function download(req, res) {
  var id = req.params.id;
  var fileName = req.params.fileName;
  var dlpath = path.join(APPROOTPATH, "attachments", id, fileName);
  fs.access(dlpath, fileName, err => {
    if (err) {
      res.sendStatus(404);
    } else {
      res.download(dlpath);
    }
  });
}
