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
var routes = require('./routes/routes');

var app = express();

app.use(cors());
// view engine setup

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

//mongostuff

// Connection URL
var url = 'mongodb://kjgAdmin:kjg2017@localhost:27017/kjgapp';

// Use connect method to connect to the server
// mongo user is kjgAdmin, pw: kjg2017
mongoose.connect(url, { useMongoClient: true });
var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    checkRoles(checkUsers);
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
                            callback();
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
            Role.findOne({ name: "Admin" }, (err, role) => {
                if (err) {
                    console.log(err);
                }
                var user = new User({ name: "Admin", password: "admin", role: role._id });
                user.save((err, user) => {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log("Superadmin created successfully")
                    }
                });
            })

        }
    });
}
module.exports = app;