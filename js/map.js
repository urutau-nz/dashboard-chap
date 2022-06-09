var map_map;
var map_region_dropdown;
var map_new_layer_domain = 'Built';
var map_maximum_layers = 4;

var map_assets_on_map = [];
var map_relevant_instances = {}; // Instances data by asset_id
var map_asset_layers = {}; // Layer ids by asset_id
var map_info_asset = null;
var map_info_layer = null;


var map_new_layer_popup = new vlPopup('Add a New Layer', `
<table class="parent-table">
    <tr>
        <td> 
            <div id="new-layer-domain-div">
                <div class="built active" onclick="populateNewLayerPopup('Built')"><img src="icons/Built-Tab.png"/></div>
                <div class="natural" onclick="populateNewLayerPopup('Natural')"><img src="icons/Natural-Tab.png"/></div>
                <div class="cultural" onclick="populateNewLayerPopup('Cultural')"><img src="icons/Cultural-Tab.png"/></div>
                <div class="human" onclick="populateNewLayerPopup('Human')"><img src="icons/Human-Tab.png"/></div>
            </div>
        </td>
    </tr>
    <tr>
        <td class="domain-heading-td">
            Built Domain
        </td>
    </tr>
    <tr>
        <td>
        </td>
    </tr>
    <tr>
        <td>
            <div class="nice-scroll">
                <div class="asset-list-td">
                    <div class="asset-col">
                        
                    </div>
                    <div class="asset-col">
                        
                    </div>
                </div>
            </div>
        </td>
    </tr>
</table>
`, {
    backdrop: true,
    draggable: false,
    exit_type: 'x',
    html_id: 'new-layer-popup'
});

var map_info_layer_popup = new vlPopup('Select an Information Layer', `
<table class="parent-table">
    <tr>
        <td>
            <div class="info-layer-list-td nice-scroll">

            </div>
        </td>
    </tr>
</table>
`, {
    backdrop: true,
    draggable: false,
    exit_type: 'x',
    html_id: 'info-layer-popup'
});




function initPageMap() {
    // Run on website open
    
    
    // Create Map Map
    map_map = new vlMap('map-map-div', {"attributionControl": false, center: [-43.530918, 172.636744], zoom: 11, minZoom : 4, zoomControl: false, worldCopyJump: true, crs: L.CRS.EPSG3857});
    map_map.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_nolabels/{z}/{x}/{y}.png',
                            {"attributionControl": false, "detectRetina": false, "minZoom": 4,
                            "noWrap": false, "subdomains": "abc"});
    
    map_map.createPane('labels', 650);
    map_map.getPane('labels').style.pointerEvents = 'none';

    map_map.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_only_labels/{z}/{x}/{y}{r}.png',
                {pane: 'labels'});

    // Add map zoom controls
    var zoom = L.control.zoom({
        zoomInText: '+',
        zoomOutText: '-',
        });
    zoom.addTo(map_map.map);
    
    
    // Update Hazard Layer on Map
    updateMapHazard(map_map);
    
    // Create map Legends
    addLegendsToMap(map_map);
    map_map.addLegend("Social Deprivation Index", [
        ["1 SDI", "#ffffff"],
        ["|", ""],
        ["10 SDI", "#e38ffdBB"]
    ], {
        legend_id: "social_deprivation",
        visible: false,
        linear: true
    });

    // Create Region dropdown
    map_region_dropdown = new vlDropDown("map-region-dropdown");
    initializeRegionDropdown(map_region_dropdown, map_map);

    // Populate New Layer & Info Layer Popups
    populateNewLayerPopup("Built");
    populateInfoLayerPopup();
}

function openPageMap() {
    map_map.invalidateSize();

}
function closePageMap() {
    
}




function showAddLayerPopup() {
    if (map_assets_on_map.length < map_maximum_layers) {
        // Update Contents
        populateNewLayerPopup();
    
        // Show Popup
        map_new_layer_popup.show();
    }

}


function populateNewLayerPopup(new_domain = null) {

    if (new_domain) {
        map_new_layer_domain = new_domain;
    } else {
        new_domain = map_new_layer_domain;
    }

    // Select relevant button
    $(`#new-layer-domain-div>div`).removeClass('active');
    $(`#new-layer-domain-div .${new_domain.toLowerCase()}`).addClass('active');
    
    // Update HEader
    $(`#new-layer-popup .domain-heading-td`).html(`${new_domain} Domain Assets`);
    

    // Collect options, layers & groups
    var options = [];
    for (var asset_id in assets) {
        var asset = assets[asset_id];

        if (!asset.group) {
            // Not in a group, so add
            options.push(asset_id);
        } else if (!options.includes(asset.group)) {
            // Group is not yet added, so add
            options.push(asset.group);
        }
    }
    // Arrage alphabetically
    options.sort((x, y) => {
        if (x.toLowerCase() < y.toLowerCase()) {return -1;}
        if (x.toLowerCase() > y.toLowerCase()) {return 1;}
        return 0;
    });




    // Populate with layers
    var left_contents = '';
    var right_contents = '';
    var left_column_length = 0;
    var right_column_length = 0;
    var column = 0;
    var last_letter = ' ';
    for (var asset_id of options) {

        var is_group = Object.keys(asset_groups).includes(asset_id);
        console.log(asset_id, asset_groups);

        if (is_group) {
            // Store first asset in group as asset temporarily
            var asset = assets[asset_groups[asset_id][0]];
            var letter = asset_id[0].toLowerCase();
        } else {
            var asset = assets[asset_id];
            var letter = asset.display_name[0].toLowerCase();
        }
        
        if (!map_assets_on_map.includes(asset_id)) {
            // Asset is right type, and not already on the map
            var domain = capitalize(asset.domain);

            
    
            if (new_domain == domain) {
                
                var contents = '';
                if (letter != last_letter) {
                    contents += `
                    <div class="header">
                        ${letter.toUpperCase()}
                    </div>`;
                    last_letter = letter;
                    
                    // Determine which column to use, by which is smallest
                    if (right_column_length < left_column_length) {
                        column = 0;
                        right_column_length += 1;
                    } else {
                        column = 1;
                        left_column_length += 1;
                    }
                }
                



                if (!is_group) {
                    // Add a individual layer's html
                    
                    var shape = '';
                    if (asset.type == 'point') { shape = 'Pointer';
                    } else if (asset.type == 'polygon') { shape = 'Shape';
                    } else if (asset.type == 'polyline') { shape = 'Line';
                    }

                    contents += `
                    <div class="asset-item" onclick="addLayerToMap('${asset_id}')">
                        <img src="icons/Map-${shape}-Blue.svg" style="margin: 3px;height: 12px;width: 12px;" />
                        <div>
                            ${asset.display_name}
                        </div>
                    </div>`;

                } else {
                    // Add a group's html

                    var group_contents = ``;
                    for (var inner_asset_id of asset_groups[asset_id]) {
                        var inner_asset = assets[inner_asset_id];
                        
                        var shape = '';
                        if (inner_asset.type == 'point') { shape = 'Pointer';
                        } else if (inner_asset.type == 'polygon') { shape = 'Shape';
                        } else if (inner_asset.type == 'polyline') { shape = 'Line';
                        }

                        group_contents += `
                        <div class="asset-item" onclick="addLayerToMap('${inner_asset_id}')">
                            <img src="icons/Map-${shape}-Blue.svg" style="margin: 3px;height: 12px;width: 12px;" />
                            <div>
                                ${inner_asset.display_name}
                            </div>
                        </div>`;
                    }
                    

                    contents += `
                    <div data-value="${asset_id}" class="asset-group closed">
                        <div class="asset-item header" onclick="openNewAssetGroup('${asset_id}')">
                            ${asset_id}<span>(${asset_groups[asset_id].length} assets)</span>
                        </div>
                        <div class="asset-group-contents">
                            <div>
                                ${group_contents}
                            </div>
                        </div>
                    </div>`;
                }





                // Add to relevant column
                if (column) {
                    left_column_length += 1;
                    left_contents += contents;
                } else {
                    right_column_length += 1;
                    right_contents += contents;
                }
            }
        }
    }

    $(`#new-layer-popup .asset-list-td .asset-col`).first().html(left_contents);
    $(`#new-layer-popup .asset-list-td .asset-col`).last().html(right_contents);

}


function openNewAssetGroup(group_name) {
    $(`#new-layer-popup .asset-list-td .asset-group[data-value="${group_name}"]`).toggleClass('closed');
}


function populateInfoLayerPopup() {
    var contents = '';
    for (var asset_id in informative_assets) {
        var info_asset = informative_assets[asset_id];

        if (map_info_layer == null || asset_id != map_info_layer.id) {
            contents += `
            <div onclick="setInfoLayer('${asset_id}')">
                <div>
                    <img src="icons/Info-Circle-Grey.svg" style="height: 20px;width: 20px;" />
                </div>
                <div>
                    ${info_asset.display_name}
                </div>
            </div>
            `;
        }
    }
    if (map_info_layer != null) {
        contents += `
        <div onclick="setInfoLayer(null)" class="clear-layer">
            <div>
                Clear Information Layer
            </div>
        </div>
        `;
    }
    $(`#info-layer-popup .info-layer-list-td `).html(contents);
}

function setInfoLayer(asset_id) {
    map_info_layer_popup.hide();

    if (map_info_layer != null) {
        map_map.removeLayer(map_info_layer);
        map_info_layer = null;
        map_info_asset = null;
    }
    
    if (asset_id != null) {
        // Show Loading
        showLoading();

        // Add the informative layer
        var asset = informative_assets[asset_id];
        map_info_asset = asset;

        
        // Load Map Layer
        map_info_layer = map_map.loadTopoLayer(asset.file_name, mapMapInfoLayerStyle, 
            {
                hover: false
            });
        
        map_map.moveLayerToBack(map_info_layer);
        
        $(`#map-layer-item-info .name-td`).html(asset.display_name);
        $(`#map-layer-item-info`).removeClass('no-layer');

        // Show Legend
        map_map.showLegend('social_deprivation');

        // Hide Loading in a bit
        setTimeout(hideLoading, 500);

    } else {
        $(`#map-layer-item-info .name-td`).html("No Information Layer");
        $(`#map-layer-item-info`).addClass('no-layer');

        // Hide Legend
        map_map.hideLegend('social_deprivation');
    }
}

function removeLayerFromMap(asset_id) {
    map_assets_on_map.splice(map_assets_on_map.indexOf(asset_id), 1);

    // Remove from map
    map_map.removeLayer(map_asset_layers[asset_id]);
    delete map_asset_layers[asset_id];

    // Show + Icon
    if (map_assets_on_map.length < map_maximum_layers) {
        $(`#map-layer-add-button`).css('display', 'block');
        $(`#map-layer-cap`).css('display', 'none');
    }

    // Remove from overlay
    $(`#map-layer-item-${asset_id}`).remove();

    // If none left, hide asset legend
    if (map_assets_on_map.length == 0) map_map.hideLegend('vulnerability');
}


function addLayerToMap(asset_id) {
    var asset = assets[asset_id];
    var domain = capitalize(asset.domain);
    map_assets_on_map.push(asset_id);

    // Show Loading
    showLoading();

    // Show Legend
    map_map.showLegend('vulnerability');
    
    // Hide Popup
    map_new_layer_popup.hide();

    // Hide + Icon if maximum layers reached
    if (map_assets_on_map.length >= map_maximum_layers) {
        $(`#map-layer-add-button`).css('display', 'none');
        $(`#map-layer-cap`).css('display', 'block');
    }

    // Add to layers panel
    var layer_html = `
    <div class="map-layer-item" id="map-layer-item-${asset_id}">
      <table>
        <tr>
          <td class="color-td">
            
          </td>
          <!--<td class="handle-td">
            <img draggable="false" src="icons/Drag-Handle-Grey.svg"/>
          </td>-->
          <td class="icon-td">
            <img class="layer-icon" src="icons/${domain}-Tab-Grey.svg"/>
          </td>
          <td class="name-td">
            ${asset.display_name}
          </td>
          <td class="eye-td">
            <img class="layer-button" onclick="hideLayerFromMap('${asset_id}')" src="icons/Eye-Open-Grey.svg"/>
          </td>
          <td class="eye-closed-td">
            <img class="layer-button" onclick="showLayerOnMap('${asset_id}')" src="icons/Eye-Closed-Grey.svg"/>
          </td>
          <td class="x-td">
            <img class="layer-button" onclick="removeLayerFromMap('${asset_id}')" src="icons/x-Grey.svg"/>
          </td>
        </tr>
      </table>
    </div>`;

    $('#map-layer-overlay').append(layer_html);


    // Add layer to map
    var hazard_scenario = getHazardScenarioTif();
    var current_hazard = getHazard();
    vlQuickImport(asset.instances_file_name, 'csv', function (instances) {
        // Successfully loaded vulnerability data!
        
        map_relevant_instances[asset_id] = instances.filter(d => d.hazard_scenario == hazard_scenario && d.hazard_type == current_hazard);
        
        // Hide Loading in a bit
        setTimeout(hideLoading, 500);

        // Only continue if the asset hasn't been removed already
        if (map_assets_on_map.includes(asset_id)) {
            if (asset.type == "point") {
                // ASSET IS POINTS
                // Load Map Layer
                map_asset_layers[asset_id] = map_map.addMarkerLayer(asset.points, mapMapMarkerStyle, "lat", "lon",
                    {
                        hover: true,
                        hover_style: { radius: 12, weight: 8 },
                        onmouseover: mapMapOnMouseOver,
                        properties: {
                            asset_key: asset_id
                        },
                        pane: 'marker'
                    });
    
            } else {
                // ASSET IS EITHER POLYGON OR POLYLINE, MAKE TOPOLAYER
                // Difference between polygon & polyline
                if (asset.type == "polygon") { var relevant_style = {weight: 2.5};
                } else if (asset.type == "polyline") { var relevant_style = {weight: 6}
                }
                console.log(asset, relevant_style);
    
                // Load Map Layer
                map_asset_layers[asset_id] = map_map.loadTopoLayer(asset.file_name, (asset.type == 'polygon' ? mapMapTopoPolygonStyle : mapMapTopoPolylineStyle), 
                    {
                        hover: true,
                        hover_style: { opacity: 1, weight: relevant_style.weight * 1.4, fillOpacity: 0.5},
                        //not_hover_style: { opacity: 0.4, weight: relevant_style.weight * 0.6, fillOpacity: 0.1},
                        onmouseover: mapMapOnMouseOver,
                        properties: {
                            asset_key: asset_id
                        }
                    });
            }
        }
        
    });
    
}
function updateMapLayers() {
    // Updates the styles of the map layers to suit the current hazard

    for (var asset_id of map_assets_on_map) {
        updateMapLayer(asset_id);
    }
}
function updateMapLayer(asset_id) {
    // Updates this asset's map layer to suit the current hazard

    var asset = assets[asset_id];
    var layer_id = map_asset_layers[asset_id];
    var hazard_scenario = getHazardScenarioTif();
    var current_hazard = getHazard();

    // Load the new instances data for this layer
    vlQuickImport(asset.instances_file_name, 'csv', function (instances) {
        // Successfully loaded instances data!
                
        map_relevant_instances[asset_id] = instances.filter(d => d.hazard_scenario == hazard_scenario && d.hazard_type == current_hazard);

        var settings = map_map.getSettings(layer_id);

        if (settings.layer_type == 'topojson') {
            map_map.applySettings(layer_id, (asset.type == 'polygon' ? mapMapTopoPolygonStyle : mapMapTopoPolylineStyle));
        }
    });
}

function mapMapInfoLayerStyle(feature) {
    //var colors = ["#ffffff", "#fcecff", "#f8d8ff", "#f3c4ff", "#eeb0ff", "#e89cff", "#e187ff", "#da71ff", "#d259ff", "#c93cff", "#c000ff"];
    var colors = ["#ffffff", "#fdf4ff", "#fbe9ff", "#f9deff", "#f6d3ff", "#f3c8ff", "#f1bdfe", "#edb2fe", "#eaa6fe", "#e79bfd", "#e38ffd"];
    var color = colors[feature.properties.value]; // VALUE is 0-10
    if (!color) console.log(feature.properties)
    return {opacity: 0.02, fillColor: color, fillOpacity: 0.5, weight: 1, color: color}
}

function mapMapTopoPolygonStyle(feature) { return mapMapTopoStyle(feature, "polygon");
}
function mapMapTopoPolylineStyle(feature) { return mapMapTopoStyle(feature, "polyline");
}
function mapMapTopoStyle(feature, layer_type) {
    // STYLE FOR POLYGONS & POLYLINES
    var properties = feature.properties;
    var instance = map_relevant_instances[properties.asset_key].filter(d => d.asset_id == properties.asset_id)[0];
    
    // Difference between polygon & polyline
    if (layer_type == "polygon") {
        var relevant_style = {weight: 2.5};
    } else if (layer_type == "polyline") {
        var relevant_style = {weight: 5};
    }

    var color = reportAssetInstanceColor(instance);

    return { fillColor: color, weight: relevant_style.weight, color: color, opacity: 1, fillOpacity: 0.2};
}


function mapMapMarkerStyle(feature) {
    // STYLE FOR POINT
    var properties = feature.properties;
    var instance = map_relevant_instances[properties.asset_key].filter(d => d.asset_id == properties.asset_id)[0];

    var color = reportAssetInstanceColor(instance);

    return {radius: 4, fillColor: "#FFF", color: color, weight: 3, opacity: 1, fillOpacity: 1};
}


function mapMapOnMouseOver(hover_element, target, properties) {
    var instance = map_relevant_instances[properties.asset_key].filter(d => d.asset_id == properties.asset_id)[0];
    var asset = assets[properties.asset_key];

    var exposure_text = 'No Data';
    if (instance) {
        // If we have instance data for this instance...
        exposure_text = `${instance.exposure}cm of Exposure`;
    }

    var color = reportAssetInstanceColor(instance);

    hover_element.html(`
    <div class="vulnerability-highlight" style="background-color:${color}"></div>
    <table>
        <tr>
            <td class="header-td">
                <b>${asset.display_name}&nbsp;&nbsp;</b><span class="asset-id">#${properties.asset_id}</span>
            </td>
        </tr>
        <tr>
            <td>
                ${exposure_text}
            </td>
        </tr>
    </table>
    `);
}


function hideLayerFromMap(asset_key) {
    if (asset_key == 'info') {
        // Hiding the information layer, rather than a asset layer
        map_map.hideLayer(map_info_layer);
    } else {
        map_map.hideLayer(map_asset_layers[asset_key]);
    }

    // Switch the eye in layer
    $(`#map-layer-item-${asset_key} .eye-td`).css('display', 'none');
    $(`#map-layer-item-${asset_key} .eye-closed-td`).css('display', 'table-cell');
}


function showLayerOnMap(asset_key) {
    if (asset_key == 'info') {
        // Showing the information layer, rather than a asset layer
        map_map.showLayer(map_info_layer);
    } else {
        map_map.showLayer(map_asset_layers[asset_key]);
    }

    // Switch the eye in layer
    $(`#map-layer-item-${asset_key} .eye-td`).css('display', 'table-cell');
    $(`#map-layer-item-${asset_key} .eye-closed-td`).css('display', 'none');
}



function openInfoLayerPopup() {
    populateInfoLayerPopup();
    map_info_layer_popup.show();
}



