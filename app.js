var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var cors = require('cors');
var mongoose = require('mongoose');
var User = require('./mongoSchemes/user');
var userRoutes = require('./routes/userRoutes');

var app = express();

app.use(cors());
// view engine setup

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/api', userRoutes);
app.use('/public', express.static(path.join(__dirname, 'public')));

//mongostuff

// Connection URL
var url = 'mongodb://kjgAdmin:kjg2017@localhost:27017/kjgapp';

// Use connect method to connect to the server
// mongo user is kjgAdmin, pw: kjg2017
mongoose.connect(url);
var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    var users = User.find(function(err, users) {
        if (users.length === 0) {
            var user = new User({ name: "Admin", password: "admin" });
            user.save(function(err) {
                if (err) {
                    console.log(err);
                } else {
                    console.log("Superadmin created successfully")
                }
            });
        }
    });
    console.log("Connected successfully to server");
});

module.exports = app;