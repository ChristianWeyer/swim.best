swimBestApp.controller("ResultsController", function ($scope, $location, SwimRecordsService) {
    $scope.results = SwimRecordsService.searchResult;

    $scope.getRecords = function (swimmer) {
        SwimRecordsService.current.Swimmer = swimmer;
        $location.path("/records");
    };
});
