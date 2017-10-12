// Where Am I Parked?
// VERSION 1.00
// ARNAUD Louis, TARTIERE Kevin

var map
var positionMarker

var initMap = () =>
{

	var defaultLoc = {lat: 46.2276, lng: 2.2137}
	var infoWindow = new google.maps.InfoWindow
	
	// Google Map, centered on user's position
	map = new google.maps.Map(document.getElementById('map'),
	{
		zoom: 5,
		center: defaultLoc,
		styles: [
			{elementType: 'geometry', stylers: [{color: '#242f3e'}]},
			{elementType: 'labels.text.stroke', stylers: [{color: '#242f3e'}]},
			{elementType: 'labels.text.fill', stylers: [{color: '#746855'}]},
			{
				featureType: 'administrative.locality',
				elementType: 'labels.text.fill',
				stylers: [{color: '#d59563'}]
			},
			{
				featureType: 'poi',
				elementType: 'labels.text.fill',
				stylers: [{color: '#d59563'}]
			},
			{
				featureType: 'poi.park',
				elementType: 'geometry',
				stylers: [{color: '#263c3f'}]
			},
			{
				featureType: 'poi.park',
				elementType: 'labels.text.fill',
				stylers: [{color: '#6b9a76'}]
			},
			{
				featureType: 'road',
				elementType: 'geometry',
				stylers: [{color: '#38414e'}]
			},
			{
				featureType: 'road',
				elementType: 'geometry.stroke',
				stylers: [{color: '#212a37'}]
			},
			{
				featureType: 'road',
				elementType: 'labels.text.fill',
				stylers: [{color: '#9ca5b3'}]
			},
			{
				featureType: 'road.highway',
				elementType: 'geometry',
				stylers: [{color: '#746855'}]
			},
			{
				featureType: 'road.highway',
				elementType: 'geometry.stroke',
				stylers: [{color: '#1f2835'}]
			},
			{
				featureType: 'road.highway',
				elementType: 'labels.text.fill',
				stylers: [{color: '#f3d19c'}]
			},
			{
				featureType: 'transit',
				elementType: 'geometry',
				stylers: [{color: '#2f3948'}]
			},
			{
				featureType: 'transit.station',
				elementType: 'labels.text.fill',
				stylers: [{color: '#d59563'}]
			},
			{
				featureType: 'water',
				elementType: 'geometry',
				stylers: [{color: '#17263c'}]
			},
			{
				featureType: 'water',
				elementType: 'labels.text.fill',
				stylers: [{color: '#515c6d'}]
			},
			{
				featureType: 'water',
				elementType: 'labels.text.stroke',
				stylers: [{color: '#17263c'}]
			}
		]
	})

	navigator.geolocation.getCurrentPosition((pos) =>
	{
		var position   = {lat: pos.coords.latitude, lng: pos.coords.longitude}
		map.setCenter(position);
		map.setZoom(15);

		// Current Location Marker
		positionMarker = new google.maps.Marker(
		{
			position: map.getCenter(),
			icon:
			{
				path: google.maps.SymbolPath.CIRCLE,
				scale: 7,
				strokeWeight: 2,
				strokeColor: "#FFF"
			},
			draggable: false,
			map: map
		})

		// Current Location Information Window
		infoWindow.setPosition(position);
		infoWindow.setContent('You are here.');
		infoWindow.open(map);
	})


	setInterval(() =>
	{
		navigator.geolocation.getCurrentPosition((pos) =>
		{
			var position = {lat: pos.coords.latitude, lng: pos.coords.longitude}
			
			positionMarker.setPosition(position)
			// map.setCenter(position)
		})

	}, 1000)
}

$("#createMarker").click(() =>
{
	navigator.geolocation.getCurrentPosition((pos) =>
	{
		var position   = {lat: pos.coords.latitude, lng: pos.coords.longitude}
		var markername = prompt("Please name the marker", "My car")
		
		// Position Marker
		var marker = new google.maps.Marker(
		{
			position: position,
			map: map,
			label: 
			{
				text: markername,
				color: "#FFF" 
			}
		})
		
		document.cookie = 'MARKERS={"marker":' + JSON.stringify(position) + '}'
	})

})

$("#listMarkers").click(() =>
{
	var listMarkers = $("#listMarkers")

	// Toggle class
	$("#map").toggleClass("hidden")
	$("#list").toggleClass("hidden")
	$("#locate").toggleClass("hidden")
	listMarkers.toggleClass("button-fullwidth")
	$("#createMarker").toggleClass("hidden")
	
	// Change text
	if (listMarkers.text() == "Return to map")
	{
		listMarkers.text("Show markers")
	}
	else
	{
		listMarkers.text("Return to map")

	}
})

$("#locate").click(() =>
{
	navigator.geolocation.getCurrentPosition((pos) =>
	{
		var position = {lat: pos.coords.latitude, lng: pos.coords.longitude}
		
		positionMarker.setPosition(position)
		map.setCenter(position)
	})
})

$(document).ready(() =>
{
	var cookies = document.cookie.split("=")

	var markersList = JSON.parse(cookies[1])
	
	if (markersList)
	{
		// Position Marker
		var marker = new google.maps.Marker(
		{
			position: markersList.marker,
			map: map,
			label: 
			{
				text: "TEMP",
				color: "#FFF" 
			}
		})

	}
})