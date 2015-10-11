(function(data) {

    var seedData = require("./seedData");
    var database = require("./database");

    data.getNoteCategories = function(next) {
        database.getDb(function (err, db){
          if (err) {
            next(err, null);
          } else {
            db.notes.find().sort({name: -1}).toArray(function (err, results){
              if (err) {
                next(err, null);
              } else {
                next(null, results);
              }
            });
          }
        });
    };

    data.getNotes = function (categoryName, next) {
      database.getDb(function (err, db) {
        if (err) {
          next(err);
        } else {
          db.notes.findOne({name: categoryName }, next);
        }
      });
    };

    data.addNote = function (categoryName, noteToInsert, next) {
      database.getDb(function (err, db) {
        if (err) {
          next(err);
        } else {
          db.notes.update({ name: categoryName }, { $push: { notes: noteToInsert } }, next);
        }
      });
    };

    data.createNewCategory = function (newCategoryName, next) {
        database.getDb(function (err, db){
          if (err){
            next(err, null);
          } else {

            db.notes.find({ name: newCategoryName}).count(function (err, count) {
              if (err) {
                next(err);
              } else {
                if (count != 0) {
                  next("Category already exists");
                } else {
                  var category = {
                    name: newCategoryName,
                    notes: []
                  };

                  db.notes.insert(category, function (err){
                    if (err) {
                      next(err);
                    } else {
                      next(null);
                    }
                  });
                }
              }
            });
          }
        });
    };

    data.addUser = function (user, next) {
      database.getDb(function (err, db) {
        if (err) {
          console.log("Failed to seed to database: " + err);
        } else {
          db.users.insert(user, next);
        }
      });
    };

    function seedDatabase() {
      database.getDb(function (err, db) {
        if (err){
          console.log("failed to seed database: " + err);
        } else {
          //test to see if data exists
          db.notes.count(function (err, count){
            if (err) {
              console.log("Failed to retrieve database count");
            } else {
              if (count == 0) {
                console.log("Seeding the database");
                seedData.initialNotes.forEach(function (item) {
                  db.notes.insert(item, function (err){
                    if (err)
                      console.log("Failed to insert note into database");
                  });
                });
              } else {
                console.log("Database already seeded")
              }
            }
          });
        }
      });
    }

    seedDatabase();

})(module.exports);
