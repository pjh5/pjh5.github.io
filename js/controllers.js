var mapApp = angular.module('mapApp', []);
var directionsService;
var directionsDisplay;
var stepDisplay;
mapApp.controller('SearchCtrl', function($scope, $http, $window, $timeout) {
    // init function for body.
    directionsService = new google.maps.DirectionsService();

    $scope.init = function(){
        initializeMap();
        // makes sure that the height is always equal to the height for the device.
        $('body').css({"height":document.documentElement.clientHeight});
    };

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

    //init search results.
    $scope.searchResults = [];

    // init the open status for the search results.
    $scope.open = true;

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




    $scope.showAll = function(){
        
        var newMapElems = [];
        var bounds = new google.maps.LatLngBounds();
        for (var i=0, size = mapElements.length; i < size; i++ ){
            var mapElem = mapElements[i];
            var latLng = new google.maps.LatLng(mapElem.location.latitude, mapElem.location.longitude);
            bounds.extend(latLng);
            placeMarker(mapElem);
           
            } 
        map.fitBounds(bounds);
    }

    // Food
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
        zoomOutMap(1);

    }

    // Housing
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
        zoomOutMap(1);

    }

    // Emergency Shelters
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
        zoomOutMap(1);

    }

    // Medical Resources
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
        zoomOutMap(1);

    }

    // Job Training
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
        zoomOutMap(1);

    }

    // Women's Resources
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

    // Veterans Resources
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
        zoomOutMap(1);

    }

    // Transportation
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
        zoomOutMap(4);

    }

    // Public library
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
        zoomOutMap(4);

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
    $scope.resourceSelectedByKeyPress = function(keyPressed) {
        if (keyPressed.keyCode == 13 && $scope.searchResults.length > 0) {
            // focus on the resource.
            var resource = $scope.searchResults[0];
            $scope.focusResource(resource);

            // hide the search results. we have to emulate a clicked element here.
            $scope.hideSearchResults({target: {id: 'fakeElement'}});
            $timeout(function() {
                $('#searchBox').blur();
            });
        }
    }

    // function for focusing on a resource.
    $scope.focusResource = function(resource) {
        // hide keyboard so that the user will have a centered pin.
        $('searchBox').blur();

        // first remove all markers.
        removeAllMarkers();
		
		// clear search bar
        $scope.searchText = "";

        // map.setZoom(5);
        var latLng = new google.maps.LatLng(resource.location.latitude, resource.location.longitude);
        map.panTo(latLng);

        placeMarker(resource)
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

            var contentString = '<div id="content">'+
            '<b>' + mapElement.name + '</b></br>' + 
            mapElement.street_address + '</br>' +
            mapElement.phone + 
            mapElement.website + '</br>' + 
            mapElement.hours +
            mapElement.bus + 
			'<button class="btn btn-default" style="position:relative; left:50%">' +
			'Glue to Map</button>' +
            '</div>'; // Added content to info thing
            
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
          mapTypeControl: false,
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

    /**
     * Zooms out the map once
      */
    function zoomOutMap(zoomLevel) {
        var listener = google.maps.event.addListenerOnce(map, 'idle', function(){
            map.setZoom(map.getZoom() - zoomLevel);
        });
    }
 

});