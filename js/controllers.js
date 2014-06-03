var mapApp = angular.module('mapApp', []);
var directionsService;
var directionsDisplay;
var stepDisplay;
mapApp.controller('SearchCtrl', function($scope, $http, $window, $timeout, $compile) {
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
        var options = {
          keys: ['name', 'type'],
		  threshold: 0.4
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
		console.log("initializeMap()");
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
        map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
			
		console.log(mapElements);
		for (var mapElem in mapElements){
			var latLng = new google.maps.LatLng(mapElem.Location.latitude, mapElem.Location.longitude),
				marker = new google.maps.Marker({
								position: latLng,
								map: Map,
								title: resource.name});
			latLngDict[latLng] = {'marker': marker};
		}
			
		var listener = google.maps.event.addListenerOnce(map, 'idle', function(){
            $scope.showAll();
        });
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


mapApp.factory('Map', function($rootScope , $compile){
		return {
			init:function( mapElements , scope) {
				console.log("Calling factory init");
				var Map = $rootScope.map
				scope.markers = [];
				
				for(var count = mapElements.length, i = 0; i < count; i++) {
					var resource = mapElements[i],
						latlng = resource.location;
						marker = new google.maps.Marker({
								position: new google.maps.LatLng(latlng[0], latlng[1]),
								map: Map,
								title: resource.name}),
						infoWindow = new google.maps.InfoWindow();
				
					scope.markers[i] = {};
					scope.markers[i].location = [ latlng[0], latlng[1] ];
					
					latLngDict[latlng] = {'marker': marker, 'infoWindow': infoWindow};
					
					var content = '<div id="' + resource.name.replace(/\s+/g, '') + '">' +
									'ng-include src="\'infoWindow.html\'">' + 
									'</div>'// Added content to info thing
					var compiledContent = $compile(content)(scope);
					
					(google.maps.event.addListener(marker, 'click', function(marker, scope, compiledContent, localLatLng){
						return function(){
							scope.mapElement = latLngDict(localLatLng);
							scope.$apply();
							infoWindow.setContent(compiled[0]);
							infoWindow.open(Map, marker);
						} // anonymous function that addListener returns
					})(marker, scope, compiled, scope.markers[i].locations)
					); //addListener
					
					
					
					
				} // for all resources
			} // init
		} // return
}); //factory