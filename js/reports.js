
var report_asset_selected = null;

var report_map;
var report_map_asset_layer;
var report_domain_dropdown;
var report_region_dropdown;

var report_vulnerability_graphs = [];
var report_exposure_graph = null;

var report_relevant_instances = null; // Asset Instance data relevant to this asset, hazard & region

function initPageReports() {
    // Run on website open

    // Domain Dropdown
    report_domain_dropdown = new vlDropDown("report-domain-dropdown");
    report_domain_dropdown.populate([["any", "All Domains"], ["built", "Built Domain"], ["human", "Social Domain"], ["cultural", "Cultural Domain"], ["natural", "Natural Domain"]]);
    report_domain_dropdown.setOnChange(filterReportResults);
    


    // Create results list
    var contents = '';
    for (var asset_id of groups_and_single_layers) {

        var is_group = Object.keys(asset_groups).includes(asset_id);

        if (!is_group) {
            // Individual asset to add
            var asset = assets[asset_id];
    
            var domain = capitalize(asset.domain);
            var shape = '';
            if (asset.type == 'point') { shape = 'Pointer';
            } else if (asset.type == 'polygon') { shape = 'Shape';
            } else if (asset.type == 'polyline') { shape = 'Line';
            }
    
            contents += `<tr id="asset-result-${asset_id}"><td style="width:100%;">
                <table class="report-result result" onclick="openAssetReport('${asset_id}')">
                    <tr>
                        <td class="domain-td">
                            <img src="icons/${domain}-Tab.png" />
                        </td>
                        <td class="result-text">
                            ${asset.display_name}
                        </td>
                        <td class="type-td">
                        <img src="icons/Map-${shape}-Blue.svg" />
                        </td>
                    </tr>
                </table>
            </td></tr>`;
        } else {
            // A group to add

            var group_contents = ``;
            for (var inner_asset_id of asset_groups[asset_id]) {
                var inner_asset = assets[inner_asset_id];
                var domain = capitalize(inner_asset.domain);
                
                var shape = '';
                if (inner_asset.type == 'point') { shape = 'Pointer';
                } else if (inner_asset.type == 'polygon') { shape = 'Shape';
                } else if (inner_asset.type == 'polyline') { shape = 'Line';
                }

                group_contents += `
                <table class="report-result result" onclick="openAssetReport('${inner_asset_id}')">
                    <tr>
                        <td class="domain-td">
                            <img src="icons/${domain}-Tab.png" />
                        </td>
                        <td class="result-text">
                            ${inner_asset.display_name}
                        </td>
                        <td class="type-td">
                        <img src="icons/Map-${shape}-Blue.svg" />
                        </td>
                    </tr>
                </table>`;
            }
            

            contents += `<tr class="result-group-tr" data-value="${asset_id}"><td style="width:100%;" class="result-group" data-value="${asset_id}">
                <div class="report-result-group">
                    <table class="report-result group-header" onclick="toggleAssetReportGroup('${asset_id}')">
                        <tr>
                            <td class="result-text">
                                <span class="text-span">${asset_id}</span>
                                <div class="dropdown-arrow">
                                    <img src="icons/Down-Arrow-Green.svg">
                                </div>
                            </td>
                        </tr>
                    </table>
                    <div class="group-contents">
                        ${group_contents}
                    </div>
                </td></tr>`;

        }
    }
    $("#report-menu-results-table").html(`${contents}`)

    // Trigger Filtering when typing in search box
    $("#report-searchbar").on('input', filterReportResults);

    // Create Report Map
    report_map = new vlMap('reports-map-div', {"attributionControl": false, center: [-43.530918, 172.636744], zoom: 11, minZoom : 4, zoomControl: false, worldCopyJump: true, crs: L.CRS.EPSG3857});
    report_map.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_nolabels/{z}/{x}/{y}.png',
                            {"attributionControl": false, "detectRetina": false, "minZoom": 4,
                            "noWrap": false, "subdomains": "abc"});
    
    report_map.createPane('labels', 650);
    report_map.getPane('labels').style.pointerEvents = 'none';

    report_map.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_only_labels/{z}/{x}/{y}{r}.png',
                {pane: 'labels'});
    
    // Update Hazard Layer on Map
    updateMapHazard(report_map);

    // Add map zoom controls
    var zoom = L.control.zoom({
        zoomInText: '+',
        zoomOutText: '-',
        position: 'bottomleft'
        });
    zoom.addTo(report_map.map);

    
    // Create Report Vulnerability Graphs
    var low_graph = new vlCircleBar("report-vulnerability-graph1", "Low<br>Vulnerability",
                611, 1000, "#32b888", "ASSETS");
    report_vulnerability_graphs.push(low_graph)

    var medium_graph = new vlCircleBar("report-vulnerability-graph2", "Medium<br>Vulnerability",
                376, 1000, "#db7900", "ASSETS");
    report_vulnerability_graphs.push(medium_graph)
    
    var high_graph = new vlCircleBar("report-vulnerability-graph3", "High<br>Vulnerability",
                123, 1000, "#c94040", "ASSETS");
    report_vulnerability_graphs.push(high_graph)


    // Create exposure Graph
    report_exposure_graph = new vlGraph("report-exposure-graph", [], 'exposure', 'cumsum');
    report_exposure_graph.x_axis_label("X Axis Placeholder");
    report_exposure_graph.x_axis_adjust(3);
    report_exposure_graph.y_axis_label("Y Axis Placeholder");
    report_exposure_graph.y_axis_adjust(2);
    report_exposure_graph.margin_top(20);
    report_exposure_graph.margin_right(25);
    report_exposure_graph.margin_left(35);
    report_exposure_graph.margin_bottom(50);
    report_exposure_graph.font_size(13);
    report_exposure_graph.y_suffix(" Unit");
    report_exposure_graph.colors(['#51daed']);
    report_exposure_graph.x_ticks(7);
    report_exposure_graph.line_width(2);
    report_exposure_graph.y_tick_size(1);
    report_exposure_graph.x_tick_size(3);
    report_exposure_graph.y_outer_tick_size(0);
    report_exposure_graph.x_outer_tick_size(0);
    report_exposure_graph.dots(false);


    // Create map Legends
    addLegendsToMap(report_map);

    // Create Region dropdown
    report_region_dropdown = new vlDropDown("report-map-region-dropdown");
    initializeRegionDropdown(report_region_dropdown, report_map);

}
function openPageReports() {
    report_map.invalidateSize();
}
function closePageReports() {
    
}



function toggleAssetReportGroup(group_name) {
    $(`#report-menu-results-table .result-group[data-value="${group_name}"]`).toggleClass('active');
}

function filterReportResults() {
    var search_term = $("#report-searchbar").val().toLowerCase();
    var domain = report_domain_dropdown.value.toLowerCase();
    console.log(domain, search_term);

    
    for (var asset_id of groups_and_single_layers) {
        var is_group = Object.keys(asset_groups).includes(asset_id);


        if (is_group) {
            var asset = assets[asset_groups[asset_id][0]];
            var matching_value = asset_id;
            var list_item = $(`#report-menu-results-table .result-group-tr[data-value="${asset_id}"]`);
            var text_item = list_item.find(".group-header .result-text .text-span");
        } else {
            var asset = assets[asset_id];
            var matching_value = asset.display_name;
            var list_item = $("#asset-result-" + asset_id);
            var text_item = list_item.find(".result-text");
        }

        // Hide if not matching criteria
        list_item.css("display", "none");
        if (search_term.length == 0 || matching_value.toLowerCase().includes(search_term)) {
            if (domain == 'any' || asset.domain.toLowerCase() == domain) {
                // Matches Criteria! Show it
                list_item.css("display", "");
                
                // If there's a search term, highlight matching text
                var result_text = "";
                var dn = matching_value;
                if (search_term.length > 0) {
                    var term_index = dn.toLowerCase().indexOf(search_term);
                    result_text += dn.slice(0, term_index);
                    result_text += '<span style="background-color:#ffdecbdd;">';
                    result_text += dn.slice(term_index, term_index + search_term.length);
                    result_text += '</span>';
                    result_text += dn.slice(term_index + search_term.length);
                } else {
                    result_text = matching_value;
                }
                text_item.html(result_text);
            }
        }

    }
}


function halfBoldenText(text) {
    // Emboldens the latter half of a given sentence. Used for asset report headers.

    var midpoint = text.length / 2;
    var closest_value = text.length ** 2;
    var closest_index = null; // This iterates over the text, finding the whitespace closest to it's centre.
    for (var i = 0; i < text.length; i++) {
        var char = text[i];
        if (char == ' ' && (i - midpoint) ** 2 < closest_value) {
            closest_value = (i - midpoint) ** 2;
            closest_index = i;
        }
    }
    var out;
    if (closest_index != null) {
        // if there was a space found, separate by closest_index
        out = '<div>' + text.slice(0, closest_index) + 
                '&nbsp;</div><div style="font-weight: 700">' + text.slice(closest_index+1) + '</div>';
    } else {
        // otherwise, make it all bold
        out = '<span style="font-weight: 700">' + text + '</span>';
    }
    
    return out;
}



function reportMapOnMouseOver(hover_element, target, properties) {
    var instance = report_relevant_instances.filter(d => d.asset_id == properties.asset_id)[0];
    var asset = report_asset_selected;
    
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

function reportAssetInstanceColor(instance) {
    // Colors individual asset instances by their instance data
    if (instance) {
        // Determine color by vulnerability (in future! TODO)
        if (instance.vulnerability == "high") {
            var color = "#c94040"; // RED
        } else if (instance.vulnerability == "medium") {
            var color = "#db7900"; // ORANGE
        } else if (instance.vulnerability == "low") {
            var color = "#32b888"; // GREEN
        } else {
            var color = "#666"; // GREY - unknown vulnerability
        }
    } else {
        // There's no instance data for this instance.
            var color = "#BBB"; // DARK GREY - no provided value
    }
    return color;
}

function reportMapTopoPolygonStyle(feature) { return reportMapTopoStyle(feature, "polygon");
}
function reportMapTopoPolylineStyle(feature) { return reportMapTopoStyle(feature, "polyline");
}
function reportMapTopoStyle(feature, layer_type) {
    // STYLE FOR POLYGONS & POLYLINES
    var properties = feature.properties;
    var instance = report_relevant_instances.filter(d => d.asset_id == properties.asset_id)[0];
    
    // Difference between polygon & polyline
    if (layer_type == "polygon") {
        var relevant_style = {weight: 2.5};
    } else if (layer_type == "polyline") {
        var relevant_style = {weight: 5};
    }

    var color = reportAssetInstanceColor(instance);

    return { fillColor: color, weight: relevant_style.weight, color: color, opacity: 1, fillOpacity: 0.2};
}


function reportMapMarkerStyle(feature) {
    // STYLE FOR POINT
    var properties = feature.properties;
    var instance = report_relevant_instances.filter(d => d.asset_id == properties.asset_id)[0];

    var color = reportAssetInstanceColor(instance);

    return {radius: 4, fillColor: "#FFF", color: color, weight: 3, opacity: 1, fillOpacity: 1};
}



function openAssetReport(asset_id) {
    // Ran on click when a choice is made in the reports menu
    showLoading();
    
    // Show legend
    report_map.showLegend('vulnerability');

    // Update global variable
    report_asset_selected = assets[asset_id];

    // Hide Report Menu, show report report
    $("#reports-menu-table").css("display", "none");
    $("#reports-report-table").css("display", "table");


    // Fill in Title
    var title = halfBoldenText(report_asset_selected.display_name.toUpperCase());
    
    $("#reports-report-table .asset-display-name").html(title);

    
    // Edit Vulnerability Graphs
    report_vulnerability_graphs[0].max_value = 1;
    report_vulnerability_graphs[1].max_value = 1;
    report_vulnerability_graphs[2].max_value = 1;
    report_vulnerability_graphs[0].value = 0;
    report_vulnerability_graphs[1].value = 0;
    report_vulnerability_graphs[2].value = 0;
    report_vulnerability_graphs[0].graph();
    report_vulnerability_graphs[1].graph();
    report_vulnerability_graphs[2].graph();


    // Clear Exposure Graph
    //report_exposure_graph.setData([], 'exposure', 'cumsum');
    //report_exposure_graph.areaGraph();

    // Import & Update Exposure Graph
    var hazard_scenario = getHazardScenarioTif();
    var current_region = getCurrentRegionId();
    var exposure_filename = `${import_url}/data/report_data/${asset_id}/${asset_id}-${hazard_scenario}-${current_region}.csv`;
    vlQuickImport(exposure_filename, 'csv', function (d) {
        report_exposure_graph.setData(d, 'exposure', 'cumsum');
        if (d[0]) {
            report_exposure_graph.y_axis_label(d[0].ylabel);
            report_exposure_graph.x_axis_label(d[0].xlabel);
            report_exposure_graph.y_suffix(d[0].unit);
            report_exposure_graph.x_suffix((getHazard() == 'erosion' ? '% Likelihood' : 'cm'));
        }
        report_exposure_graph.colors(['#61a1d6']);
        report_exposure_graph.areaGraph();
    });


    // Load Asset Instance Data (per-asset-id data)    and then make map
    var current_hazard = getHazard();
    vlQuickImport(report_asset_selected.instances_file_name, 'csv', function (instances) {
        // Successfully loaded vulnerability data!

        // remove last one, if it exists
        report_map.removeLayer(report_map_asset_layer);
        
        report_relevant_instances = instances.filter(d => d.hazard_scenario == hazard_scenario && d.hazard_type == current_hazard);
        
        // Update the vulnerability graphs to these instances
        var max_value = 0;
        var low_count = 0;
        var med_count = 0;
        var high_count = 0;
        var has_data = true;
        for (var instance of report_relevant_instances) {
            if (instance.vulnerability == 0) {
                has_data = false;

            } else if (instance.vulnerability == 'low') {
                max_value += 1;
                low_count += 1;

            } else if (instance.vulnerability == 'medium') {
                max_value += 1;
                med_count += 1;

            } else if (instance.vulnerability == 'high') {
                max_value += 1;
                high_count += 1;

            }
        }
        if (has_data) {
            report_vulnerability_graphs[0].max_value = max_value;
            report_vulnerability_graphs[1].max_value = max_value;
            report_vulnerability_graphs[2].max_value = max_value;
            report_vulnerability_graphs[0].value = low_count;
            report_vulnerability_graphs[1].value = med_count;
            report_vulnerability_graphs[2].value = high_count;
            report_vulnerability_graphs[0].graph();
            report_vulnerability_graphs[1].graph();
            report_vulnerability_graphs[2].graph();
        }


        // Hide Loading in a bit
        setTimeout(hideLoading, 500);

        if (report_asset_selected.type == "point") {
            // ASSET IS POINTS
            // Load Map Layer
            report_map_asset_layer = report_map.addMarkerLayer(report_asset_selected.points, reportMapMarkerStyle, "lat", "lon",
                {
                    hover: true,
                    hover_style: { radius: 12, weight: 8 },
                    onmouseover: reportMapOnMouseOver,
                    filter: function(feature) { console.log(feature); return feature.properties.region == getCurrentRegionId() || getCurrentRegionId() == "all"; }
                });

        } else {
            // ASSET IS EITHER POLYGON OR POLYLINE, MAKE TOPOLAYER
            // Difference between polygon & polyline
            if (report_asset_selected.type == "polygon") { var relevant_style = {weight: 2.5};
            } else if (report_asset_selected.type == "polyline") { var relevant_style = {weight: 6}
            }

            // Load Map Layer
            report_map_asset_layer = report_map.loadTopoLayer(report_asset_selected.file_name, (report_asset_selected.type == 'polygon' ? reportMapTopoPolygonStyle : reportMapTopoPolylineStyle), 
                {
                    hover: true,
                    hover_style: { opacity: 1, weight: relevant_style.weight * 1.4, fillOpacity: 0.5},
                    not_hover_style: { opacity: 0.4, weight: relevant_style.weight * 0.6, fillOpacity: 0.1},
                    onmouseover: reportMapOnMouseOver,
                    filter: function(feature) { return feature.properties.region == getCurrentRegionId() || getCurrentRegionId() == "all"; }
                });
        }
        
    });




    // Fill in report text
    var report = asset_descriptions.filter(d => d.asset_tag == asset_id && d.hazard_type == getHazard())[0];

    if (report) {
        $("#report-exposure-text1").html(report.exposure_text_1);
        $("#report-exposure-text2").html(report.exposure_text_2);
        $("#report-vulnerability-text1").html(report.vulnerability_text_1);
        $("#report-vulnerability-text2").html(report.vulnerability_text_low);
        $("#report-vulnerability-text3").html(report.vulnerability_text_medium);
        $("#report-vulnerability-text4").html(report.vulnerability_text_high);
        $("#report-uncertainty-text1").html(report.uncertainty_text_1);
        $("#report-uncertainty-text2").html(report.uncertainty_text_2);
        $("#report-data-source-text1").html(report.data_source_text_1);
        $("#report-data-source-text2").html(report.data_source_text_2);
    }

}



function closeAssetReport() {
    // Ran on click when returning from a asset report

    report_asset_selected = null;// Update global variable

    // Show Report Menu, hide report report
    $("#reports-report-table").css("display", "none");
    $("#reports-menu-table").css("display", "table");

    report_map.removeLayer(report_map_asset_layer);

    // Hide legend
    report_map.hideLegend('vulnerability');
}