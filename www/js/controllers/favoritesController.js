swimBestApp.controller("FavoritesController", function ($scope, $location, SwimRecordsService, FavoritesService) {
    var currentItem;

    FavoritesService.getFavorites(function (data) {
        $scope.results = data;
    });

    $scope.getRecords = function (item) {
        SwimRecordsService.current.Swimmer = item;
        $location.path("/records");
    };

    $scope.swipe = function(item) {
        if(currentItem === item) {
            currentItem = null;
        } else {
            currentItem = item;
        }
    }

    $scope.showDelete = function(item) {
        if(currentItem === item) {
            return true;
        }

        return false;
    }

    $scope.deleteFavorite = function(item) {
        FavoritesService.removeFavorite(item);
        var index = $scope.results.indexOf(item);
        $scope.results.splice(index,1);
    }
});
