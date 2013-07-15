swimBestApp.factory("FavoritesService", ["$rootScope", function ($rootScope) {
    var wamsClient = {};
    wamsClient.serviceProxy = new WindowsAzure.MobileServiceClient("https://swimbest.azure-mobile.net/");
    wamsClient.favoritesTable = null;

    var loggedIn = false;
    var localStore = new Lawnchair({ adapter: "dom", name: "swim.best.favorites" }, function () {});
    var tokenStore = new Lawnchair({ adapter: "dom", name: "swim.best.token" }, function () {});

    wamsClient.isLoggedIn = function () {
        wamsClient.checkUser();
        return loggedIn;
    };

    wamsClient.login = function (webIdentityProvider, callback) {
        if (!loggedIn) {
            wamsClient.serviceProxy.login(webIdentityProvider).then(function (user) {
                loggedIn = user !== null;

                if (loggedIn) {
                    tokenStore.save({key: "wamsUser", value: user});
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
        tokenStore.remove("wamsUser");
        window.cordova.exec(null, null, "InAppBrowser", "clearCookies", []);
    };

    wamsClient.checkUser = function () {
        if (!wamsClient.serviceProxy.currentUser) {
            loggedIn = false;

            tokenStore.get("wamsUser", function (data) {
                    if (data) {
                        wamsClient.serviceProxy.currentUser = data.value;

                        if (wamsClient.serviceProxy.currentUser) {
                            loggedIn = true;
                            wamsClient.favoritesTable = wamsClient.serviceProxy.getTable("favorites");
                        }
                    }
                }
            );
        }
    };

    wamsClient.addFavorite = function (item) {
        var newItem = angular.copy(item);
        localStore.save({key: newItem.SwimmerID, value: newItem});

        wamsClient.checkUser();
        if (loggedIn) {
            wamsClient.favoritesTable.insert(newItem);
        }
    };

    wamsClient.getFavorites = function (callback) {
        wamsClient.checkUser();
        if (loggedIn) {
            wamsClient.favoritesTable.read().then(function (items) {
                localStore.all(function (localData) {
                    var mergedUniqueFavorites = _.sortBy(_.uniq(_.union(items, _.pluck(localData, 'value')), false, function (item, key) {
                        return item.SwimmerID;
                    }), function(item){
                        return item.Lastname
                    });

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

        wamsClient.checkUser();
        if (loggedIn) {
            wamsClient.favoritesTable.del({
                id: item.id
            });
        }
    };

    return wamsClient;
}]);