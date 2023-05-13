function createMap(earthquakes) {

  // Create the tile layer for background of our map.
  let streetmap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  });


  // Create a baseMaps object to hold the streetmap layer.
  let baseMaps = {
    "Street Map": streetmap
  };

  // Create an overlayMaps object to hold the eatherquakes layer.
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



// Legend control object.
let legend = L.control({
  position: "bottomright"
});

// Details for the legend
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

// Looping through our intervals to generate a label with a colored circle for each interval.
  for (var i = 0; i < quakes.length; i++) {
    console.log(colors[i]);
    div.innerHTML +=
      "<i style='background: " + colors[i] + "'></i> " +
      quakes[i] + (quakes[i + 1] ? "&ndash;" + quakes[i + 1] + "<br>" : "+");
    }
    return div;
  };

// Adding legend to the map.
legend.addTo(map);

}

function createMarkers(response) {

  // Pull the "location" property from response.data.
  let locations = response.features;

  // Initialize an array to hold location markers.
  let earthquakes = [];

 
  // Loop through the locations array.
  for (let index = 0; index < locations.length; index++) {
    let location = locations[index];
    
    let color = "#B5FF33"
    

    if (location.geometry.coordinates[2] > -11 && location.geometry.coordinates[2] < 10 ){
      color =  "#B5FF33" }
    else if (location.geometry.coordinates[2] > 10 && location.geometry.coordinates[2] < 31 ){
     color = "#F3FF33" }
     else if (location.geometry.coordinates[2] > 30 && location.geometry.coordinates[2] < 51 ){
     color = "#FFDA33" }
     else if (location.geometry.coordinates[2] > 50 && location.geometry.coordinates[2] < 71 ){
     color = "#FFB533" }
     else if (location.geometry.coordinates[2] > 70 && location.geometry.coordinates[2] < 91 ){
     color = "#FF5B33"}
     else if (location.geometry.coordinates[2] > 90 ){
     color = "#FF3333"}
     else {
     color = "#B5FF33"
    }



    // For each location, create a marker, and bind a popup with the location's name.
    let earthMarker = L.circleMarker([location.geometry.coordinates[1], location.geometry.coordinates[0]],{
      radius:location.properties.mag *2,
      color:"black",
      fillColor: color,
      opacity: 0.05,
      fillOpacity : 0.5,
    })
      .bindPopup("<h3>" + location.properties.title + "<h3><h3>Depth: " + location.geometry.coordinates[2] + 
      "</h3>");
    console.log(location.geometry.coordinates[2] );
    // Add the marker to the locations array.
    earthquakes.push(earthMarker);
  }

  // Create a layer group that's made from the location markers array, and pass it to the createMap function.
  createMap(L.layerGroup(earthquakes));
}


// Perform an API call 
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson").then(createMarkers);
