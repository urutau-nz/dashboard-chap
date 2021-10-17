


/* ==== INITIALISE LEAFLET MAP & TILE LAYER ==== */

var map = L.map('map', {"attributionControl": false, center: [-41.154693, 174.994874], zoom: 10, minZoom : 4, zoomControl: false, worldCopyJump: true, crs: L.CRS.EPSG3857});
//attr = L.control.attribution().addAttribution('<a href="https://urbanintelligence.co.nz/">Urban Intelligence</a>');
//attr.addTo(map);

var tile_layer = L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_nolabels/{z}/{x}/{y}.png',
                             {"attributionControl": false, "detectRetina": false, "maxZoom": 16, "minZoom": 4,
                              "noWrap": false, "subdomains": "abc"}).addTo(map);

map.createPane('labels');
map.getPane('labels').style.zIndex = 650;
map.getPane('labels').style.pointerEvents = 'none';

L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_only_labels/{z}/{x}/{y}{r}.png',
            {pane: 'labels'}).addTo(map);



/* ==== BLOCK MOUSE EVENTS ==== */

/* Highlights a block on mouseover, and updates the distance pop-up.
Params:
    e - event object passed by browser.
*/
function highlightFeature(e) {
    var layer = e.target;
    let distance = distances_by_geoid[layer.feature.properties.id];

    layer.setStyle({
      weight: 3,
      opacity: 1,
      fillOpacity: 0.75
    });

    // Update Mouse Info
    var mouse_info = document.getElementById("mouseInfo");
    mouse_info.style.visibility = "visible";
    mouse_info.innerHTML = "Distance: " + distance + "km";
}
/* Resets a block's highlight on mouseout, and hides the distance pop-up
Params:
    e - event object passed by browser.
*/
function resetHighlight(e) {
    var layer = e.target;
    
    layer.setStyle({
      weight: 1,
      opacity: 0.5,
      fillOpacity: 0.5
    });
    
    // Update Mouse Info
    var mouse_info = document.getElementById("mouseInfo");
    mouse_info.style.visibility = "hidden";
}
/* Links the above two functions to the mouseover & mouseout events. Called by Leaflet API.
Params:
    feature, layer - objects passed by Leaflet API.
*/
function onEachFeature(feature, layer) { 
    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight
    });
}




/* Styles individual blocks. Called by Leaflet API.
Params:
    feature - Leaflet feature object for an individual block.
*/
function style(feature) {
    let col;
    //console.log(distance_filtered);
    if (filtered_distances.length == 0) { 
        col="#000000"
    } else { 
        col = getColor(distances_by_geoid[feature.properties.id]);
    }
    return { fillColor: col, weight: 1, color: col, opacity: 0.5, fillOpacity: 0.5};
}


/* Updates all blocks on the map
*/
var geojsonLayer;
function updateBlocks() {
    if (!geojsonLayer) {
        geojsonLayer = L.geoJSON(topojson.feature(blocks, blocks.objects.data), 
                  {style : style, onEachFeature : onEachFeature}
                  ).addTo(map);
    }
    geojsonLayer.setStyle(style);
}




function highlightMarker(e) {
    var marker = e.target;
    var d = marker.destination;
    marker.setStyle({
        radius: 8,
    });

    // Update Mouse Info
    var mouse_info = document.getElementById("mouseInfo");
    mouse_info.style.visibility = "visible";
    mouse_info.style.background = "rgb(255,255,255)";

    var out = "";
    if (d.label && d.label.length > 0) {
        out += '<h3 style="margin:5px 0;">' + d.label + '&nbsp;<span style="font-size:1.2em;color:' + marker.options.fillColor + '">&#9679;</span></h3>';
    } else {
        out += '<h3 style="margin:5px 0;"><span style="font-style:italic">';
        switch (d.dest_type) {
            case "water":
                out += "Water Point";
                break;
            case "EM_hubs":
                out += "EM Hub"
                break;
            case "health_services":
                out += "Health Service"
                break;
        }
        out += '</span>&nbsp;<span style="font-size:1.2em;color:' + marker.options.fillColor + '">&#9679;</span></h3>';
    }
    mouse_info.innerHTML = out;
}
function resetHighlightMarker(e) {
    var marker = e.target;
    marker.setStyle({
        radius: 3,
    });
    
    // Update Mouse Info
    var mouse_info = document.getElementById("mouseInfo");
    mouse_info.style.visibility = "hidden";
    mouse_info.style.background = "rgba(255,255,255, 0.8)";
}
/* Updates all markers on the map
*/
var timeValue = 0;
var markerLayer;
var markerAmenity = null;
function updateMarkers(m) {
    if (markerAmenity != amenityMenu.value) {
        if (markerLayer) {
            map.removeLayer(markerLayer);
        }
        
        var markerList = [];
        for (d of filtered_destinations) {
            const col = cdest[d[timeValue]];
            marker = L.circleMarker([d.lat, d.lon]).setStyle({
                radius: 3,
                fillColor: col,
                color: "#000",
                weight: 0,
                opacity: 1,
                fillOpacity: 1
            }).on({
                mouseover: highlightMarker,
                mouseout: resetHighlightMarker
            });
            marker.destination = d;
            markerList.push(marker);
        }
        markerLayer = L.layerGroup(markerList);
        markerLayer.addTo(map);

    } else {
        const col = cdest[d[timeValue]];
        markerLayer.setStyle({
            radius: 3,
            fillColor: col,
            color: "#000",
            weight: 0,
            opacity: 1,
            fillOpacity: 1
        });
    }
}



// Updates the Island around the currently selected region
function islandStyle(feature) {
    if (feature.properties.Location == locMenu.value){
        return { color: '#FC814A', weight: 5, fillOpacity: 0.1 };
    } else {
        return { color: '#FC814A', weight: 0, fillOpacity: 0  };
    }
}
var islandLayer;
function updateIsland() {
    if (!islandLayer) {
        islandLayer = L.geoJSON(
            topojson.feature(islands, islands.objects.islands2),
            {
              style: islandStyle,
              interactive: false
            }
          ).addTo(map);
        console.log()
    }
    islandLayer.setStyle(islandStyle);
}