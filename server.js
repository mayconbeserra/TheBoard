var http          = require('http');
var express       = require('express');
var app           = express();
var controllers   = require('./controllers');
var handleBars    = require('express-handlebars');
var bodyParser    = require('body-parser');
var flash         = require('connect-flash');
var cookieParser  = require('cookie-parser');
var session       = require('express-session');
var auth          = require('./auth');

//var ejsEngine = require("ejs-locals");

//Setup the view engine
//app.set("view engine", "jade");
//app.engine("ejs", ejsEngine);  //support the master pages
//app.set("view engine", "ejs"); //ejs view engine

app.set("view engine", "vash");

//opt into services
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(session({
  secret: 'myNodeJSCourse',
  resave: true,
  saveUninitialized: true,
  cookie: { secure: false }
}));
app.use(flash());

//set the public static resource folder
app.use(express.static(__dirname + '/public'));

//use authentication
auth.init(app);

//Map routes
controllers.init(app);

app.get("/api/users", function (req, res) {
    res.set("NewHeader", "blabla");
    res.send({ name: "Maycon", isActive: true });
});

var server = http.createServer(app);

server.listen(3000);
