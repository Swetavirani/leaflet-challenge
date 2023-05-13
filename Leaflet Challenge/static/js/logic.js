function createMap(earthquakes) {

  // Create the tile layer that will be the background of our map.
  let streetmap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  });


  // Create a baseMaps object to hold the streetmap layer.
  let baseMaps = {
    "Street Map": streetmap
  };

  // Create an overlayMaps object to hold the bikeStations layer.
  let overlayMaps = {
    "Earth Quakes": earthquakes
  };

  // Create the map object with options.
  let map = L.map("map", {
    center: [38.884, -100.895],
    zoom: 3,
    layers: [streetmap, earthquakes]
  });

  // Create a layer control, and pass it baseMaps and overlayMaps. Add the layer control to the map.
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(map);



// Here we create a legend control object.
let legend = L.control({
  position: "bottomright"
});

// Then add all the details for the legend
legend.onAdd = function() {
  let div = L.DomUtil.create("div", "info legend");
  const quakes = [-11, 10, 30, 50, 70, 90];
  const colors = [
    "#B5FF33",
    "#F3FF33",
    "#FFDA33",
    "#FFB533",
    "#FF5B33",
    "#FF3333"
  ];

// Looping through our intervals to generate a label with a colored square for each interval.
  for (var i = 0; i < quakes.length; i++) {
    console.log(colors[i]);
    div.innerHTML +=
      "<i style='background: " + colors[i] + "'></i> " +
      quakes[i] + (quakes[i + 1] ? "&ndash;" + quakes[i + 1] + "<br>" : "+");
    }
    return div;
  };

// Finally, we add our legend to the map.
legend.addTo(map);

}

function createMarkers(response) {

  // Pull the "stations" property from response.data.
  let stations = response.features;

  // Initialize an array to hold bike markers.
  let earthquakes = [];
 // console.log(stations);
 
  // Loop through the stations array.
  for (let index = 0; index < stations.length; index++) {
    let station = stations[index];
    
    let color = "#B5FF33"
    

    if (station.geometry.coordinates[2] > -11 && station.geometry.coordinates[2] < 10 ){
      color =  "#B5FF33" }
    else if (station.geometry.coordinates[2] > 10 && station.geometry.coordinates[2] < 31 ){
     color = "#F3FF33" }
     else if (station.geometry.coordinates[2] > 30 && station.geometry.coordinates[2] < 51 ){
     color = "#FFDA33" }
     else if (station.geometry.coordinates[2] > 50 && station.geometry.coordinates[2] < 71 ){
     color = "#FFB533" }
     else if (station.geometry.coordinates[2] > 70 && station.geometry.coordinates[2] < 91 ){
     color = "#FF5B33"}
     else if (station.geometry.coordinates[2] > 90 ){
     color = "#FF3333"}
     else {
     color = "#B5FF33"
    }



    // For each station, create a marker, and bind a popup with the station's name.
    let earthMarker = L.circleMarker([station.geometry.coordinates[1], station.geometry.coordinates[0]],{
      radius:station.properties.mag *2,
      color:"black",
      fillColor: color,
      opacity: 0.05,
      fillOpacity : 0.5,
    })
      .bindPopup("<h3>" + station.properties.title + "<h3><h3>Depth: " + station.geometry.coordinates[2] + 
      "</h3>");
    console.log(station.geometry.coordinates[2] );
    // Add the marker to the bikeMarkers array.
    earthquakes.push(earthMarker);
  }

  // Create a layer group that's made from the bike markers array, and pass it to the createMap function.
  createMap(L.layerGroup(earthquakes));
}


// Perform an API call to the Citi Bike API to get the station information. Call createMarkers when it completes.
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson").then(createMarkers);
