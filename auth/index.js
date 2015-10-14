(function (auth) {

  var data = require("../dataService");
  var hasher = require("./hasher");

  var passport = require("passport");
  var localStrategy = require("passport-local").Strategy;

  function VerifyUser(username, password, next) {

    data.getUser(username, function (err, user) {

      if (!err && user){
        var testHash = hasher.computeHash(password, user.salt);
        if (testHash === user.passwordHash) {
          next(null, user);
          return;
        }
      }
      next(null, false, { message: "Invalid credentials." });
    });
  }

  auth.ensureAuthenticated = function (req, res, next) {

    if (req.isAuthenticated()) {
      next();
    } else {
      res.redirect("/login");
    }

  };

  auth.ensureApiAuthenticated = function (req, res, next) {
    if (req.isAuthenticated()) {
      next();
    } else {
      res.status(401).send("Not authorized");
    }
  };

  auth.init = function (app) {

    app.use(passport.initialize());
    app.use(passport.session());

    passport.use(new localStrategy(VerifyUser));
    passport.serializeUser(function (user, next) {
      if (user)
        next(null, user.username);
    });

    passport.deserializeUser(function (key, next) {
      data.getUser(key, function (err, user){
        if (err) {
          next(null, false, { message: "Failed to retrieve the user" });
        } else {
          next(null, user);
        }
      });
    });

    app.get("/login", function (req, res) {
      res.render("vash/login", { title: "Login to the board", message: req.flash("loginError")});
    });

    app.post("/login", function (req, res, next) {
      var authFunction = passport.authenticate("local", function (err, user, info) {
        if (err){
          next(err);
        } else {
          req.login(user, function (err) {
            if (err) {
              next(err);
            } else {
              res.redirect("/");
            }
          });
        }
      });
      authFunction(req, res, next);
    });

    app.get("/register", function (req, res) {
      res.render("vash/register", { title: "Register for the board", message: req.flash("registrationError") });
    });

    app.post("/register", function (req, res) {

      var salt = hasher.createSalt();

      var user = {
        name: req.body.name,
        email: req.body.email,
        username: req.body.username,
        passwordHash: hasher.computeHash(req.body.password, salt),
        salt: salt
      };

      data.addUser (user, function (err) {
        if (err) {
          req.flash("registrationError", "Could not save user to database");
          req.redirect("/register");
        } else {
          res.redirect("/login");
        }
      });

    });

  };

})(module.exports);
