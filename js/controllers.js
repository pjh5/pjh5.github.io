function SearchCtrl($scope, $http, $window, $timeout, MapFactory) {
    // init function for body.
    $scope.init = function(){
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
	var gluedMarkers = {};

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


	// Called when a resource type in the Resources dropdown is clicked
	$scope.showResources = function(resourceType){
		closeAllWindows();
		var newMapElems = [];
		var newCenter = 0;
		var bounds = new google.maps.LatLngBounds();
		for (var i=0; i < mapElements.length; i++){
			var mapElem = mapElements[i];
			if (~mapElem.type.indexOf(resourceType)){
				var latLng = new google.maps.LatLng(mapElem.location.latitude, mapElem.location.longitude);
				bounds.extend(latLng);
				latLngDict[latLng].infoWindow.open(map, latLngDict[latLng].marker);
			}
		}
		map.fitBounds(bounds);
		zoomOutMap(resourceType);
	}
	
	
    $scope.showAll = function(){
		closeAllWindows();
        var newMapElems = [];
        var bounds = new google.maps.LatLngBounds();
        for (var i=0, size = mapElements.length; i < size; i++ ){
            var mapElem = mapElements[i];
            var latLng = new google.maps.LatLng(mapElem.location.latitude, mapElem.location.longitude);
            bounds.extend(latLng);
            } 
        map.fitBounds(bounds);
    }
	
	
    /**
     * Zooms out the map after a filter function
      */
    function zoomOutMap(resource) {
		
		// Sets zoom level depending on resource type
		var zoomLevel = 1;
		if ((typeof resource !== 'undefined') && (resource === 'Library' || resource === 'Transportation')){
			zoomLevel = 5;
		}
			
        var listener = google.maps.event.addListenerOnce(map, 'idle', function(){
            map.setZoom(map.getZoom() - zoomLevel);
        });
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
		
		// clear search bar
        $scope.searchText = "";

        map.setZoom(5);
        var latLng = new google.maps.LatLng(resource.location.latitude, resource.location.longitude),
			mapElem = latLngDict[latLng];
        map.panTo(latLng);

        closeAllWindows();
		mapElem.infoWindow.open(map, mapElem.marker);
    };

    // load in the campus data json via a HTTP GET request.
    $http.get('data/campus_data.json').then(function(result) {
        // set the fuse searcher.
		console.log("Calling http.get()");
        var options = {
          keys: ['name', 'type'],
		  threshold: 0.4
        }

        searcher = new Fuse(result.data, options);

        mapElements = result.data;
		
		MapFactory.init(mapElements, $scope);

        
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
		console.log("initializeMap()");
        
			
		// console.log(mapElements);
		// for (var mapElem in mapElements){
			// var latLng = new google.maps.LatLng(mapElem.Location.latitude, mapElem.Location.longitude),
				// marker = new google.maps.Marker({
								// position: latLng,
								// map: Map,
								// title: resource.name});
			// latLngDict[latLng] = {'marker': marker};
		// }
    }


    /**
     * Closes all info windows on the map
     */
    function closeAllWindows() {
        for (var latLng in latLngDict) {
            latLngDict[latLng].infoWindow.close();
        }
    }
	
	
	$scope.glueToMap = function(){
		console.log("Called glueToMap function!!");
	}
	
	$scope.unglue = function(){
		console.log("Called unglue function!!");
	}


 

});