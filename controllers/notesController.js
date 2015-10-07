(function (notesController) {
  var data = require('../dataService');

  notesController.init = function (app) {
    // GET
    app.get('/api/notes/:categoryName', function (req, res){
      var categoryName = req.params.categoryName;

      data.getNotes(categoryName, function (err, notes){
        if (err) {
          res.send(400, err);
        } else {
          res.set('Content-Type', 'application/json');
          res.send(notes);
        }
      });
    });

    //POST
    app.post('/api/notes/:categoryName', function (req, res) {
      var categoryName = req.params.categoryName;

      var noteToInsert = {
        note: req.body.note,
        color: req.body.color,
        author: "Maycon Beserra"
      };

      console.log(noteToInsert);

      data.addNote(categoryName, noteToInsert, function (err) {
        if (err) {
          res.status(400).send("Failed to add note to data store");
        } else {
          res.set("Content-Type", "application/json");
          res.status(201).send(noteToInsert);
        }
      });
    });
  };
})(module.exports);
