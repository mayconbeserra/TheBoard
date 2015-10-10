(function (homeController) {

    var data = require("../dataService");

    homeController.init = function (app) {

        app.get("/", function (req, res) {
            data.getNoteCategories(function(err, results) {
                res.render("vash/index", {
                  title: "Express + Vash in controller",
                  error: err,
                  categories: results,
                  newCatError: req.flash("newCatNameValidation")
                });
            });
        });

        app.get("/notes/:categoryName", function (req, res) {
            var categoryName = req.params.categoryName;
            res.render('vash/notes', { title: categoryName });
        });

        app.post("/newCategory", function (req, res){
            var categoryName = req.body.categoryName;
            data.createNewCategory(categoryName, function(err) {
              if (err) {
                //handle error
                console.log(err);
                req.flash("newCatNameValidation", err);
                res.redirect("/");
              } else {
                res.redirect("/notes/" + categoryName);
              }
            });
        });
    };

})(module.exports);
