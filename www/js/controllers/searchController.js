swimBestApp.controller("SearchController", function ($scope, $location, SwimRecordsService) {
    $scope.searchName;
    $scope.firstName;
    $scope.lastName;

    $scope.$watch("searchName", function (newValue, oldValue) {
        if (newValue) {
            var blanks = newValue.split(" ").length - 1;
            var names = newValue.split(" ");
            
            if(blanks === 1) {
                $scope.firstName = names[0];
                $scope.lastName = names[1];
            } else if (blanks > 1) {
                $scope.firstName = names[0] + " " + names[1];
                $scope.lastName = names[2];
            } else {
                $scope.lastName = names[blanks];
            }
        }
    });

    $scope.search = function () {
        SwimRecordsService.searchSwimmer($scope.firstName, $scope.lastName)
          .success(function (data) {
              SwimRecordsService.searchResult = data;

                if(data.length === 0) {
                    Lungo.Notification.error(
                        "Sorry...",
                        "Keine Schwimmer gefunden",
                        "warning",
                        0
                    );
                } else if (data.length === 1) {
                  SwimRecordsService.current.Swimmer = data[0];
                  $location.path("/records");
              } else {
                  $location.path("/results");
              }
          });
    };
});
