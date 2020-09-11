
var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

	
	// function to determinte marker colors based on magnitude	
   	function circleColor(mag){
		if (mag >= 5){
			return "red";
		}
		else if (mag >= 4){
			return "orange";
		}
		else if (mag >= 3){
			return "yellow";
		}
		else if (mag >= 2){
			return "green";
		}
		else if (mag >= 1){
			return "blue";
		}
	};
	
	//function to create markers
	function createMarker(feature,latlng){
		var options =  {
            radius:(feature.properties.mag*4),
            fillColor: circleColor(feature.properties.mag),
            color: "#000000",
            weight: 1,
            opacity: 1,
            fillOpacity: 0.5
        }
        return L.circleMarker( latlng, options );
    }
	
	
	 // Define a function we want to run once for each feature in the features array
    // Give each feature a popup describing the place and time of the earthquake
    function onEachFeature(feature, layer) {
        layer.bindPopup("<h3>" + feature.properties.place +
        "</h3><hr><p>" + "Time: " + new Date(feature.properties.time) + "<br></br>" 
		+ "Magnitude: "+ feature.properties.mag + "</p>"
		);
    }
	
	
    d3.json(url,function(data){
    console.log(data);
	createFeatures(data.features);
	});
	
	
  


function createFeatures(earthquakeData) {

 
    // Create a GeoJSON layer containing the features array on the earthquakeData object
    // Run the onEachFeature function once for each piece of data in the array
    var earthquakes = L.geoJSON(earthquakeData, {
        onEachFeature: onEachFeature,
		pointToLayer: createMarker
    });

    // Sending our earthquakes layer to the createMap function
    createMap(earthquakes);
}

	



function createMap(earthquakes) {

    // Define streetmap and darkmap layers
    var greyscale= L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
	attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
	tileSize: 512,
	maxZoom: 18,
	zoomOffset: -1,
	id: "mapbox/light-v10",
	accessToken: API_KEY
	});

    var satellite= L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
	attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
	tileSize: 512,
	maxZoom: 18,
	zoomOffset: -1,
	id: "mapbox/satellite-v9",
	accessToken: API_KEY
	});
	
	var outdoors= L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
	attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
	tileSize: 512,
	maxZoom: 18,
	zoomOffset: -1,
	id: "mapbox/outdoors-v11",
	accessToken: API_KEY
	});

    // Define a baseMaps object to hold our base layers
    var baseMaps = {
            "Satellite": satellite,
            "Grayscale": greyscale,
			"Outdoors": outdoors
    };

    // Create overlay object to hold our overlay layer
    var overlayMaps = {
            "Earthquakes": earthquakes
			
    };

    // Create our map, giving it the streetmap and earthquakes layers to display on load
    var myMap = L.map("map", {
    center: [38, -99.9],
    zoom: 5,
	layers: [satellite, greyscale, outdoors]
	});

    // Create a layer control
    // Pass in our baseMaps and overlayMaps
    // Add the layer control to the map
    L.control.layers(baseMaps, overlayMaps, {
            collapsed: false
    }).addTo(myMap);
}



























