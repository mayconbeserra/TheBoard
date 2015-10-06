(function (homeController) {

    var data = require("../dataService");

    homeController.init = function (app) {
        app.get("/", function (req, res) {
            data.getNoteCategories(function(err, results) {
                res.render("vash/index", { title: "Express + Vash in controller", error: err, categories: results });
            });            
        });
    };
})(module.exports);