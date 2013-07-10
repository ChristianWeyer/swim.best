swimBestApp.factory("SwimRecordsService", function($http, $location) {
	var recordsService = {};
    recordsService.current = {};
    recordsService.current.Swimmer = {};
    recordsService.current.SwimmerRecords = {};
    recordsService.searchResult = {};

    recordsService.searchSwimmer = function(firstName, lastName) {
		return $http({
			method: "GET",
			url: "http://mobile.dsv.de/Json/GetSwimmers",
			params: { Firstname: firstName, Lastname: lastName }
	     });
	};

    recordsService.getRecords = function(swimmerId) {
		return $http({
			method: "GET",
			url: "http://mobile.dsv.de/Json/GetRecords",
			params: { SwimmerID: swimmerId }
		});
	};

    return recordsService;
});
