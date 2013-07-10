swimBestApp.factory("FavoritesService", ["$rootScope", function ($rootScope) {
    var wamsClient = {};
    wamsClient.serviceProxy = new WindowsAzure.MobileServiceClient("https://swimbest.azure-mobile.net/");
    wamsClient.favoritesTable = {};
    wamsClient.isLoggedIn = false;

    var localStore = new Lawnchair({ adapter: "dom", name: "swim.best.favorites" }, function () {});

    wamsClient.login = function (webIdentityProvider, callback) {
        if (!wamsClient.isLoggedIn) {
            wamsClient.serviceProxy.login(webIdentityProvider).then(function (user) {
                wamsClient.isLoggedIn = user != null;

                if(wamsClient.isLoggedIn) {
                    wamsClient.favoritesTable = wamsClient.serviceProxy.getTable("favorites");
                }

                callback(wamsClient.isLoggedIn);
            }, function (error) {
                alert("WAMS: " + error); //TODO: change this to a LungoJS Notification (or an event)
            });
        }
    };

    wamsClient.logout = function () {
        wamsClient.serviceProxy.logout();
        wamsClient.favoritesTable = {};
        window.cordova.exec(null, null, "InAppBrowser", "clearCookies", []);
        wamsClient.isLoggedIn = false;
    };

    wamsClient.addFavorite = function (item) {
        localStore.save({key: item.SwimmerID, value: item});

        if (wamsClient.isLoggedIn) {
            var newItem = angular.copy(item);
            wamsClient.favoritesTable.insert(newItem);
        }
    };

    wamsClient.getFavorites = function (callback) {
        if (wamsClient.isLoggedIn) {
            wamsClient.favoritesTable.read().then(function (items) {
                localStore.all(function (localData) {
                    var mergedUniqueFavorites = _.uniq(_.union(items, _.pluck(localData, 'value')), false, function(item, key){ return item.SwimmerID; });

                    //NOTE: currently we do not sync back local favorites to the cloud...!
                    $rootScope.$apply(callback(mergedUniqueFavorites));
                });
            });
        } else {
            localStore.all(function (localData) {
                var data = _.pluck(localData, 'value');
                callback(data);
            });
        }
    };

    wamsClient.removeFavorite = function (item) {
        localStore.remove(item.SwimmerID, "");

        if (wamsClient.isLoggedIn) {
            wamsClient.favoritesTable.del({
                id: item.id
            });
        }
    };

    return wamsClient;
}]);