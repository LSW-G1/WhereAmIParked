// Where Am I Parked?
// VERSION 1.00
// ARNAUD Louis, TARTIERE Kevin

// VARIABLES
var map
var currentPositionMarker
var allMarkers = []

$(document).ready(() =>
{
	var defaultLocation = {
		lat: 46.2276,
		lng: 2.2137
	}

	// Create Google MAP
	map = new google.maps.Map(document.getElementById('map'),
	{
		zoom: 5,
		center: defaultLocation,
		styles: [
		{
			elementType: 'geometry',
			stylers: [
			{
				color: '#242f3e'
			}]
		},
		{
			elementType: 'labels.text.stroke',
			stylers: [
			{
				color: '#242f3e'
			}]
		},
		{
			elementType: 'labels.text.fill',
			stylers: [
			{
				color: '#746855'
			}]
		},
		{
			featureType: 'administrative.locality',
			elementType: 'labels.text.fill',
			stylers: [
			{
				color: '#d59563'
			}]
		},
		{
			featureType: 'poi',
			elementType: 'labels.text.fill',
			stylers: [
			{
				color: '#d59563'
			}]
		},
		{
			featureType: 'poi.park',
			elementType: 'geometry',
			stylers: [
			{
				color: '#263c3f'
			}]
		},
		{
			featureType: 'poi.park',
			elementType: 'labels.text.fill',
			stylers: [
			{
				color: '#6b9a76'
			}]
		},
		{
			featureType: 'road',
			elementType: 'geometry',
			stylers: [
			{
				color: '#38414e'
			}]
		},
		{
			featureType: 'road',
			elementType: 'geometry.stroke',
			stylers: [
			{
				color: '#212a37'
			}]
		},
		{
			featureType: 'road',
			elementType: 'labels.text.fill',
			stylers: [
			{
				color: '#9ca5b3'
			}]
		},
		{
			featureType: 'road.highway',
			elementType: 'geometry',
			stylers: [
			{
				color: '#746855'
			}]
		},
		{
			featureType: 'road.highway',
			elementType: 'geometry.stroke',
			stylers: [
			{
				color: '#1f2835'
			}]
		},
		{
			featureType: 'road.highway',
			elementType: 'labels.text.fill',
			stylers: [
			{
				color: '#f3d19c'
			}]
		},
		{
			featureType: 'transit',
			elementType: 'geometry',
			stylers: [
			{
				color: '#2f3948'
			}]
		},
		{
			featureType: 'transit.station',
			elementType: 'labels.text.fill',
			stylers: [
			{
				color: '#d59563'
			}]
		},
		{
			featureType: 'water',
			elementType: 'geometry',
			stylers: [
			{
				color: '#17263c'
			}]
		},
		{
			featureType: 'water',
			elementType: 'labels.text.fill',
			stylers: [
			{
				color: '#515c6d'
			}]
		},
		{
			featureType: 'water',
			elementType: 'labels.text.stroke',
			stylers: [
			{
				color: '#17263c'
			}]
		}]
	})

	// Current Location Marker
	currentPositionMarker = new google.maps.Marker(
	{
		position: defaultLocation,
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

	var cookies = getCookie()
	cookies.markers.forEach((cookie) =>
	{
		setMarker(cookie, cookie.name, cookie.id)
	})

	setInterval(() =>
	{
		getCurrentPosition(false)
	}, 5000)

	// TIMEOUT: somehow prevents not zooming at the loading of the app (~1/3 of the time)
	setTimeout(() =>
	{
		getCurrentPosition(true)
	}, 750)

})

// FUNCTION: Get user's position
getCurrentPosition = (rezoom, callback) =>
{

	console.log(" > DEBUG: getCurrentPosition - " + rezoom)

	navigator.geolocation.getCurrentPosition((position) =>
	{
		var localization = {
			lat: position.coords.latitude,
			lng: position.coords.longitude
		}

		if (rezoom)
		{
			map.setCenter(localization)
			map.setZoom(15)
		}

		if (currentPositionMarker)
		{
			currentPositionMarker.setPosition(localization)
		}

		if (callback)
		{
			callback(localization)
		}
	})
}

// FUNCTION: create cookie
setCookie = (cookie) =>
{
	console.log(" > DEBUG: setCookie -", cookie)

	var date = new Date()
	date.setTime(date.getTime() + (7 * 24 * 60 * 60 * 1000))

	if (cookie)
	{
		document.cookie = 'MARKERS=' + JSON.stringify(cookie) + ";expires=" + date
	}
}

// FUNCTION: read cookie
getCookie = () =>
{
	console.log(" > DEBUG: getCookie")

	var date = new Date()
	date.setTime(date.getTime() + (7 * 24 * 60 * 60 * 1000))

	if (!document.cookie)
	{
		//	document.cookie = 'MARKERS={"markers":[], "updatedAt": ""}; expires=' + date
		document.cookie = 'MARKERS={"markers":[]}; expires=' + date
	}

	var cookies = JSON.parse(document.cookie.split("=")[1])

	return cookies
}


// FUNCTION: create new Marker
setMarker = (localization, name, id) =>
{
	console.log(" > DEBUG: setMarker - " + name + " - " + JSON.stringify(localization))

	let marker = new google.maps.Marker(
	{
		position: localization,
		map: map,
		label:
		{
			text: name,
			color: "#FFF"
		}
	})

	allMarkers.push(
	{
		id: id,
		marker: marker
	})
	$("#tbody").append("<tr id='entry-" + id + "'><th id='name-" + id + "'>" + name + "</th><th width='290px'><button class='button-action' id='marker-rename-" + id + "'>RENOMMER</button> <button class='button-action' id='marker-delete-" + id + "'>SUPPRIMER</button>")

	$("#marker-rename-" + id).click((e) =>
	{
		renameMarker(id)
	})

	$("#marker-delete-" + id).click((e) =>
	{
		deleteMarker(id)
	})
}

// FUNCTION: Generate UNIQID
generateId = (size) =>
{
	var uniqID = ""
	var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"

	for (var i = 0; i < size; i++)
	{
		uniqID += characters.charAt(Math.floor(Math.random() * characters.length))
	}

	return uniqID
}

//FUNCTION : Change name of markers
renameMarker = (id) =>
{
	var cookie = getCookie()
	var name = prompt("How do you want to rename the marker? ")

	allMarkers.find((markerObject) =>
	{
		if (id == markerObject.id)
		{
			markerObject.marker.setOptions(
			{
				label:
				{
					text: name,
					color: "#FFFFFF"
				}
			})
		}
	})

	$("#name-" + id).text(name)

	cookie.markers.find((markerObject) =>
	{
		if (id == markerObject.id)
		{
			markerObject.name = name
			setCookie(cookie)
		}
	})
}

//FUNCTION : Change name of markers
deleteMarker = (id) =>
{
	let cookie = getCookie()
	allMarkers.find((markerObject) =>
	{
		if (id == markerObject.id)
		{
			markerObject.marker.setVisible(false)
		}
	})

	$("#entry-" + id).html("")

	cookie.markers.splice(
		cookie.markers.findIndex((markerObject) =>
		{
			return (markerObject.id == id)
		}), 1
	)

	setCookie(cookie)
}


// LEFT BUTTON: Create a marker on this position
$("#setMarker").click(() =>
{
	var cookies = getCookie()
	var id = generateId(8)
	var name = prompt("Please name your new marker")

	if (name)
	{
		getCurrentPosition(true, (localization) =>
		{
			localization.name = name
			localization.id = id
			cookies.markers.push(localization)

			setCookie(cookies)
			setMarker(localization, name, id)
		})
	}
})

// MIDDLE BUTTON: Locate the user, and center map.
$("#locate").click(() =>
{
	getCurrentPosition(true)
})

// RIGHT BUTTON: Switch to the markers list
$("#getMarkers").click(() =>
{
	// MAPS AND LIST CLASS
	$("#map").toggleClass("hidden")
	$("#list").toggleClass("hidden")

	// BUTTON CLASS
	$("#locate").toggleClass("hidden")
	$("#setMarker").toggleClass("hidden")
	$("#getMarkers").toggleClass("button-fullwidth")

	// CHANGE BUTTON TEXT
	if ($("#getMarkers").text() == "Return to map")
	{
		$("#getMarkers").text("Show markers")
	}
	else
	{
		$("#getMarkers").text("Return to map")
	}
})