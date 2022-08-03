
var report_asset_selected = null;

var report_map;
var report_map_asset_layer;
var report_domain_dropdown;
var report_graphs;
var report_graph_dropdown;
var report_region_dropdown;

var report_vulnerability_chart = null;
var report_exposure_graph = null;

var report_relevant_instances = null; // Asset Instance data relevant to this asset, hazard & region

function initPageReports() {
    // Run on website open

    // Domain Dropdown
    report_domain_dropdown = new vlDropDown("report-domain-dropdown");
    report_domain_dropdown.populate([["any", "All Domains"], ["built", "Built Domain"], ["human", "Social Domain"], ["cultural", "Cultural Domain"], ["natural", "Natural Domain"]]);
    report_domain_dropdown.setOnChange(filterReportResults);
    
    // Graph Dropdown
    report_graphs = [["report-exposure-graph", "Asset Exposure"], ["report-exposure-graph2", "Graph Two (pending)"], ["report-exposure-graph3", "Graph Three (pending)"]];
    report_graph_dropdown = new vlDropDown("report-graph-dropdown");
    report_graph_dropdown.populate(report_graphs);
    report_graph_dropdown.setOnChange(function(value_code) {
        for (var report_graph of report_graphs) {
            var report_graph_code = report_graph[0];
            $("#" + report_graph_code).addClass('hide');
        }
        $("#" + value_code).removeClass('hide');
    });

    // Create results list
    var contents = '';
    var last_is_group = false;
    var last_domain = '';
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

            if (last_domain != domain) {
                var display_domain = (domain == 'Human' ? 'Social': domain);
                contents += `<tr class="domain-header-tr" data-value="${domain}"><td style="width:100%;">
                    <div>${display_domain} Domain</div>
                </td></tr>`;

                last_domain = domain;
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

            var inner_domain = capitalize(assets[asset_groups[asset_id][0]].domain);
            if (last_domain != inner_domain) {
                var display_domain = (inner_domain == 'Human' ? 'Social': inner_domain);
                contents += `<tr class="domain-header-tr" data-value="${inner_domain}"><td style="width:100%;">
                    <div>${display_domain} Domain</div>
                </td></tr>`;
                
                last_domain = inner_domain;
            }

            var group_contents = ``;
            var contents_summary = '';
            for (var inner_asset_id of asset_groups[asset_id]) {
                var inner_asset = assets[inner_asset_id];
                var domain = capitalize(inner_asset.domain);
                
                var shape = '';
                if (inner_asset.type == 'point') { shape = 'Pointer';
                } else if (inner_asset.type == 'polygon') { shape = 'Shape';
                } else if (inner_asset.type == 'polyline') { shape = 'Line';
                }

                group_contents += `
                <table id="asset-result-${inner_asset_id}" class="report-result result" onclick="openAssetReport('${inner_asset_id}')">
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

                if (contents_summary.length < 60) {
                    if (contents_summary.length > 0) contents_summary += ', ';
                    var name = inner_asset.display_name;
                    if (contents_summary.length + name.length >= 60) {
                        name = name.slice(0, 60 - contents_summary.length) + '...';
                    }
                    contents_summary += name;
                } else if (!contents_summary.endsWith('...')) {
                    contents_summary += ', ...';
                }
            }
            contents_summary = '&#9495;&nbsp;&nbsp;' + contents_summary;
            

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
                        <tr>
                            <td class="result-group-summary">
                                ${contents_summary}
                            </td>
                        </tr>
                    </table>
                    <div class="group-contents">
                        ${group_contents}
                    </div>
                </td></tr>`;

        }


        last_is_group = is_group;
    }
    $("#report-menu-results-table").html(`${contents}`)

    // Trigger Filtering when typing in search box
    $("#report-searchbar").on('input', filterReportResults);

    // Create Report Map
    report_map = new vlMap('reports-map-div', {"attributionControl": false, inertia: false,  center: [-43.530918, 172.636744], zoom: 11, minZoom : 10, zoomControl: false, worldCopyJump: true, crs: L.CRS.EPSG3857});
    report_map.basemap('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_nolabels/{z}/{x}/{y}.png',
                            {"detectRetina": false, "minZoom": 10,
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

    

    // Create vulnerability chart
    report_vulnerability_chart = new vlPieChart('report-vulnerability-graph1', '', [], ['#666', '#FFC000', '#FF6000', '#ff0000', '#fa74ff']);


    // Create exposure Graph
    report_exposure_graph = new vlGraph("report-exposure-graph", [], 'exposure', 'cumsum');
    report_exposure_graph.x_axis_label("X Axis Placeholder");
    report_exposure_graph.x_axis_adjust(3);
    report_exposure_graph.y_axis_label("Y Axis Placeholder");
    report_exposure_graph.y_axis_adjust(2);
    report_exposure_graph.margin_top(50);
    report_exposure_graph.margin_right(25);
    report_exposure_graph.margin_left(35);
    report_exposure_graph.margin_bottom(50);
    report_exposure_graph.font_size(13);
    report_exposure_graph.y_suffix(" Unit");
    report_exposure_graph.x_ticks(7);
    report_exposure_graph.line_width(2);
    report_exposure_graph.y_tick_size(1);
    report_exposure_graph.x_tick_size(3);
    report_exposure_graph.y_outer_tick_size(0);
    report_exposure_graph.x_outer_tick_size(0);
    report_exposure_graph.dots(false);
    report_exposure_graph.title('Title Placeholder')


    // Create map Legends
    addLegendsToMap(report_map);

    // Create Region dropdown
    report_region_dropdown = new vlDropDown("report-map-region-dropdown");
    initializeRegionDropdown(report_region_dropdown, report_map);

    // Basemap init
    initializeBasemapSwitch('page-reports', report_map);
}
function openPageReports() {
    report_map.invalidateSize();
}
function closePageReports() {
    
}



function toggleAssetReportGroup(group_name) {
    $(`#report-menu-results-table .result-group[data-value="${group_name}"]`).toggleClass('active');
}
function openAssetReportGroup(group_name) {
    $(`#report-menu-results-table .result-group[data-value="${group_name}"]`).addClass('active');
}
function closeAssetReportGroup(group_name) {
    $(`#report-menu-results-table .result-group[data-value="${group_name}"]`).removeClass('active');
}


function matchesSearchTerm(search_term, item_text) { return search_term.length == 0 || item_text.toLowerCase().includes(search_term.toLowerCase()) }
function highlightMatchingText(search_term, item_text) {
    if (search_term.length > 0) {
        var term_index = item_text.toLowerCase().indexOf(search_term);
        var result_text = item_text.slice(0, term_index);
        result_text += '<span style="background-color:#3e76913b;">';
        result_text += item_text.slice(term_index, term_index + search_term.length);
        result_text += '</span>';
        result_text += item_text.slice(term_index + search_term.length);
        return result_text;
    } else {
        return item_text;
    }
}
function filterReportResults() {
    var search_term = $("#report-searchbar").val().toLowerCase();
    var domain = report_domain_dropdown.value.toLowerCase();

    // Hide all domain headers
    $(`#report-menu-results-table .domain-header-tr`).addClass('hide');
    
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
        list_item.addClass("hide");
        if (matchesSearchTerm(search_term, matching_value)) {
            if (domain == 'any' || asset.domain.toLowerCase() == domain) {
                // Matches Criteria! Show it
                list_item.removeClass("hide");
                $(`#report-menu-results-table .domain-header-tr[data-value="${capitalize(asset.domain)}"]`).removeClass('hide');
                
                // If there's a search term, highlight matching text
                var result_text = highlightMatchingText(search_term, matching_value);

                text_item.html(result_text);

                //Show all contents, if a group
                if (is_group) {
                    list_item.find('table').removeClass("hide");

                    closeAssetReportGroup(asset_id);

                    //Remove highlights from contents too
                    for (var inner_asset_id of asset_groups[asset_id]) {
                        var inner_text_item = $("#asset-result-" + inner_asset_id + " .result-text");
                        inner_text_item.html(assets[inner_asset_id].display_name);
                    }
                }
            }
        } else if (is_group) {
            // Group's title doesn't match, so check contents

            for (var inner_asset_id of asset_groups[asset_id]) {
                var inner_asset = assets[inner_asset_id];
                var inner_matching_value = inner_asset.display_name;
                var inner_list_item = $("#asset-result-" + inner_asset_id);
                var inner_text_item = inner_list_item.find(".result-text");

                inner_list_item.addClass("hide");
                if (matchesSearchTerm(search_term, inner_matching_value)) {
                    if (domain == 'any' || inner_asset.domain.toLowerCase() == domain) {
                        // Matches Criteria! Show it AND group
                        list_item.removeClass("hide");
                        inner_list_item.removeClass("hide");
                        $(`#report-menu-results-table .domain-header-tr[data-value="${capitalize(asset.domain)}"]`).removeClass('hide');

                        // Open the group to show contents, clear highlights from group title
                        openAssetReportGroup(asset_id);
                        text_item.html(matching_value);

                        var result_text = highlightMatchingText(search_term, inner_matching_value);
        
                        inner_text_item.html(result_text);
                    }
                }
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
            var color = "#FF0000"; // RED
        } else if (instance.vulnerability == "medium") {
            var color = "#FF6000"; // ORANGE
        } else if (instance.vulnerability == "low") {
            var color = "#FFC000"; // GREEN
        } else if (instance.vulnerability == "Potentially Vulnerable") {
            var color = "#fa74ff"; // PINK
        } else {
            var color = "#666"; // DARK GREY - unknown vulnerability
        }
    } else {
        // There's no instance data for this instance.
            var color = "#BBB"; // GREY - no provided value
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

    //Change icons
    //Cultural-Tab-Colour
    var icon_url = "icons/" + capitalize(report_asset_selected.domain) + "-Tab-Colour.png";
    $('#reports-report-table .vulnerability-asset-type-icon').attr('src', icon_url);

    //Title the graph, capitalising each word
    var words = report_asset_selected.name.split(" ");
    for (let i = 0; i < words.length; i++) {
        words[i] = words[i][0].toUpperCase() + words[i].substr(1);
    }
    var asset_title = words.join(" ");
    //If the asset name ends with Exposure, don't use the word twice.
    if(!asset_title.endsWith("Exposure")) asset_title += " Exposure";
    var graph_title = asset_title + " to " + capitalize(getHazard());
    report_exposure_graph.title(graph_title);
    
    // Edit Vulnerability Graphs
    report_vulnerability_chart.values = [];
    report_vulnerability_chart.graph();


    // Clear Exposure Graph
    //report_exposure_graph.setData([], 'exposure', 'cumsum');
    //report_exposure_graph.areaGraph();


    //Import for debugging only
    //vlQuickImport(`${import_url}/data/non-study-area.json`, 'json', function (d) {return;});

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
            report_exposure_graph.watermark('');
            report_exposure_graph.x_suffix((getHazard() == 'erosion' ? '% Likelihood' : 'cm'));
        } else {
            report_exposure_graph.watermark(`No Assets Exposed`);
        }
        report_exposure_graph.colors(['#61a1d6']);
        report_exposure_graph.areaGraph();
    }, function (d) {
        report_exposure_graph.setData([], 'exposure', 'cumsum');
        report_exposure_graph.watermark('No Data');
        report_exposure_graph.areaGraph();
    });

    //Clear vulnerability lines to allow prepend / append to work appropriately
    $("#report-vulnerability-result1").html('');
    $("#report-vulnerability-result2").html('');
    $("#report-vulnerability-result3").html('');
    $("#report-vulnerability-result4").html('');

    // Load Asset Instance Data (per-asset-id data)    and then make map
    var current_hazard = getHazard();
    vlQuickImport(report_asset_selected.instances_file_name, 'csv', function (instances) {
        // Successfully loaded vulnerability data!

        // remove last one, if it exists
        report_map.removeLayer(report_map_asset_layer);
        
        report_relevant_instances = instances.filter(d => d.hazard_scenario == hazard_scenario && d.hazard_type == current_hazard);
        var exposed_asset_ids = report_relevant_instances.reduce((a, b) => {
            a.push(b.asset_id);
            return a;
        }, []);

        // Update the vulnerability graphs to these instances
        var any_vulnerability_count = 0;
        var low_vulnerability_count = 0;
        var med_vulnerability_count = 0;
        var high_vulnerability_count = 0;
        var potential_vulnerability_count = 0;
        var unspecified_vulnerability_count = 0;
        var num_instances = report_relevant_instances.length;
        var has_data = true;
        for (var instance of report_relevant_instances) {
            if (instance.vulnerability == 0) {
                has_data = false;
                unspecified_vulnerability_count += 1;
            } else if (instance.vulnerability == 'low') {
                any_vulnerability_count += 1;
                low_vulnerability_count += 1;

            } else if (instance.vulnerability == 'medium') {
                any_vulnerability_count += 1;
                med_vulnerability_count += 1;

            } else if (instance.vulnerability == 'high') {
                any_vulnerability_count += 1;
                high_vulnerability_count += 1;

            } else if (instance.vulnerability == 'Potentially Vulnerable') {
                any_vulnerability_count += 1;
                potential_vulnerability_count += 1;

            }
        }
        if (any_vulnerability_count + unspecified_vulnerability_count > 0) {
            report_vulnerability_chart.values = [unspecified_vulnerability_count, low_vulnerability_count, med_vulnerability_count, high_vulnerability_count, potential_vulnerability_count];
            report_vulnerability_chart.graph();
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
                    filter: function(feature) { 
                        return (feature.properties.region == getCurrentRegionId() || getCurrentRegionId() == "all") &&
                        exposed_asset_ids.includes(feature.properties.asset_id); 
                    }
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
                    filter: function(feature) { 
                        return (feature.properties.region == getCurrentRegionId() || getCurrentRegionId() == "all") &&
                        exposed_asset_ids.includes(feature.properties.asset_id); 
                    }
                });
        }


        // Change risk level texts
        // (that's the stuff that says: 0 assets are classed as low vulnerability.)
        // var exposure_text_3 = `${report_asset_selected.name}: <b>${any_vulnerability_count}</b> assets out of <b>${num_instances}</b> are exposed.`;
        // $("#report-exposure-text3").html(exposure_text_3);

        // var low_text = `<b>${low_vulnerability_count}</b> assets are classed as <b>low</b> vulnerability.`
        // $("#report-vulnerability-result1").prepend(low_text);

        // var med_text = `<b>${med_vulnerability_count}</b> assets are classed as <b>medium</b> vulnerability.`
        // $("#report-vulnerability-result2").prepend(med_text);

        // var high_text = `<b>${high_vulnerability_count}</b> assets are classed as <b>high</b> vulnerability.`
        // $("#report-vulnerability-result3").prepend(high_text);

        // var unspecified_text = `<b>${unspecified_vulnerability_count}</b> assets are classed as <b>unspecified</b> vulnerability.`
        // $("#report-vulnerability-result4").prepend(unspecified_text);

    });




    // Fill in report text
    var report = asset_descriptions.filter(d => d.asset_tag == asset_id && d.hazard_type == getHazard())[0];

    var vulnerability_help_icon = `<img src="icons/QMark-Dot-Black.svg" class="vulnerability-help-icon">`;
    $("#report-vulnerability-result1").append(vulnerability_help_icon);
    $("#report-vulnerability-result2").append(vulnerability_help_icon);
    $("#report-vulnerability-result3").append(vulnerability_help_icon);
    $("#report-vulnerability-result5").append(vulnerability_help_icon);
    $("#report-vulnerability-result4").append(vulnerability_help_icon);

    $("#report-vulnerability-result1").append(`<div id="report-vulnerability-result1-tooltip" class="vl-map-tooltip" style="text-align: center; width: 100%; top: 45px; left: 10px; font-family: 'Source Sans Pro', sans-serif;">
    <div class="vulnerability-highlight" style="background-color:#FFC000"></div></div>`);
    $("#report-vulnerability-result2").append(`<div id="report-vulnerability-result2-tooltip" class="vl-map-tooltip" style="text-align: center; width: 100%; top: 45px; left: 10px; font-family: 'Source Sans Pro', sans-serif;">
    <div class="vulnerability-highlight" style="background-color:#FF6000"></div></div>`);
    $("#report-vulnerability-result3").append(`<div id="report-vulnerability-result3-tooltip" class="vl-map-tooltip" style="text-align: center; width: 100%; top: 45px; left: 10px; font-family: 'Source Sans Pro', sans-serif;">
    <div class="vulnerability-highlight" style="background-color:#ff0000"></div></div>`);
    $("#report-vulnerability-result5").append(`<div id="report-vulnerability-result5-tooltip" class="vl-map-tooltip" style="text-align: center; width: 100%; top: 45px; left: 10px; font-family: 'Source Sans Pro', sans-serif;">
    <div class="vulnerability-highlight" style="background-color:#fa74ff"></div></div>`);
    $("#report-vulnerability-result4").append(`<div id="report-vulnerability-result4-tooltip" class="vl-map-tooltip" style="text-align: center; width: 100%; top: 45px; left: 10px; font-family: 'Source Sans Pro', sans-serif;">
    <div class="vulnerability-highlight" style="background-color:#666"></div></div>`);

    if (report) {
        $("#report-exposure-text1").html(report.exposure_text_1);
        $("#report-exposure-text2").html(report.exposure_text_2);
        
        $("#report-vulnerability-result1-tooltip").append(`<div class="report-vulnerability-tooltip-text">${report.vulnerability_text_low}</div>`);
        $("#report-vulnerability-result1 .vulnerability-help-icon").attr('onmouseover', `toggleTooltip(1, true)`);
        $("#report-vulnerability-result1 .vulnerability-help-icon").attr('onmouseout', `toggleTooltip(1, false)`);

        $("#report-vulnerability-result2-tooltip").append(`<div class="report-vulnerability-tooltip-text">${report.vulnerability_text_medium}</div>`);
        $("#report-vulnerability-result2 .vulnerability-help-icon").attr('onmouseover', `toggleTooltip(2, true)`);
        $("#report-vulnerability-result2 .vulnerability-help-icon").attr('onmouseout', `toggleTooltip(2, false)`);

        $("#report-vulnerability-result3-tooltip").append(`<div class="report-vulnerability-tooltip-text">${report.vulnerability_text_high}</div>`);
        $("#report-vulnerability-result3 .vulnerability-help-icon").attr('onmouseover', `toggleTooltip(3, true)`);
        $("#report-vulnerability-result3 .vulnerability-help-icon").attr('onmouseout', `toggleTooltip(3, false)`);
        
        $("#report-vulnerability-result5-tooltip").append(`<div class="report-vulnerability-tooltip-text">${report.vulnerability_text_potential}</div>`);
        $("#report-vulnerability-result5 .vulnerability-help-icon").attr('onmouseover', `toggleTooltip(5, true)`);
        $("#report-vulnerability-result5 .vulnerability-help-icon").attr('onmouseout', `toggleTooltip(5, false)`);

        $("#report-vulnerability-result4-tooltip").append(`<div class="report-vulnerability-tooltip-text">A vulnerability methodology has yet to be determined for this asset and scenario.</div>`);
        $("#report-vulnerability-result4 .vulnerability-help-icon").attr('onmouseover', `toggleTooltip(4, true)`);
        $("#report-vulnerability-result4 .vulnerability-help-icon").attr('onmouseout', `toggleTooltip(4, false)`);
        
        $("#report-vulnerability-text1").html(report.vulnerability_text_1);
        $("#report-vulnerability-text2").html(report.vulnerability_text_low);
        $("#report-vulnerability-text3").html(report.vulnerability_text_medium);
        $("#report-vulnerability-text4").html(report.vulnerability_text_high);
        $("#report-uncertainty-text1").html(report.uncertainty_text_1);
        $("#report-uncertainty-text2").html(report.uncertainty_text_2);
        $("#report-data-source-text1").html(report.data_source_text_1);
        $("#report-data-source-text2").html(report.data_source_text_2);
        $("#report-vulnerability-result1").html(report.vulnerability_result_low);
        $("#report-vulnerability-result2").html(report.vulnerability_result_medium);
        $("#report-vulnerability-result3").html(report.vulnerability_result_high);
    }

    var asset_exposure = exposure_summary.filter(d => d.asset == asset_id && d.hazard_type == getHazard() && d.hazard_scenario == getHazardScenarioTif())[0];
    if(asset_exposure) {
        //console.log("Asset exposure imported correctly");
        //console.log(asset_exposure.statement_1);
        $("#report-exposure-text3").html(asset_exposure.statement_1);
        $("#report-vulnerability-result1").prepend(asset_exposure.statement_2);
        $("#report-vulnerability-result2").prepend(asset_exposure.statement_3);
        $("#report-vulnerability-result3").prepend(asset_exposure.statement_4);
        $("#report-vulnerability-result4").prepend(asset_exposure.statement_5);
    }

}

function toggleTooltip(num, doShow) {
    //console.log("this works");
    $(`#report-vulnerability-result${num}-tooltip`).css('visibility', doShow ? 'visible' : 'hidden');
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



function openReport(asset_id) {
    // Opens given report, regardless of website state
    setPage('reports');
    closeAssetReport();
    openAssetReport(asset_id);
}