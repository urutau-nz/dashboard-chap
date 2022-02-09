

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

/* ====== DESTINATION MARKERS ===== */

function highlightMarker(e) {
  var marker = e.target;
  marker.setStyle({
      radius: 8,
      weight: 3,
  });
}
function resetHighlightMarker(e) {
  var marker = e.target;
  marker.setStyle({
      radius: 3,
      weight: 1.2,
  });
}








  
  
  
/* Updates entire map */
var map = null;
function updateMap() {
    
    if (map != null) {
      map.remove();
    }
    /* ==== INITIALISE LEAFLET MAP & TILE LAYER ==== */
  
    map = L.map('map-div', {"attributionControl": false, center: [-43.530918, 172.636744], zoom: 11, maxZoom: 18, minZoom : 4, zoomControl: false, worldCopyJump: true, crs: L.CRS.EPSG3857});
    //attr = L.control.attribution().addAttribution('<a href="https://urbanintelligence.co.nz/">Urban Intelligence</a>');
    //attr.addTo(map);
  
    L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_nolabels/{z}/{x}/{y}.png',
                                {"attributionControl": false, "detectRetina": false, "maxZoom": 18, "minZoom": 4,
                                  "noWrap": false, "subdomains": "abc"}).addTo(map);
  
    map.createPane('labels');
    map.getPane('labels').style.zIndex = 650;
    map.getPane('labels').style.pointerEvents = 'none';
  
    L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_only_labels/{z}/{x}/{y}{r}.png',
                {pane: 'labels'}).addTo(map);
    
    
  
  
  
    
    /*
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
      items.reverse();
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
      content += '</tr>';
    }
  
    $("#map-asset-table").html(content);
      */
    
    console.log(selected_asset);
    if (!selected_asset) {
      // Switch filter expand icon to right tab
      $('#page-map .filters-expanding-icon img').attr('src', `./icons/none-Expand.png`);
  
          // Switch Pointer icons to right tab
      $("#page-map .slr-pointers-div img").attr('src', `./icons/none-Pointer.png`);
    } else {
      // Switch filter expand icon to right tab
      $('#page-map .filters-expanding-icon img').attr('src', `./icons/${assets[selected_asset].category}-Expand.png`);
  
          // Switch Pointer icons to right tab
      $("#page-map .slr-pointers-div img").attr('src', `./icons/${assets[selected_asset].category}-Pointer.png`);
    }

    filtersApplyChanges();
}







var area_outline;

function areaOutlineStyle(feature) {
    var opacity;
    if (feature.properties.title == filter_values.region) {
        opacity = 1;
    } else {
        opacity = 0;
    }
    return {weight: 2, color: "#000", opacity: opacity, fillOpacity: 0};
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






var selected_domain = null;

var selected_asset = null;

var asset_layer = null;

var hover_data = {};

function mapAssetOnLoad(data) {
    var myasset = assets[selected_asset];

    asset_layer = new DataLayer(selected_asset,
        myasset.display_name,
        myasset.category,
        null,
        data[selected_asset],
        (assets_to_tile.includes(myasset.display_name)) // Tile if BIG (names kept in assets_to_tile)
    );

    asset_layer.display();
    $("#loading-popup").css("right", "-20rem");
}

function mapAsset(asset, asset_label) {
    filters_expanded = false;
    filterPanelRender();

    $("#map-info-table").removeClass();
    $("#map-info-table").addClass(assets[asset].category);

    $("#map-assets-td").css("display", "none");
    $("#map-domains-td").css("display", "none");
    $("#map-report-td").css("display", "table-cell");
    
    $("#map-report-header-td").html(`<h1>${asset_label}</h1>`);
    $("#map-info-table").css("background-color", category_colors[assets[asset].category]);
    $("#map-info-table").css("color", category_text_colors[assets[asset].category]);
    
    // Switch filter expand icon to right tab
    $('#page-map .filters-expanding-icon img').attr('src', `./icons/${assets[asset].category}-Expand.png`);

        // Switch Pointer icons to right tab
    $("#page-map .slr-pointers-div img").attr('src', `./icons/${assets[asset].category}-Pointer.png`);

    createAssetReport("map-report-sub-div", asset_label);


    if (asset_layer) {
        asset_layer.remove();
    }

    var myasset = assets[asset];

    // Render asset on map
  
    selected_asset = asset;
    
    if (myasset.type == 'shapes') {
      $("#loading-popup").css("right", "3rem");
  
      
      var asset_importer = new ImportManager();
      
      asset_importer.addImport(myasset.id, myasset.display_name, 'json', 
      myasset.file_name);
  
      asset_importer.onComplete(mapAssetOnLoad);
  
      asset_importer.runImports();

    } else { // Point Data
      
      // Get Relevant Points
      var points = [];
      if (myasset.category == 'built') {
        points = built_points.filter(d => d.name == asset_label);
      }

      // Create Markers
      asset_layer = new MarkerLayer(myasset.id, myasset.name, myasset.category, category_map_colors[myasset.category],
        points);
        
      asset_layer.display();
    }
}



function mapAssetReturn() {

    $("#map-assets-td").css("display", "table-cell");
    $("#map-report-td").css("display", "none");
    $("#map-domains-td").css("display", "none");
    $("#map-info-table").css("background-color", "white");

    $("#map-info-table").removeClass();
    $("#map-info-table").addClass("none");
    
    // Switch filter expand icon to right tab
    $('#page-map .filters-expanding-icon img').attr('src', `./icons/none-Expand.png`);

        // Switch Pointer icons to right tab
    $("#page-map .slr-pointers-div img").attr('src', `./icons/none-Pointer.png`);

    mapDomain(assets[selected_asset].category);
    
    asset_layer.remove();
    selected_asset = null;
}


function mapDomain(domain) {
  if (selected_domain != domain) {
    selected_domain = domain;
    
    filters_expanded = false;
    filterPanelRender();
  }
  
  $("#map-assets-td").css("display", "table-cell");
  $("#map-domains-td").css("display", "none");
  $("#map-report-td").css("display", "none");

  $("#map-info-table").removeClass();
  $("#map-info-table").addClass("none");
  $("#map-info-table").css("background-color", "white");

  $("#map-info-table span.domain").text(domain.substring(0, 1).toUpperCase() + domain.substring(1));

  // Switch filter expand icon to right tab
  $('#page-map .filters-expanding-icon img').attr('src', `./icons/none-Expand.png`);

  // Switch Pointer icons to right tab
  $("#page-map .slr-pointers-div img").attr('src', `./icons/none-Pointer.png`);


  // Generate Asset Menu
  // Get Alphabetical order
  var alphabetical_asset_ids = Object.keys(assets);
  alphabetical_asset_ids.sort((a, b) => {
    var x = assets[a], y = assets[b];
    if (x.display_name < y.display_name) {return -1;}
    if (x.display_name > y.display_name) {return 1;}
    return 0;
  });

  var content = "";
  var odd = true;
  for (var asset_id of alphabetical_asset_ids) {
    var asset = assets[asset_id];

    if (asset.category == domain) {

      var info_icon = "";
      if (asset_descriptions.filter(d => d["Asset"].toLowerCase() == asset.display_name.toLowerCase()).length == 0) {
        // No asset description matching this asset
        info_icon = `<div class="asset-caution-div"><table>
        <tr><td class="info">
        
        </td><td class="icon">
        <img src="./icons/Cauton-Dot.svg"/>
        </td></tr>
        </table></div>`;
      } else {
        // Check if an image exists
        var image_file = hazard_scenario.substring(0, hazard_scenario.length - 4) + '.tif';
        $.ajax({url:`${import_url}/data/report_figures/${asset.name}-${image_file}.jpg`,type:'HEAD',asset_id: asset.id,
        error: function(e) {
          console.log(this.asset_id, this);
          $(`#asset-caution-div-${this.asset_id}`).css("visibility", "visible");
        }});

        info_icon = `<div class="asset-caution-div" id="asset-caution-div-${asset.id}" style="visibility: hidden;"><table>
        <tr><td