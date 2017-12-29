var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var bodyParser = require('body-parser');
var cors = require('cors');
var compression = require('compression')
var mongoose = require('mongoose');
var User = require('./mongoSchemes/user');
var Role = require('./mongoSchemes/role');
var Drink = require('./mongoSchemes/drink');
var routes = require('./routes/routes');
var bcrypt = require('bcrypt-nodejs');
var webpush = require('web-push');

var app = express();

app.use(cors());
// view engine setup
// to delete?
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/api', routes);
app.use('/public', express.static(path.join(__dirname, 'public')));
app.get('/ngsw-worker.js', function(req, res) {
    res.sendfile(__dirname + '/public/ngsw-worker.js');
});
//default route:
app.get('*', function(req, res) {
    res.sendfile(__dirname + '/public/index.html');
});

var vapidKeys = {
    publicKey: 'BKTnbc-Ix1NCqty80oTIeLcGTTwmneo6Y9LwHSoxp7lgtmBDYfHUY0MQIvg2wfyzJZ0hdKZ_tfo7FtiEq3lGKxw',
    privateKey: 'XofyPUHu8KSJCOmfH7PJN-cw3vNWmXHSJDX1ohqrApc'
}
webpush.setGCMAPIKey('AIzaSyCuFlNg01aXLvGkI1ValqTFLS7SlDcttrE');
//push stuff
webpush.setVapidDetails(
    'mailto:cabeskuriles@googlemail.com',
    vapidKeys.publicKey,
    vapidKeys.privateKey
);

//mongostuff

// Connection URL
//local
//var url = 'mongodb://kjgAdmin:kjg2017@localhost:27017/kjgapp';
// uberspace
var url = 'mongodb://kjgAdmin:kjg2017@localhost:21197/kjgapp';

// Use connect method to connect to the server
// mongo user is kjgAdmin, pw: kjg2017
mongoose.connect(url, { useMongoClient: true });
var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    checkRoles(checkUsers);
    checkBlitzKolben();
    console.log("Connected successfully to server");
});

function checkRoles(callback) {
    Role.find((err, roles) => {
        if (err) {
            console.log(err);
        } else {
            if (roles.length <= 0) {
                var adminRole = new Role({ name: "Admin" });
                var userRole = new Role({ name: "Knecht" });
                var superAdminRole = new Role({ name: "SuperAdmin" });
                adminRole.save(() => {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log("AdminRole created successfully");
                    }
                    userRole.save(() => {
                        if (err) {
                            console.log(err);
                        } else {
                            console.log("UserRole created successfully");
                            superAdminRole.save(() => {
                                if (err) {
                                    console.log(err);
                                } else {
                                    console.log("SuperAdminRole created successfully");
                                    callback();
                                }
                            });
                        }
                    })
                });
            } else {
                callback();
            }

        }
    });
}

function checkUsers() {
    User.find((err, users) => {
        if (users.length === 0) {
            Role.findOne({ name: "SuperAdmin" }, (err, role) => {
                if (err) {
                    console.log(err);
                }
                bcrypt.hash("admin", null, null, function(err, hash) {
                    var user = new User({ name: "Admin", password: hash, role: role._id });
                    user.save((err, user) => {
                        if (err) {
                            console.log(err);
                        } else {
                            console.log("Superadmin created successfully")
                        }
                    });
                });
            })
        }
    });
}

function checkBlitzKolben() {
    console.log("checkBlitzKolben");
    Drink.findOne({ name: "Blitzkolben" }, (err, drink) => {
        if (err) {
            console.log(err);
        }
        if (!drink) {
            var blitzi = new Drink({ name: "Blitzkolben" });
            blitzi.save((err, drink) => {
                if (err) {
                    console.log(err);
                } else {
                    console.log("Blitzkolben created successfully")
                }
            });
        }
    })
}

module.exports = app;
