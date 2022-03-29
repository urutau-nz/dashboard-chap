

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

  map = L.map('map-div', {"attributionControl": false, center: [-43.530918, 172.636744], zoom: 11, minZoom : 4, zoomControl: false, worldCopyJump: true, crs: L.CRS.EPSG3857});
  //attr = L.control.attribution().addAttribution('<a href="https://urbanintelligence.co.nz/">Urban Intelligence</a>');
  //attr.addTo(map);

  L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_nolabels/{z}/{x}/{y}.png',
                              {"attributionControl": false, "detectRetina": false, "minZoom": 4,
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

function updateHoverData() {
  
  hover_data = {};

  if (selected_asset && hazard_scenario) {
    var hazard_scenario_tif = hazard_scenario.substring(0, hazard_scenario.length - 4) + '.tif';

    var file_name = asset_info.filter(d => d.display_name == assets[selected_asset].display_name)[0].exposure_file_name;
  
    var asset_importer = new ImportManager();
      
    asset_importer.addImport('hover', "Hover Data", 'csv', 
    assets[selected_asset].exposure_file_name);
  
    asset_importer.onComplete(function (imports) {
      imports['hover'].filter(d => d.hazard_scenario == hazard_scenario_tif).forEach(function (d) {
        hover_data[d.asset_id] = d.exposure;
      });
      console.log(hover_data, hazard_scenario_tif);
    });
  
    asset_importer.runImports();
  }

    
  
}



function mapAssetOnLoad(data) {
  var myasset = assets[selected_asset];
  console.log(assets, myasset, selected_asset);

  asset_layer = new DataLayer(selected_asset,
      myasset.display_name,
      myasset.category,
      myasset.type,
      data[selected_asset],
      (assets_to_tile.includes(myasset.id)) // Tile if BIG (names kept in assets_to_tile)
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


  if (asset_layer) {
      asset_layer.remove();
  }

  var myasset = assets[asset];

  // Render asset on map

  selected_asset = asset;
  
  if (myasset.type != 'point') {
    $("#loading-popup").css("right", "3rem");

    // VT WARNING INFO
    if (assets_to_tile.includes(myasset.id)) {
      $(`#vt-info`).css('display', 'block');
    } else {
      $(`#vt-info`).css('display', 'none');

      updateHoverData(); // Only update hover data if not VT (since VT can't handle hover data anyway)
    }

    
    var asset_importer = new ImportManager();
    
    asset_importer.addImport(myasset.id, myasset.display_name, 'json', 
    myasset.file_name);

    asset_importer.onComplete(mapAssetOnLoad);

    asset_importer.runImports();

  } else { // Point Data

    updateHoverData();
    
    // Get Relevant Points
    var points = [];
    if (myasset.category == 'built') {
      points = built_points.filter(d => d.asset_tag == myasset.id);
    }

    // Create Markers
    asset_layer = new MarkerLayer(myasset.id, myasset.name, myasset.category, category_map_colors[myasset.category],
      points);
      
    asset_layer.display();

  }
  createAssetReport("map-report-sub-div", myasset);
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

  var content = "";

  if (Object.keys(assets).filter(d => assets[d].category == domain).length > 0) {
    // If there ARE assets
    var odd = true;
    for (var asset_id in assets) {
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
        } else { /*
          // Check if an image exists
          var image_file = hazard_scenario.substring(0, hazard_scenario.length - 4) + '.tif';
          $.ajax({url:`${import_url}/data/report_data/${asset.id}/${asset.id}-${image_file}-${region_ids[filter_values.region]}.csv`,type:'HEAD',asset_id: asset.id,
          error: function(e) {
            // console.log(this.asset_id, this);
            $(`#asset-caution-div-${this.asset_id}`).css("visibility", "visible");
          }});
  
          info_icon = `<div class="asset-caution-div" id="asset-caution-div-${asset.id}" style="visibility: hidden;"><table>
          <tr><td class="info">
          
          </td><td class="icon">
          <img style="height: 20px;margin-right:2px" src="./icons/Missing-Image.svg"/>
          </td></tr>
          </table></div>`; */
        }
        var image_name = '';
        if (asset.type == 'point') {
          image_name = "Map-Pointer-Black";
        } else if (asset.type == 'polygon') {
          image_name = "Map-Shape-Black";
        } else if (asset.type == 'polyline') {
          image_name = "Map-Line-Black";
        }

        var type_icon = `<img class="asset-type-img" src="icons/${image_name}.svg"/>`;
  
        content += `<tr><td style="background-color: ${(odd ? category_colors[domain] : category_highlight_colors[domain])}"
                    onclick="mapAsset('${asset.id}', '${asset.display_name}')">${type_icon}${asset.display_name}${info_icon}</td></tr>`;
        odd = !odd;
      }
    }
  } else {
    // No Assets
    content += `<tr><td style="background-color: ${category_colors[domain]};cursor: default;"></td></tr>
    <tr><td style="background-color: ${category_highlight_colors[domain]};cursor: default;pointer-events: none;font-weight:600;font-style: italic;text-align:center;">Coming Soon</td></tr>
    <tr><td style="background-color: ${category_colors[domain]};cursor: default;"></td></tr>`;
  }

  $("#map-assets-menu-table").html(content);
}


function mapDomainReturn() {
  selected_domain = null;

  $("#map-domains-td").css("display", "table-cell");
  $("#map-assets-td").css("display", "none");
  $("#map-report-td").css("display", "none");
  $("#map-info-table").css("background-color", "white");

  $("#map-info-table").removeClass();
  $("#map-info-table").addClass("none");

  // Switch filter expand icon to right tab.asset-reports-td
  $('#page-map .filters-expanding-icon img').attr('src', `./icons/none-Expand.png`);

      // Switch Pointer icons to right tab
  $("#page-map .slr-pointers-div img").attr('src', `./icons/none-Pointer.png`);

}