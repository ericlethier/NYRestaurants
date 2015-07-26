/* jshint node: true */
"use strict";
var express = require("express");
var path = require("path");
var multer = require("multer");
var upload = multer({dest:'uploads/'});
//var favicon = require("serve-favicon");
var logger = require("morgan");
var cookieParser = require("cookie-parser");
var session = require("express-session");
var bodyParser = require("body-parser");
var mongo = require("mongodb");
var mongoose = require("mongoose");
var passport = require("passport");
var localStrategy = require("passport-local").Strategy;
var configDB = require("./config/database.js");
var validator = require("express-validator");

require("./models/restaurant");
require("./models/user");

var routes = require("./routes/index");
var restaurants = require("./routes/restaurants");
var users = require("./routes/users");
var admin = require("./routes/admin");
var flash = require("connect-flash");

var app = express();
var router = express.Router();
// view engine setup
app.set("views", [__dirname + "/views", 
                  __dirname + "/views/restaurants",  
                  __dirname + "/views/maps",
                  __dirname + "/views/utils",
                  __dirname + "/views/users",
                  __dirname + "/views/admin"]);
app.set("view engine", "jade");



// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + "/public/favicon.ico"));
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(validator());
app.use(cookieParser("secret"));
app.use(session({
  secret: "mysecretdevelopment",
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));
app.use(passport.initialize());
app.use(passport.session());

var User = require("./models/user");
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(flash());
app.use(express.static(path.join(__dirname, "public")));


// Connect to mongodb
mongoose.connect(configDB.URL, configDB.OPTIONS);

// If the connection throws an error
mongoose.connection.on("error", function(err) {
  console.error("Failed to connect to DB on startup ", err);
});
 
// When the connection is disconnected
mongoose.connection.on("disconnected", function () {
  console.log("Mongoose default connection to DB disconnected");
});

var gracefulExit = function() { 
  mongoose.connection.close(function () {
    console.log("Mongoose default connection with DB is disconnected through app termination");
    process.exit(0);
  });
};
 
// If the Node process ends, close the Mongoose connection
process.on("SIGINT", gracefulExit).on("SIGTERM", gracefulExit);


// Make the session available
app.use(function(req, res, next) {
        console.log(req.session);
        res.locals.user = req.session.user;
        next();
});

// Make our db accessible to our router
app.use(function(req, res, next){
    res.locals.success_messages = req.flash("success_messages");
    res.locals.error_messages = req.flash("error_messages");
    next();
});

app.locals.prettyDate = function(dateString){
    var date = new Date(dateString);
    var d = date.getDate();
    var monthNames = [ "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ];
    var m = monthNames[date.getMonth()];
    var y = date.getFullYear();
    return d+" "+m+ " "+y;
};

app.use("/users", users);
app.use("/restaurants", restaurants);
app.use("/admin", admin);
app.use("/", routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error("Not Found");
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get("env") === "development") {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render("error", {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render("error", {
    message: err.message,
    error: {}
  });
});


module.exports = app;
