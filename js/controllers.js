var mapApp = angular.module('mapApp', []);

mapApp.controller('SearchCtrl', function($scope, $http, $window, $timeout) {
    // init function for body.
    $scope.init = function() {
        initializeMap();

        // makes sure that the height is always equal to the height for the device.
        $('body').css({"height":document.documentElnament.clientHeight});
    };

    // constants for bus icons
    // var graduateApartmentsShoppingShuttleImage = "img/buses/Graduate Apartments Shopping Shuttle.png";
    // var graduateApartmentsImage = "img/buses/Graduate Apartments.png";
    // var greaterLoopImage = "img/buses/Greater Loop.png";
    // var innerLoopImage = "img/buses/Inner Loop.png";
    // var nightEscortServiceImage = "img/buses/Night Escort Service.png";
    // var riceVillageImage = "img/buses/Rice Village.png";
    // var riceVillageApartmentsImage = "img/buses/Rice Village Apartments.png";
    // var undergraduateShoppingShuttleImage = "img/buses/Undergraduate Shopping Shuttle.png";

    // array for bus markers
    // var busMarkers = [];

    // elements on the map. Initialized using campus_data.json.
    var mapElements;

    // declare Fuse searcher
    var searcher;

    // declare the google map.
    var map;

    // the center of the map.
    var mapCenter = new google.maps.LatLng(29.752658, -95.360209);

    // init the lat/lng dictionary. Maps a latLng to various things.
    var latLngDict = {};

    // boolean for whether the visitor lots are being shown.
    $scope.visitorLotsShown = false;

    //init search results.
    $scope.searchResults = [];

    // init the open status for the search results.
    $scope.open = true;

    // init the list for bus data.
    // $scope.buses = [];

    // function that clears input from input box and selects the input.
    $scope.clearInput = function() {
        $scope.searchText = "";
        $timeout(function() {
            $('#searchBox').focus();
        });
    }

    // function that gets called on all clicks to hide/show search results.
    $scope.hideSearchResults = function(clickedElement) {
        if (clickedElement.target.id !== 'searchBox') {
            $scope.open = false;
        }
        else if ($scope.searchText !== undefined && $scope.searchText.length > 0) {
            $scope.open = true;
        }
    }

    // function that gets called when the "Visitor Lots" button is pressed. Zooms out and shows available visitor lots.
    // $scope.toggleVisitorLots = function() {
    //     if ($scope.visitorLotsShown) {
    //         removeAllMarkers();
    //     }
    //     else {
    //         removeAllMarkers();

    //         for (var i = 0; i < mapElements.length; i++) {
    //             var mapElement = mapElements[i];
    //             if (mapElement.type === "lot" && mapElement.visitor_parking > 0) {
    //                 // case for class 1 (normal visitor parking lots).
    //                 if (mapElement.visitor_parking === 1) {
    //                     placeMarker(mapElement)
    //                 }
    //                 // case for class 2 (time-restricted visitor parking lots).
    //                 else if (mapElement.visitor_parking === 2) {
    //                     var currentDate = new Date();
    //                     // logic for time-restricted visitor parking lots.
    //                     if ((currentDate.getDay() === 0 || currentDate.getDay() === 6) || 
    //                         (currentDate.getHours() > 17 || currentDate.getHours() < 8)) {
    //                         placeMarker(mapElement);
    //                     }
    //                 }
    //             }
    //         }

    //         // center the camera and zoom out.
    //         map.panTo(mapCenter);
    //         map.setZoom(15);

    //         $scope.visitorLotsShown = true;
    //     }
    // };

    // function that gets called when the My Location button is clicked, and show the user's locaiton on the map and pans to your location.
    // $scope.showFood = function(){
    //     var newMapElems = [];
    //     var new_center = 0;
    //     for (var i=0, size = mapElements.length; i < size; i++ ){
    //         var mapElem = mapElements[i];
    //         if (mapElem.type === 'food'){

    //             placeMarker(mapElem);
    //         } 

    //     }
    

    // }

    $scope.showAll = function(){
        
        var newMapElems = [];
        var bounds = new google.maps.LatLngBounds();
        for (var i=0, size = mapElements.length; i < size; i++ ){
            var mapElem = mapElements[i];
            var latLng = new google.maps.LatLng(mapElem.location.latitude, mapElem.location.longitude);
            bounds.extend(latLng);
            placeMarker(mapElem);
           
            } 
        closeAllInfoWindows();
        map.fitBounds(bounds);
    }

    $scope.showFood = function(){
        removeAllMarkers()
        var newMapElems = [];
        var new_center = 0;
        var bounds= new google.maps.LatLngBounds();
        for (var i=0, size = mapElements.length; i < size; i++ ){
            var mapElem = mapElements[i];
            if (mapElem.type === 'food'){
                var latLng = new google.maps.LatLng(mapElem.location.latitude, mapElem.location.longitude);
                bounds.extend(latLng);
                placeMarker(mapElem);
            } 

        }
        map.fitBounds(bounds);

    }

    $scope.showHousing = function(){
        removeAllMarkers()
        var newMapElems = [];
        var new_center = 0;
        var bounds= new google.maps.LatLngBounds();
        for (var i=0, size = mapElements.length; i < size; i++ ){
            var mapElem = mapElements[i];
            if (mapElem.type === 'housing'){
                var latLng = new google.maps.LatLng(mapElem.location.latitude, mapElem.location.longitude);
                bounds.extend(latLng);
                placeMarker(mapElem);
            } 

        }
        map.fitBounds(bounds);

    }
    $scope.showShelters = function(){
        removeAllMarkers()
        var newMapElems = [];
        var new_center = 0;
        var bounds= new google.maps.LatLngBounds();
        for (var i=0, size = mapElements.length; i < size; i++ ){
            var mapElem = mapElements[i];
            if (mapElem.type === 'shelter'){
                var latLng = new google.maps.LatLng(mapElem.location.latitude, mapElem.location.longitude);
                bounds.extend(latLng);
                placeMarker(mapElem);
            } 

        }
        map.fitBounds(bounds);

    }

    $scope.showMedical = function(){
        removeAllMarkers()
        var newMapElems = [];
        var new_center = 0;
        var bounds= new google.maps.LatLngBounds();
        for (var i=0, size = mapElements.length; i < size; i++ ){
            var mapElem = mapElements[i];
            if (mapElem.type === 'medical'){
                var latLng = new google.maps.LatLng(mapElem.location.latitude, mapElem.location.longitude);
                bounds.extend(latLng);
                placeMarker(mapElem);
            } 

        }
        map.fitBounds(bounds);

    }

    $scope.showJobs = function(){
        removeAllMarkers()
        var newMapElems = [];
        var new_center = 0;
        var bounds= new google.maps.LatLngBounds();
        for (var i=0, size = mapElements.length; i < size; i++ ){
            var mapElem = mapElements[i];
            if (mapElem.type === 'income'){
                var latLng = new google.maps.LatLng(mapElem.location.latitude, mapElem.location.longitude);
                bounds.extend(latLng);
                placeMarker(mapElem);
            } 

        }
        map.fitBounds(bounds);

    }

    $scope.showW = function(){
        removeAllMarkers()
        var newMapElems = [];
        var new_center = 0;
        var bounds= new google.maps.LatLngBounds();
        for (var i=0, size = mapElements.length; i < size; i++ ){
            var mapElem = mapElements[i];
            if (mapElem.type === 'womens'){
                var latLng = new google.maps.LatLng(mapElem.location.latitude, mapElem.location.longitude);
                bounds.extend(latLng);
                placeMarker(mapElem);
            } 

        }
        map.fitBounds(bounds);

    }

    $scope.showVet = function(){
        removeAllMarkers()
        var newMapElems = [];
        var new_center = 0;
        var bounds= new google.maps.LatLngBounds();
        for (var i=0, size = mapElements.length; i < size; i++ ){
            var mapElem = mapElements[i];
            if (mapElem.type === 'veteran services'){
                var latLng = new google.maps.LatLng(mapElem.location.latitude, mapElem.location.longitude);
                bounds.extend(latLng);
                placeMarker(mapElem);
            } 

        }
        map.fitBounds(bounds);

    }

    $scope.showT = function(){
        removeAllMarkers()
        var newMapElems = [];
        var new_center = 0;
        var bounds= new google.maps.LatLngBounds();
        for (var i=0, size = mapElements.length; i < size; i++ ){
            var mapElem = mapElements[i];
            if (mapElem.type === 'transportation'){
                var latLng = new google.maps.LatLng(mapElem.location.latitude, mapElem.location.longitude);
                bounds.extend(latLng);
                placeMarker(mapElem);
            } 

        }
        map.fitBounds(bounds);

    }

    $scope.showTech = function(){
        removeAllMarkers()
        var newMapElems = [];
        var new_center = 0;
        var bounds= new google.maps.LatLngBounds();
        for (var i=0, size = mapElements.length; i < size; i++ ){
            var mapElem = mapElements[i];
            if (mapElem.type === 'tech'){
                var latLng = new google.maps.LatLng(mapElem.location.latitude, mapElem.location.longitude);
                bounds.extend(latLng);
                placeMarker(mapElem);
            } 

        }
        map.fitBounds(bounds);

    }

    $scope.showMyLocation = function() {
        //Makes the marker to show where you are.
        var myLocMarker = new google.maps.Marker({
            clickable: false,
            icon: new google.maps.MarkerImage('//maps.gstatic.com/mapfiles/mobile/mobileimgs2.png',
                                                    new google.maps.Size(22,22),
                                                    new google.maps.Point(0,18),
                                                    new google.maps.Point(11,11)),
            shadow: null,
            zIndex: 999,
            map: map
        });
        //sets the marker at your location and pans the screen to it.
        if (navigator.geolocation) navigator.geolocation.getCurrentPosition(function(pos) {
            var myLoc = new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude);
            myLocMarker.setPosition(myLoc);
            map.panTo(myLoc);
        }, function(error) {
            // ...
        });
    }

    // event where a building was selected by a keypress..
    $scope.buildingSelectedByKeyPress = function(keyPressed) {
        if (keyPressed.keyCode == 13 && $scope.searchResults.length > 0) {
            // focus on the building.
            var building = $scope.searchResults[0];
            $scope.focusBuilding(building);

            // hide the search results. we have to emulate a clicked element here.
            $scope.hideSearchResults({target: {id: 'fakeElement'}});
            $timeout(function() {
                $('#searchBox').blur();
            });
        }
    }

    // function for focusing on a building.
    $scope.focusBuilding = function(building) {
        // hide keyboard so that the user will have a centered pin.
        $('searchBox').blur();

        // first remove all markers.
        removeAllMarkers();

        $scope.searchText = "";

        // map.setZoom(5);
        var latLng = new google.maps.LatLng(building.location.latitude, building.location.longitude);
        map.panTo(latLng);

        placeMarker(building)
    };

    // places a marker on the map for a map element.
    function placeMarker(mapElement) {
        // check whether we've made the maker yet. If not, make it.
        var latLng = new google.maps.LatLng(mapElement.location.latitude, mapElement.location.longitude);
        if (!(latLng in latLngDict)) {
            var marker = new google.maps.Marker({
                position: latLng,
                map: map,
                title: mapElement.name
            });
            if (mapElement.hours !== undefined && mapElement.bus !== undefined){
                var contentString = '<div id="content">'+
                '<b>' + mapElement.name + '</b></br>' + 
                mapElement.street_address + '</br>' +
                mapElement.phone + 
                mapElement.website + '</br>' + 
                '<b>Hours: </b>' + mapElement.hours + '</br>' + 
                mapElement.bus + 
                '</div>';
            }
            else {
                var contentString = '<div id="content">'+
                '<b>' + mapElement.name + '</b></br>' + 
                mapElement.street_address + '</br>' +
                mapElement.phone +
                mapElement.website + 
                '</div>';
            }
            
            var infoWindow = new google.maps.InfoWindow({
                content: contentString
            });

            // add entry to latLngDict.
            latLngDict[latLng] = {"marker":marker, "infoWindow":infoWindow};
            google.maps.event.addListener(marker, 'click', function(target){
                var dictEntry = latLngDict[target.latLng];
                dictEntry.infoWindow.open(map, dictEntry.marker);
            }); 
        }
        var dictEntry = latLngDict[latLng];
        dictEntry.infoWindow.open(map, dictEntry.marker);
    };

    // removes a marker on the map for a map element.
    var removeMarker = function(mapElement) {
        // check whether we've made the maker yet. If it exists, remove it.
        var latLng = new google.maps.LatLng(mapElement.location.latitude, mapElement.location.longitude);
        if (latLng in latLngDict) {
            // delete marker and entry in latLngDict.
            latLngDict[latLng].marker.setMap(null);
            delete latLngDict[latLng];
        }
    }

    // load in the campus data json via a HTTP GET request.
    $http.get('data/campus_data.json').then(function(result) {
        // set the fuse searcher.
        var options = {
          keys: ['name', 'abbreviation']
        }

        searcher = new Fuse(result.data, options);

        mapElements = result.data;

        
    });
    $scope.$watch('searchText', function(newValue, oldValue) {
        if (searcher !== undefined) {
            // get search results for what someone types in.
            $scope.searchResults = searcher.search(newValue);

            // check to see if new value is an empty string
            if (newValue === "") {
                $scope.open = false;
            } else {
                $scope.open = true;
            }
        }
    });
    
    // Function to update buses and pull's data every 5 seconds.
    // (function tick() {
    //     $http.get('http://rice-buses.herokuapp.com').success(function (data) {
    //         $scope.buses = data.d;

    //         // redraw the buses
    //         redrawBuses();

    //         $timeout(tick, 5000);
    //     });
    // })();

    /**
     * Redraws buses on map.
     */
    // function redrawBuses() {
    //     // delete all the bus markers.
    //     for (var i = 0; i < busMarkers.length; i++) {
    //         busMarkers[i].setMap(null);
    //     }
    //     busMarkers = [];

    //     // create all the bus markers.
    //     for (var i = 0; i < $scope.buses.length; i++) {
    //         var bus = $scope.buses[i];

    //         // get the marker attributes.
    //         var type = bus.Name;
    //         var busLatLng = new google.maps.LatLng(bus.Latitude, bus.Longitude);
    //         var image = "";


    //         // get the right icon for the bus.
    //         switch(type) {
    //             case "Graduate Apartments":
    //                 image = graduateApartmentsImage;
    //                 break;
    //             case "Graduate Apartments Shopping Shuttle":
    //                 image = graduateApartmentsShoppingShuttleImage;
    //                 break;
    //             case "Greater Loop":
    //                 image = greaterLoopImage;
    //                 break;
    //             case "Inner Loop":
    //                 image = innerLoopImage;
    //                 break;
    //             case "Night Escort Service":
    //                 image = nightEscortServiceImage;
    //                 break;
    //             case "Rice Village":
    //                 image = riceVillageImage;
    //                 break;
    //             case "Rice Village Apartments":
    //                 image = riceVillageApartmentsImage;
    //                 break;
    //             case "Undergraduate Shopping Shuttle":
    //                 image = undergraduateShoppingShuttleImage;
    //                 break;
    //             default:
    //                 image = innerLoopImage;
    //         }

    //         // create the marker and add it to the list of bus markers.
    //         var busMarker = new google.maps.Marker({
    //             position: busLatLng,
    //             map: map,
    //             icon: image
    //         });

    //         busMarkers.push(busMarker);
    //     }
    // }

    /**
     * Add code for initializing the map.
     */
    function initializeMap() {
        var mapOptions = {
          zoom: 14,
          center: mapCenter,
          mapTypeId: google.maps.MapTypeId.ROADMAP,
          disableDefaultUI: false,
          panControl: false,
          zoomControl: true,
          zoomControlOptions: {
                style: google.maps.ZoomControlStyle.LARGE,
                position: google.maps.ControlPosition.LEFT_CENTER
          },
          minZoom: 4,
          maxZoom: 25
        };
        map = new google.maps.Map(document.getElementById('map-canvas'),
            mapOptions);
        for (var element in mapElements){
            placeMarker(element);
            }
        for (var latLng in latLngDict){
            var marker = new google.maps.Marker()({position:latLng});
            marker.setMap(map);
        
        }
    }

    /**
     * Closes all info windows on the map.
     */
    function closeAllInfoWindows() {
        for (var latLng in latLngDict) {
            latLngDict[latLng].infoWindow.close();
        }
    }

    /**
     * Removes all markers from the map.
     */
    function removeAllMarkers() {
        $scope.visitorLotsShown = false;

        for (var latLng in latLngDict) {
            latLngDict[latLng].marker.setMap(null);
            delete latLngDict[latLng];
        }
    }
 

});