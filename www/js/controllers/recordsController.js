swimBestApp.controller("RecordsController", function ($scope, SwimRecordsService, FavoritesService) {
    var events = []; events[0] = "25F"; events[1] = "50F"; events[2] = "100F"; events[3] = "200F"; events[4] = "400F"; events[5] = "800F"; events[6] = "1500F"; events[7] = "25B"; events[8] = "50B"; events[9] = "100B"; events[10] = "200B"; events[11] = "25R"; events[12] = "50R"; events[13] = "100R"; events[14] = "200R"; events[15] = "25S"; events[16] = "50S"; events[17] = "100S"; events[18] = "200S"; events[19] = "100L"; events[20] = "200L"; events[21] = "400L";
    var styles = []; styles[0] = "Freistil"; styles[7] = "Brust"; styles[11] = "Rücken"; styles[15] = "Schmetterling"; styles[19] = "Lagen";
    var states = []; states[0] = "25"; states[1] = "50"; states[2] = "Gesamt";
    var records25m, records50m, recordsCombined;

    $scope.swimmerName;
    $scope.currentBanner;
    $scope.events = events;
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
        $scope.activeRecords = states[0];
    };

    $scope.needDisplayBanner = function (index) {
        if (styles[index]) {
            $scope.currentBanner = styles[index];
            return true;
        }

        return false;
    };

    $scope.show25 = function () {
        $scope.currentRecords = records25m;
        $scope.activeRecords = states[0];
    };

    $scope.show50 = function () {
        $scope.currentRecords = records50m;
        $scope.activeRecords = states[1];
    };

    $scope.showCombined = function () {
        $scope.currentRecords = recordsCombined;
        $scope.activeRecords = states[2];
    };

    $scope.addFavorite = function () {
        FavoritesService.addFavorite(SwimRecordsService.current.Swimmer);
    };
});
