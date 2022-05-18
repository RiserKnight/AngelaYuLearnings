var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var morgan = require('morgan');
var path = require('path'); 
const ejs = require("ejs");
const {User}=require('./models');

// invoke an instance of express application.
var app = express();

// set our application port
app.set('port', 9000);

// set morgan to log info about our requests for development use.
app.use(morgan('dev'));

// initialize body-parser to parse incoming parameters requests to req.body
app.use(bodyParser.urlencoded({ extended: true }));

// initialize cookie-parser to allow us access the cookies stored in the browser. 
app.use(cookieParser());

// initialize express-session to allow us track the logged-in user across sessions.
app.use(session({
    key: 'user_sid',
    secret: 'somerandonstuffs',
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: 3600000
    }
}));
app.use(express.static(__dirname+"/public"));
app.set('view engine', 'ejs');

// This middleware will check if user's cookie is still saved in browser and user is not set, then automatically log the user out.
// This usually happens when you stop your express server after login, your cookie still remains saved in the browser.
app.use((req, res, next) => {
    if (req.cookies.user_sid && !req.session.user) {
        res.clearCookie('user_sid');        
    }
    next();
});

var userContent = {userName: '', loggedin: false, title: "You are not logged in today", body: "Hello World"}; 

// middleware function to check for logged-in users
var sessionChecker = (req, res, next) => {
    if (req.session.user && req.cookies.user_sid) {
		
        res.render("dashboard",{name: userContent.userName})
    } else {
        next();
    }    
};

// route for Home-Page
app.get('/', sessionChecker, (req, res) => {
    res.sendFile(__dirname+"/views/login.html");
});

// route for user signup
app.route('/signup')
    .get(sessionChecker, (req, res) => {
        res.sendFile(__dirname + '/views/signup.html');
    })
    .post((req, res) => {
        User.create({
            username: req.body.username,
            //email: req.body.email,
            password: req.body.password
        })
        .then(user => {
            req.session.user = user.dataValues;
            res.redirect('/dashboard');
        })
        .catch(error => {
            res.redirect('/signup');
        });
    });

    // route for user Login
app.route('/login')
.get(sessionChecker, (req, res) => {
    res.sendFile(__dirname + '/views/login.html');
})
.post((req, res) => {
    var username = req.body.username,
        password = req.body.password;

    User.findOne({ where: { username: username } }).then(function (user) {
        if (!user) {
            res.redirect('/login');
        } else if (!user.validPassword(password)) {
            res.redirect('/login');
        } else {
            req.session.user = user.dataValues;
            res.redirect('/dashboard');
        }
    });
});

// route for user's dashboard
app.get('/dashboard', (req, res) => {
    if (req.session.user && req.cookies.user_sid) {
		userContent.loggedin = true; 
		userContent.userName = req.session.user.username; 
		console.log(JSON.stringify(req.session.user)); 
		 
		userContent.title = "You are logged in"; 
        res.render("dashboard",{name: userContent.userName});
        
    } else {
        res.redirect('/login');
    }
});

// route for user logout
app.get('/logout', (req, res) => {
    if (req.session.user && req.cookies.user_sid) {
		userContent.loggedin = false; 
		userContent.title = "You are logged out!"; 
        res.clearCookie('user_sid');
		console.log(JSON.stringify(userContent)); 
        res.redirect('/');
    } else {
        res.redirect('/login');
    }
});

// route for handling 404 requests(unavailable routes)
app.use(function (req, res, next) {
    res.status(404).send("Sorry can't find that!")
  });
  
  
  // start the express server
  app.listen(app.get('port'), () => console.log(`App started on port ${app.get('port')}`));