var express = require('express');
var app = express();
var bodyParser = require("body-parser");
var mongoose = require('mongoose');
var passport = require("passport");
var LocalStrategy = require("passport-local");
var methodOverride = require("method-override");

var Campground = require("./models/campground");
var Comment = require("./models/comment");
var seedDB = require("./seeds");
var User = require("./models/user");

var commentRoutes = require("./routes/comments");
var campgroundRoutes = require("./routes/campgrounds");
var indexRoutes = require("./routes/index");

var flash = require("connect-flash");
app.use(flash());


mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);

mongoose.connect("mongodb+srv://keefmanjack:simple@firstdatabase-bdxnh.mongodb.net/YelpCamp_V8?retryWrites=true&w=majority")



app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));

app.set("view engine", "ejs");


//seed the database
//seedDB();

//passport configuration
app.use(require("express-session")({
	secret: "I love YelpCamp",
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
});

app.use("/campgrounds/:id/comments/", commentRoutes);
app.use(indexRoutes);
app.use("/campgrounds", campgroundRoutes);



app.listen(3000, 'localhost', function(){
	console.log("Server started on port 3000");
});

