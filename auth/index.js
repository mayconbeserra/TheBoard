(function (auth) {

  var data = require("../dataService");
  var hasher = require("./hasher");

  auth.init = function (app) {

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
