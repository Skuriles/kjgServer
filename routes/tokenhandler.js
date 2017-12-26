var jwt = require("jsonwebtoken");
var fs = require("fs");

module.exports = {
    verifyPost: ((token, cb) => {
        verifyPost(token, cb);
    }),
    verifyAdminPost: ((token, cb) => {
        verifyAdminPost(token, cb);
    })
}

function verifyPost(req, callback) {
    var token = req.headers.authorization;
    var cert = fs.readFileSync("private.key"); // get public key
    var decoded = jwt.verify(token, cert);
    callback(null, decoded);
}

function verifyAdminPost(req, callback) {
    var token = req.headers.authorization;
    var cert = fs.readFileSync("private.key"); // get public key
    var decoded = jwt.verify(token, cert);
    if (decoded && decoded.role === "Admin") {
        callback(null, decoded);
    } else {
        callback("No Admin", null);
    }
}
