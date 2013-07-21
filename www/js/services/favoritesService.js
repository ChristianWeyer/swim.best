swimBestApp.factory("FavoritesService", ["$rootScope", "$localStorage", function ($rootScope, $localStorage) {
    var wamsClient = {};
    wamsClient.serviceProxy = new WindowsAzure.MobileServiceClient("https://swimbest.azure-mobile.net/");
    wamsClient.favoritesTable = null;

    var loggedIn = false;
    var localFavorites = $localStorage.favorites || [];
    var localTokens = $localStorage.tokens || {};

    wamsClient.isLoggedIn = function () {
        wamsClient.checkUser();
        return loggedIn;
    };

    wamsClient.login = function (webIdentityProvider, callback) {
        if (!loggedIn) {
            wamsClient.serviceProxy.login(webIdentityProvider).then(function (user) {
                loggedIn = user !== null;

                if (loggedIn) {
                    localTokens.wamsUser = user;
                    wamsClient.favoritesTable = wamsClient.serviceProxy.getTable("favorites");
                }

                callback(loggedIn);
            }, function (error) {
                alert("WAMS: " + error); //TODO: change this to a LungoJS Notification (or an event)
            });
        }
    };

    wamsClient.logout = function () {
        wamsClient.serviceProxy.logout();
        wamsClient.favoritesTable = null;
        loggedIn = false;
        delete localTokens.wamsUser;
        window.cordova.exec(null, null, "InAppBrowser", "clearCookies", []);
    };

    wamsClient.checkUser = function () {
        if (!wamsClient.serviceProxy.currentUser) {
            loggedIn = false;
            var user = localTokens.wamsUser;

            if (user) {
                wamsClient.serviceProxy.currentUser = user;
                loggedIn = true;
                wamsClient.favoritesTable = wamsClient.serviceProxy.getTable("favorites");
            }
        }
    };

    wamsClient.addFavorite = function (item) {
        var newItem = angular.copy(item);
        localFavorites.push(newItem);
        wamsClient.checkUser();

        if (loggedIn) {
            wamsClient.favoritesTable.insert(newItem);
        }
    };

    wamsClient.getFavorites = function (callback) {
        wamsClient.checkUser();

        if (loggedIn) {
            wamsClient.favoritesTable.read().then(function (items) {
                var mergedUniqueFavorites = _.sortBy(_.uniq(_.union(items, localFavorites), false, function (item, key) {
                    return item.SwimmerID;
                }), function (item) {
                    return item.Lastname
                });

                // TODO: delete local favs and store mergedUniqueFavorites

                //NOTE: currently we do not sync back local favorites to the cloud...!
                $rootScope.$apply(callback(mergedUniqueFavorites));
            });
        } else {
            callback(localFavorites);
        }
    };

    wamsClient.removeFavorite = function (item) {
        localFavorites = _(localFavorites).reject(function(el) { return el.SwimmerID === item.SwimmerID; });
        wamsClient.checkUser();

        if (loggedIn) {
            wamsClient.favoritesTable.del({
                id: item.id
            });
        }
    };

    return wamsClient;
}]);