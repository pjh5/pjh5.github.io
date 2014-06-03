var app = angular.module('services', []);

app.factory('MapFactory', function($rootScope , $compile){
		return {
			init:function( mapElements , scope) {
				console.log("Calling factory init");
				
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
				
				var Map = $rootScope.map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
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