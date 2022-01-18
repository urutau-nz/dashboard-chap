

/* ==== BLOCK MOUSE EVENTS ==== */
/* - Don't remove these */
/* Highlights a block on mouseover, and updates the distance pop-up.
Params:
    e - event object passed by browser.
*/
function highlightFeature(e) {
    var layer = e.target;

    layer.setStyle({
      weight: 3,
      opacity: 1,
      fillOpacity: 0.5
    });

    // Update Mouse Info 
    /*
    var mouse_info = document.getElementById("mouseInfo");
    mouse_info.style.visibility = "visible";
    mouse_info.innerHTML = "Distance: " + distance.toPrecision(2) + "km"; */
}
/* Resets a block's highlight on mouseout, and hides the distance pop-up
Params:
    e - event object passed by browser.
*/
function resetHighlight(e) {
    var layer = e.target;
    
    layer.setStyle({
      weight: 2,
      opacity: 0.2,
      fillOpacity: 0.2
    });
    
    // Update Mouse Info
    /*
    var mouse_info = document.getElementById("mouseInfo");
    mouse_info.style.visibility = "hidden"; */
}








  
  
  
/* Updates entire map */
var map = null;
function updateMap() {
    
    if (map != null) {
      map.remove();
    }
    /* ==== INITIALISE LEAFLET MAP & TILE LAYER ==== */
  
    map = L.map('map-div', {"attributionControl": false, center: [-43.530918, 172.636744], zoom: 11, minZoom : 4, zoomControl: false, worldCopyJump: true, crs: L.CRS.EPSG3857});
    //attr = L.control.attribution().addAttribution('<a href="https://urbanintelligence.co.nz/">Urban Intelligence</a>');
    //attr.addTo(map);
  
    L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_nolabels/{z}/{x}/{y}.png',
                                {"attributionControl": false, "detectRetina": false, "maxZoom": 16, "minZoom": 4,
                                  "noWrap": false, "subdomains": "abc"}).addTo(map);
  
    map.createPane('labels');
    map.getPane('labels').style.zIndex = 650;
    map.getPane('labels').style.pointerEvents = 'none';
  
    L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_only_labels/{z}/{x}/{y}{r}.png',
                {pane: 'labels'}).addTo(map);
    
    
  
  
  
    
  
    // Generate Asset Menu
    var asset_menu = [];
    for (var category in category_titles) {
      var items = [];
      for (var layer_id in assets) {
        var layer = assets[layer_id];
        if (layer.category == category) {
          items.push([layer.id, layer.name]);
        }
      }
      asset_menu.push({'header': category_titles[category], 'category': category,  'items': items});
    }
    asset_menu.sort(function(a, b) { // Larger length to smaller. If equal, put in original order.
      var len = a.items.length - b.items.length;
      if (len == 0) {
        var keys = Object.values(category_titles);
        var out = keys.indexOf(b.header) - keys.indexOf(a.header);
        return out;
      } else {
        return len;
      }
    });
  
    $("#map-asset-table").html("");
  
    var content = "";
    var looping = true;
    var left = [];
    var right = [];
    var left_cat = null;
    var right_cat = null;
  
    while(looping) {
      if (left.length + right.length + asset_menu.length == 0) {
        looping = false;
        break;
      }
      
      content += '<tr>';

      if (left.length == 0 && asset_menu.length > 0) {
        var asset = asset_menu.pop();
        content += `<td class="header">${asset.header}</td>`;
        left = asset.items;
        left_cat = asset.category;
  
      } else if (left.length > 0) {
        var item = left.pop(); // Add clickability & use item[0]
        content += `<td class="item ${left_cat}" onclick="mapAsset('${item[0]}', '${item[1]}')">${item[1]}</td>`;

        
      
        if (left.length == 0 && asset_menu.length > 0) {
          var asset = asset_menu.pop();
          content += `<td class="header">${asset.header}</td>`;
          left = asset.items;
          left_cat = asset.category;
    
        } else if (left.length > 0) {
          var item = left.pop(); // Add clickability & use item[0]
          content += `<td class="item ${left_cat}" onclick="mapAsset('${item[0]}', '${item[1]}')">${item[1]}</td>`;
    
        } else {
          content += '<td></td>';
        }
  
      } else {
        content += '<td></td>';
      }
  
      /*
      if (left.length == 0 && asset_menu.length > 0) {
        var asset = asset_menu.pop();
        content += `<td class="header">${asset.header}</td>`;
        left = asset.items;
        left_cat = asset.category;
  
      } else if (left.length > 0) {
        var item = left.pop(); // Add clickability & use item[0]
        content += `<td class="item ${left_cat}" onclick="mapAsset('${item[0]}', '${item[1]}')">${item[1]}</td>`;
  
      } else {
        content += '<td></td>';
      }
  
      if (right.length == 0 && asset_menu.length > 0) {
        var asset = asset_menu.pop();
        content += `<td class="header">${asset.header}</td>`;
        right = asset.items;
        right_cat = asset.category;
  
      } else if (right.length > 0) {
        var item = right.pop(); // Add clickability & use item[0]
        content += `<td class="item ${right_cat}" onclick="mapAsset('${item[0]}', '${item[1]}')">${item[1]}</td>`;
        
      } else {
        content += '<td></td>';
      }
      */
      content += '</tr>';
    }
  
    $("#map-asset-table").html(content);
    
    filtersApplyChanges();
}



var area_outline;

function areaOutlineStyle(feature) {
    var opacity;
    if (feature.properties.title == filter_values.region) {
        opacity = 0.4;
    } else {
        opacity = 0;
    }
    return {weight: 2, color: "#F00", opacity: opacity, fillOpacity: 0};
}

function showAreaOutline() {
    if (area_outline) {
      map.removeLayer(area_outline);
    }
    area_outline = L.geoJSON(topojson.feature(areas, areas.objects.adaptation_priority_areas), 
                {style : areaOutlineStyle}
                );
    area_outline.addTo(map);
}



/* Styles individual blocks. Called by Leaflet API.
Params:
    feature - Leaflet feature object for an individual block.
*//*
function style(feature) {
    let col;
    if (filtered_distances.length == 0) { 
        col="#000000";
    } else if (distances_by_geoid[feature.id][1] && simulateHazard) {
        col="#000000";
    } else { 
        col = getColor(distances_by_geoid[feature.id][0]);
    }
    return { fillColor: col, weight: 1, color: col, opacity: 0.2, fillOpacity: 0.5};
}



/* ====== ROADS ===== */
/*

function roadStyle(feature) {
    let weight;
    if (!simulateHazard) {
        weight = 0
    } else {
        weight = 1
    }
    return { fillColor: '#f54242', color: '#f54242', weight: weight};
}

var roadsLayer = null;
function updateRoads() {

    if (roadsLayer) {
        // Already exists, must be removed
        map.removeLayer(roadsLayer);
    }

    roadsLayer = L.geoJSON(topojson.feature(roads, roads.objects.road), 
            { style: roadStyle }
            ).addTo(map);

    updateMarkers();
}





/* ====== DESTINATION MARKERS ===== */
/*
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
    if (d.name && d.name.length > 0) {
        out += '<h3 style="margin:5px 0;">' + d.name + '&nbsp;<span style="font-size:1.2em;color:' + marker.options.fillColor + '">&#9679;</span></h3>';
    } else {
        out += '<h3 style="margin:5px 0;"><span style="font-style:italic">';
        switch (d.dest_type) {
            case "supermarket":
                out += "Supermarket";
                break;
            case "medical_clinic":
                out += "Medical Clinic";
                break;
            case "primary_school":
                out += "Primary School"
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
*//*
var markerLayer = null;
var timeValue = 0;
function updateMarkers(m) {
    var markers = [];
    for (d of filtered_destinations) {
        const col = (d.operational.toLowerCase() != "false" && simulateHazard ? "#000" : "#55F");
        marker = L.circleMarker([d.lat, d.lon]).setStyle({
            radius: 3,
            fillColor: col,
            color: "#000",
            weight: 0,
            opacity: 1,
            fillOpacity: 1
        }).addTo(geojsonLayer).on({
            mouseover: highlightMarker,
            mouseout: resetHighlightMarker
        });
        marker.destination = d;
        markers.push(marker);
    }
    markerLayer = L.layerGroup(markers);
} */



