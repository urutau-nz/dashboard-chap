var map_map;
var map_region_dropdown;
var map_new_layer_domain = 'Built';
var map_maximum_layers = 4;

var map_assets_on_map = [];
var map_relevant_instances = {}; // Instances data by asset_id
var map_asset_layers = {}; // Layer ids by asset_id
var map_info_asset = null;
var map_info_layer = null;

var map_hover_info_type = 'asset'; // asset or informative


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
    map_map = new vlMap('map-map-div', {"attributionControl": false, inertia: false, center: [-43.530918, 172.636744], zoom: 11, minZoom : 10, zoomControl: false, worldCopyJump: true, crs: L.CRS.EPSG3857});
    map_map.basemap('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_nolabels/{z}/{x}/{y}.png',
                            {"detectRetina": false, "minZoom": 10,
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
    
    
    
    // Create map Legends
    addLegendsToMap(map_map);
    addInfoLegendsToMap(map_map);

    // Create Region dropdown
    map_region_dropdown = new vlDropDown("map-region-dropdown");
    initializeRegionDropdown(map_region_dropdown, map_map);

    // Populate New Layer & Info Layer Popups
    populateNewLayerPopup("Built");
    populateInfoLayerPopup();

    // Basemap init
    initializeBasemapSwitch('page-map', map_map);


    // Update Hazard Layer on Map
    updateMapHazard(map_map);
}

function openPageMap() {
    map_map.invalidateSize();

    // Update Hazard Layer on Map
    updateMapHazard(map_map);
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
    






    // Populate with layers
    var left_contents = '';
    var right_contents = '';
    var left_column_length = 0;
    var right_column_length = 0;
    var column = 0;
    var last_letter = ' ';
    for (var asset_id of groups_and_single_layers) {

        var is_group = Object.keys(asset_groups).includes(asset_id);

        if (is_group) {
            // Store first asset in group as asset temporarily
            var asset = assets[asset_groups[asset_id][0]];
            var letter = remove_risk_to(asset_id)[0].toLowerCase();
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
                            <div class="dropdown-arrow">
                                <img src="icons/Down-Arrow-Green.svg">
                            </div>
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
        map_map.hideLegend(map_info_asset.id);
        map_info_layer = null;
        map_info_asset = null;
    }
    
    if (asset_id != null) {
        // Show Loading
        showLoading();

        // Add the informative layer
        var asset = informative_assets[asset_id];
        map_info_asset = asset;

        // Determine Style & Color
        var layer_style = null;
        var layer_color = '';
        if (asset_id == 'social_deprivation') {
            layer_style = mapSDIInfoLayerStyle;
            layer_color = '#c573fd';

        } else if (asset_id == "liquefaction_risk") {
            layer_style = mapRiskInfoLayerStyle;
            layer_color = '#FFC000';

        } else if (["river_flood_extent_1_in_500", "tsunami_extent", "vertical_land_movement"].includes(asset_id)) {
            layer_style = {radius: 4, fillColor: "#222", color: "#000", weight: 1, opacity: 1, fillOpacity: 0.4};
            layer_color = '#222';

        } else {
            layer_style = {radius: 4, fillColor: "#FFC000", color: "#000", weight: 1, opacity: 1, fillOpacity: 0.4};
            layer_color = '#FFC000';
        }

        // Set layer color
        $(`#map-layer-overlay .map-layer-item#map-layer-item-info .color-td`).css('background-color', layer_color);
        $(`#map-map-div-tooltip .vulnerability-highlight`).css('background-color', layer_color);
        
        // Load Map Layer
        map_info_layer = map_map.loadTopoLayer(asset.file_name, layer_style, 
            {
                hover: map_hover_info_type == "informative",
                onmouseover: mapInformativeOnMouseOver,
                filter: function (d) {return d.properties.region == getCurrentRegion() || getCurrentRegionId() == 'all'}
            });
        
        map_map.moveLayerToBack(map_info_layer);
        
        $(`#map-layer-item-info .name-td`).html(asset.display_name);
        $(`#map-layer-item-info`).removeClass('no-layer');

        // Show Legend
        map_map.showLegend(asset.id);

        // Hide Loading in a bit
        setTimeout(hideLoading, 500);

    } else {
        $(`#map-layer-item-info .name-td`).html("No Information Layer");
        $(`#map-layer-item-info`).addClass('no-layer');
        $(`#map-layer-overlay .map-layer-item#map-layer-item-info .color-td`).css('background-color', '');
        $(`#map-map-div-tooltip .vulnerability-highlight`).css('background-color', '');
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
            <img class="layer-icon" src="icons/${domain}-Tab-Grey.png"/>
          </td>
          <td class="name-td">
            ${asset.display_name}
          </td>
          <td class="mouse-info-td ${map_hover_info_type == 'asset' ? '' : 'hide'}">
            <img class="layer-button" onclick="switchHoverInfo()" src="icons/Mouse-Info-Grey.svg">
          </td>
          <td class="no-mouse-info-td ${map_hover_info_type != 'asset' ? '' : 'hide'}">
            <img class="layer-button" onclick="switchHoverInfo()" src="icons/No-Mouse-Info-Grey.svg">
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
        var exposed_asset_ids = map_relevant_instances[asset_id].reduce((a, b) => {
            a.push(b.asset_id);
            return a;
        }, []);

        // Hide Loading in a bit
        setTimeout(hideLoading, 500);

        // Only continue if the asset hasn't been removed already
        if (map_assets_on_map.includes(asset_id)) {
            if (asset.type == "point") {
                // ASSET IS POINTS
                // Load Map Layer
                map_asset_layers[asset_id] = map_map.addMarkerLayer(asset.points, mapMapMarkerStyle, "lat", "lon",
                    {
                        hover: map_hover_info_type == "asset",
                        hover_style: { radius: 12, weight: 8 },
                        onmouseover: mapMapOnMouseOver,
                        filter: function(feature) { 
                            return (feature.properties.region == getCurrentRegionId() || getCurrentRegionId() == "all") &&
                                exposed_asset_ids.includes(feature.properties.asset_id); 
                        },
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
    
                // Load Map Layer
                map_asset_layers[asset_id] = map_map.loadTopoLayer(asset.file_name, (asset.type == 'polygon' ? mapMapTopoPolygonStyle : mapMapTopoPolylineStyle), 
                    {
                        hover: map_hover_info_type == "asset",
                        hover_style: { opacity: 1, weight: relevant_style.weight * 1.4, fillOpacity: 0.5},
                        //not_hover_style: { opacity: 0.4, weight: relevant_style.weight * 0.6, fillOpacity: 0.1},
                        onmouseover: mapMapOnMouseOver,
                        filter: function(feature) { 
                            return (feature.properties.region == getCurrentRegionId() || getCurrentRegionId() == "all") &&
                                exposed_asset_ids.includes(feature.properties.asset_id); 
                        },
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
        var exposed_asset_ids = map_relevant_instances[asset_id].reduce((a, b) => {
            a.push(b.asset_id);
            return a;
        }, []);

        map_map.applySettings(layer_id, {filter: function(feature) { 
            return (feature.properties.region == getCurrentRegionId() || getCurrentRegionId() == "all") &&
                exposed_asset_ids.includes(feature.properties.asset_id); 
        }});
    });
}

function mapSDIInfoLayerStyle(feature) {
    var colors = ["#ffffff", "#fdf4ff", "#fbe9ff", "#f9deff", "#f6d3ff", "#f3c8ff", "#f1bdfe", "#edb2fe", "#eaa6fe", "#e79bfd", "#e38ffd"];
    var color = colors[feature.properties.value]; // VALUE is 0-10
    //if (!color) console.log(feature.properties)
    return {opacity: 1, fillColor: color, fillOpacity: 0.5, weight: 1, color: '#000'}
}
function mapRiskInfoLayerStyle(feature) {
    var colors = {'high': '#ff0000', 'med': '#FF6000', 'low': '#FFC000'};
    var color = colors[feature.properties.value]; // VALUE is 0-10
    //if (!color) console.log(feature.properties)
    return {opacity: 1, fillColor: color, fillOpacity: 0.5, weight: 1, color: '#000'}
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

    var exposure_text = 'Asset Not Exposed';
    var icon_top = '';
    var icon_bottom = '';
    var description = '';
    if (instance) {
        // If we have instance data for this instance...
        if (getHazard() == 'erosion') {
            exposure_text = `${instance.exposure}% Likelihood of Exposure`;
        } else {
            exposure_text = `${instance.exposure}cm of Exposure`;
        }
        
        if (instance.show_inundation_icon == "True") {
            // Always top
            icon_top = `<img src="icons/Inundation-Grey.svg">`;

        } else if (instance.show_groundwater_icon == "True") {
            // Either top or bottom, depending on selected asset
            if (getHazard() == 'inundation') {
                // Top
                icon_top = `<img src="icons/Groundwater-Grey.svg">`;

            } else {
                // Bottom
                icon_bottom = `<img src="icons/Groundwater-Grey.svg">`;

            }

        } else if (instance.show_erosion_icon == "True") {
            // Always bottom
            icon_bottom = `<img src="icons/Erosion-Grey.svg">`;
        }

        // Add description 
        if (instance.hover_comment) {
            description = `
            <tr>
                <td class="description-td">
                    ${instance.hover_comment}
                </td>
            </tr>`;
        }
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
        ${description}
    </table>
    <div class="other-hazards-div">
        <div>${icon_top}</div>
        <div>${icon_bottom}</div>
    </div>
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


function switchHoverInfo() {
    // Swaps between onhover showing asset information, and informative layer information
    if (map_hover_info_type == "asset") {
        map_hover_info_type = "informative";

        for (var asset_id in map_asset_layers) {
            var layer_id = map_asset_layers[asset_id];

            map_map.applySettings(layer_id, {hover: false});
        }

        map_map.applySettings(map_info_layer, {hover: true});

    } else if (map_hover_info_type == "informative") {
        map_hover_info_type = "asset";

        for (var asset_id in map_asset_layers) {
            var layer_id = map_asset_layers[asset_id];

            map_map.applySettings(layer_id, {hover: true});
        }

        map_map.applySettings(map_info_layer, {hover: false});

    }
        
    // Switch the mouse info icon
    $(`.mouse-info-td`).toggleClass('hide');
    $(`.no-mouse-info-td`).toggleClass('hide');
}


function mapInformativeOnMouseOver(hover_element, target, properties) {

    var description = '';
    var exposure_text = '';

    exposure_text = properties.value;
    if (!exposure_text) exposure_text = '';

    var highlight_color = target.options.fillColor;
    
    hover_element.html(`
    <div class="vulnerability-highlight" style="background-color:${highlight_color}"></div>
    <table>
        <tr>
            <td class="header-td">
                <b>${map_info_asset.display_name}&nbsp;&nbsp;</b>
            </td>
        </tr>
        <tr>
            <td>
                ${exposure_text}
            </td>
        </tr>
        ${description}
    </table>
    `);
}


function addInfoLegendsToMap(given_map) {
    given_map.addLegend("Social Deprivation Index (2018)", [
        ["1 SDI", "#ffffff"],
        ["|", ""],
        ["10 SDI", "#e38ffdBB"]
    ], {
        legend_id: "social_deprivation",
        visible: false,
        linear: true
    });
    given_map.addLegend("Vertical Land Movement", [
        ["-4 mm/year", "#116496"],
        ["|", ""],
        ["+ 2mm/year", "#d69f7f"]
    ], {
        legend_id: "vertical_land_movement",
        visible: false,
        linear: true
    });
    given_map.addLegend("Sites of Cultural Significance (District Plan)", [
        ["Area", "#FFC000"]
    ], {
        legend_id: "cultural_significance",
        visible: false
    });
    given_map.addLegend("Sites of Ecological Significance (District Plan)", [
        ["Area", "#FFC000"]
    ], {
        legend_id: "Ecological_significance",
        visible: false
    });
    given_map.addLegend("Risk of Liquefaction", [
        ["High", "#ff0000"],
        ["Medium", "#FF6000"],
        ["Low", "#FFC000"]
    ], {
        legend_id: "liquefaction_risk",
        visible: false
    });
    given_map.addLegend("River Flooding Extent (1 in 500 year event)", [
        ["Flood extent", "#222"]
    ], {
        legend_id: "river_flood_extent_1_in_500",
        visible: false
    });
    given_map.addLegend("Tsunami Extent (District Plan)", [
        ["Tsunami extent", "#222"]
    ], {
        legend_id: "tsunami_extent",
        visible: false
    });
    given_map.addLegend("Soil Type", [
        ["Soil Description", "#FFC000"]
    ], {
        legend_id: "soil_type",
        visible: false
    });
}