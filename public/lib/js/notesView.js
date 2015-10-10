(function (angular) {

  var theModule = angular.module("notesView", ["ui.bootstrap"]);

  theModule.controller("notesViewController",
    ["$scope", "$window", "$http",
      function ($scope, $window, $http) {

        $scope.notes = [];
        $scope.newNote = {
          note: "",
          color: "yellow"
        };

        //get the categoryName ab
        var urlParts = $window.location.pathname.split("/");
        var categoryName = urlParts[urlParts.length - 1];
        console.log("test");
        var notesUrl = "/api/notes/" + categoryName;
        $http.get(notesUrl)
          .then(function (result) {
            //sucess
            $scope.notes = result.data.notes;
          }, function (err) {
            //error
            alert(err);
          });
      }
    ]);

})(window.angular);
