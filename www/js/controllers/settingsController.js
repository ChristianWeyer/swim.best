swimBestApp.controller("SettingsController", function ($scope, $location, FavoritesService) {
    $scope.loginStatus = sb.messages.loggedOutMessage;

    $scope.signIn = function () {
        if(!FavoritesService.isLoggedIn) {
            FavoritesService.login("Google", function(isLoggedIn) {
                if (isLoggedIn)
                {
                    $scope.$apply($scope.loginStatus = sb.messages.loggedInMessage);
                }
            });
        } else {
            FavoritesService.logout();
            $scope.loginStatus = sb.messages.loggedOutMessage;
        }
    };

    /*$scope.deleteFavorites = function () {
        Lungo.Notification.confirm({
            icon: "warning",
            title: "Achtung",
            description: "Wirklich alle Favoriten löschen?",
            accept: {
                icon: "checkmark",
                label: "Ja",
                callback: function(){
                    FavoritesService.removeAllFavorites();
                }
            },
            cancel: {
                icon: "close",
                label: "Nein",
                callback: function(){ }
            }
        });
    };*/
});
