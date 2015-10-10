(function (angular) {

  var theModule = angular.module("notesView", []);

  theModule.controller("notesViewController",
    ["$scope", "$window", "$http"
      function ($scope) {
        console.log('test');
        $scope.notes = [];

        //get the categoryName ab
        var urlParts = $window.location.pathname.split('/');
        var categoryName = urlParts[urlParts.length - 1];

        var notesUrl = "/api/notes/" + categoryName;
        $http.get(notesUrl)
          .then(function (data) {
            //sucess
            $scope.notes = result.data;
          }, function (err) {
            //error
            alert(err);
          });
      }
    ]);

})(window.angular);
