swimBestApp.controller("RecordsController", function ($scope, SwimRecordsService, FavoritesService) {
    var records25m, records50m, recordsCombined;

    $scope.swimmerName;
    $scope.currentBanner;
    $scope.events = sb.data.events;
    $scope.currentRecords = [];

    SwimRecordsService.getRecords(SwimRecordsService.current.Swimmer.SwimmerID)
		.success(function (data) {
		    SwimRecordsService.current.SwimmerRecords = data;
		    $scope.swimmerName = SwimRecordsService.current.Swimmer.Firstname + " " + SwimRecordsService.current.Swimmer.Lastname;

		    populateRecords();
		});

    function populateRecords() {
        records25m = SwimRecordsService.current.SwimmerRecords[0].Times;
        records50m = SwimRecordsService.current.SwimmerRecords[1].Times;
        recordsCombined = [];
        var i = 0;

        records25m.forEach(function (record25m) {
            if (((record25m < records50m[i]) && record25m !== '') || records50m[i] === '') {
                recordsCombined.push(record25m);
            }
            else {
                recordsCombined.push(records50m[i]);
            }
            i++;
        });

        $scope.currentRecords = records25m;
        $scope.activeRecords = sb.data.states[0];
    };

    $scope.needDisplayBanner = function (index) {
        if (sb.data.styles[index]) {
            $scope.currentBanner = sb.data.styles[index];
            return true;
        }

        return false;
    };

    $scope.show25 = function () {
        $scope.currentRecords = records25m;
        $scope.activeRecords = sb.data.states[0];
    };

    $scope.show50 = function () {
        $scope.currentRecords = records50m;
        $scope.activeRecords = sb.data.states[1];
    };

    $scope.showCombined = function () {
        $scope.currentRecords = recordsCombined;
        $scope.activeRecords = sb.data.states[2];
    };

    $scope.addFavorite = function () {
        FavoritesService.addFavorite(SwimRecordsService.current.Swimmer);
        Lungo.Notification.success(
            "Favorit hinzugefügt",
            "",
            "check",
            1
        );
    };
});
