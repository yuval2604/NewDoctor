// const upload = multer({dest:'uploads/'});

var express = require("express"),
  app = express(),
  bodyParser = require("body-parser"),
  mongoose = require("mongoose"),
  passport = require("passport"),
  LocalStrategy = require("passport-local"),
  methodOverride = require("method-override"),
  Doctor = require("./models/doctor"),
  // seedDB = require("./seeds");

  sendemail = require("./public/stylesheets/js/emailsender");

//requring routes
var doctorRoutes = require("./routes/doctors");

// mongoose.connect("mongodb://localhost/newdoctor");

mongoose.connect("mongodb://doctor:Yuval2604@ds159546.mlab.com:59546/doctor");

// mongoose.connect("mongodb://Yuval:Yuval2604@ds233596.mlab.com:33596/goodbrain");

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use("/public/stylesheets/img", express.static("public/stylesheets/img"));

//seedDB();

// PASSPORT CONFIGURATION
// app.use(require("express-session")({
//     secret: "Once again Rusty wins cutest dog!",
//     resave: false,
//     saveUninitialized: false
// }));
// app.use(passport.initialize());
// app.use(passport.session());
// passport.use(new LocalStrategy(User.authenticate()));
// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next) {
  res.locals.currentUser = req.user;
  next();
});

app.use("/", doctorRoutes); // was indexRoutes

app.listen(2000);

// app.listen(process.env.PORT, process.env.IP, function() {
//     console.log("The GoodBrain Server Has Started!");
// });

// mkdir data
// echo 'mongod --bind_ip=$IP --dbpath=data --nojournal --rest "$@"' > mongod
// chmod a+x mongod
// ./mongod
