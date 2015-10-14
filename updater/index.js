(function (updater) {

  var socketIO = require("socket.io");

  updater.init = function (server) {

    var io = socketIO.listen(server);

    io.sockets.on("connection", function (socket) {
      console.log("socket was connected");
    });

  };

})(module.exports);
