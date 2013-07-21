var swimBestApp = angular.module("SwimBestApp", ["ngMobile", "ngStorage", "Centralway.lungo-angular-bridge"]);

swimBestApp.config(["$routeProvider", "$locationProvider", "$httpProvider", function($routeProvider, $locationProvider, $httpProvider) {
    $routeProvider
    	.when("/results", {templateUrl: "views/searchResults.html", controller: "ResultsController"})
    	.when("/records", { templateUrl: "views/records.html", controller: "RecordsController" })
    	.when("/favorites", { templateUrl: "views/favorites.html", controller: "FavoritesController" })
        .when("/settings", { templateUrl: "views/settings.html", controller: "SettingsController" })
        .when("/about", { templateUrl: "views/about.html" })
        .otherwise({redirectTo: "/"});

    $locationProvider.html5Mode(true);

    $httpProvider.defaults.useXDomain = true;
    delete $httpProvider.defaults.headers.common["X-Requested-With"];
      
    $httpProvider.responseInterceptors.push("loadingIndicatorInterceptor");
    var transformRequest = function (data) {
        var sp = document.getElementById("spinner");
        sp.style.height = document.height + "px";

        theSpinner.spin(sp);

        return data;
    };
    $httpProvider.defaults.transformRequest.push(transformRequest);
  }]);

swimBestApp.run(function($window, $rootScope, FavoritesService) {
    $window.addEventListener("offline", function() {
        $rootScope.$apply(function() {
            console.log("App is offline.");
            $rootScope.appOnline = false;
        });
    }, false);

    $window.addEventListener("online", function() {
        $rootScope.$apply(function() {
            console.log("App is online.");
            $rootScope.appOnline = true;
        });
    }, false);

    FavoritesService.serviceProxy = FavoritesService.serviceProxy.withFilter(function (request, next, callback) {
        var sp = document.getElementById("spinner");
        sp.style.height = document.height + "px";

        theSpinner.spin(sp);

        next(request, function(ignored, xhr) {
            theSpinner.stop();
            callback(ignored, xhr);
        });
    });
});

swimBestApp.factory("loadingIndicatorInterceptor", function ($q) {
    return function (promise) {
        return promise.then(
            function (response) {
                theSpinner.stop();

                return response;
            },
            function (response) {
                theSpinner.stop();

                return $q.reject(response);
            });
    };
});

var theSpinner = new Spinner({
    lines: 12,
    length: 20,
    width: 1,
    radius: 10,
    color: '#000',
    speed: 1,
    trail: 100,
    shadow: true,
    top: "auto",
    left: "auto",
    zIndex: 4000000000
});
