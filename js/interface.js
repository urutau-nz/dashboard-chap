
var current_page = "overview";
function setPage(page) {
    if (current_page != page) {
        $('#try-map-popup').remove();
        $('#try-map-popup-arrow').remove();

        $("#menu-table td").removeClass("active");
        $(`#menu-table td[value="${page}"]`).addClass("active");

        $(`#page-${page}`).addClass("active");

        filterPanelRender();
        filtersApplyChanges();

        if (page == "map") {
            updateMap();

            for (var form_item of filterItems) {
                console.log(form_item);
                console.log(form_item.map.value , form_item.report.value);
                form_item.map.setValue(form_item.report.value);
            }

        } else if (page == "report") {

            for (var form_item of filterItems) {
                console.log(form_item);
                console.log(form_item.map.value , form_item.report.value);
                form_item.report.setValue(form_item.map.value);
            }

            if (!current_report_tab) {
                setReportTab('overview');
            }
        }

        $(`#page-${current_page}`).removeClass("active");

        
        current_page = page;
    }
}


var current_report_tab = null;
function setReportTab(tab) {
    if (tab != current_report_tab) {
        $(`#report-menu-${current_report_tab}-td`).removeClass("active");

        current_report_tab = tab;

        // Set Report Info BG to color of tab
        $("#report-info-td").css("background-color", $(`#report-menu-${tab}-td`).css("background-color"));
        $(`#report-menu-${current_report_tab}-td`).addClass("active");

        switch(tab) {
            case "overview": {
                $("#report-summary-td .title").html(`<h1>Overview</h1>`);

            } break;
            case "built": {
                $("#report-summary-td .title").html(`<h1>Built Domain</h1>`);

            } break;
            case "natural": {
                $("#report-summary-td .title").html(`<h1>Natural Domain</h1>`);

            } break;
            case "cultural": {
                $("#report-summary-td .title").html(`<h1>Cultural Domain</h1>`);

            } break;
            case "human": {
                $("#report-summary-td .title").html(`<h1>Human Domain</h1>`);

            } break;
        }
    }
}






var mapRegionMenu;
var reportRegionMenu;
var mapHazardMenu;
var reportHazardMenu;


var mapSLRSlider;
var reportSLRSlider;
var mapFrequencySlider;
var reportFrequencySlider;
var mapYearSlider;
var reportYearSlider;

var filter_values = {
    region: null,
    hazard: 'Erosion',
    slr: null,
    frequency: null,
    year: null
};

var yearLabels = ['2020', '2050', '2080', '2130', '2150+'];
var hazards = ['Erosion', 'Inundation', 'Groundwater'];
var hazard_slrs = {
    'Erosion': [0, 0.2, 0.4, 0.6, 0.8, 1.0, 1.2, 1.4, 1.6, 1.8, 2.0],
    'Inundation': [0, 0.2, 0.4, 0.6, 0.8, 1.2, 1.4, 1.5, 2.0],
    'Groundwater': [0, 0.2, 0.4, 1.0, 1.9],
};
var hazard_frequencies = {
    'Erosion': null,
    'Inundation': [1, 10, 100],
    'Groundwater': null,
};

var filterItems = [];
function initFilterPanels() {
    var contents = `
    <div class="filters-div">
        <table class="summary-table">
            <tr>
                <td>
                    <h2>Filters</h2>
                </td>
                <td>
                    <h3>Region:&nbsp;&nbsp;<span class="region"></span></h3>
                </td>
                <td>
                    <h3>Hazard:&nbsp;&nbsp;<span class="hazard"></span></h3>
                </td>
            </tr>
            <tr>
                <td>
                    <h3>SLR:&nbsp;&nbsp;<span class="slr"></span></h3>
                </td>
                <td>
                    <h3>Frequency:&nbsp;&nbsp;<span class="frequency"></span></h3>
                </td>
                <td>
                    <h3>Year:&nbsp;&nbsp;<span class="year"></span></h3>
                </td>
            </tr>
        </table>
        <table class="form-table" style="height:100%;width:100%;">
            <tr>
                <td>
                    <h2>Filters</h2>
                </td>
                <td style="position:relative;">
                    <div class="filters-apply-button" onclick="filtersApplyChanges()">Apply Changes</div>
                </td>
            </tr>
            <tr style="height: 100%;">
                <td style="border-right: 2px dashed;width:50%;padding: 2rem;padding-bottom:0;">
                    <table style="height:100%">
                        <tr style="height: 40%">
                            <td>
                                <div class="region-dropdown"></div>
                                <div style="font-style:italic;">This is a description for a region, if that is needed.</div>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <div class="hazard-dropdown"></div>
                                <div style="font-style:italic;">This is a description for a hazard, if that is needed.</div>
                            </td>
                        </tr>
                    </table>
                </td>
                <td style="padding: 1.5rem;padding-bottom:0;">
                    <table class="filters-slider-table" style="height:100%;width:100%;">
                        <tr>
                            <td>
                                <h3>SLR</h3>
                            </td>
                            <td class="slr-label">
                                
                            </td>
                        </tr>
                        <tr>
                            <td width="100%" colspan="2" style="height: 4.5rem;">
                                <div class="slr-slider slider"></div>
                                <div class="slr-pointers-div">
                                </div>
                            </td>
                        </tr>
                        <tr class="frequency-tr">
                            <td>
                                <h3>Frequency</h3>
                            </td>
                            <td class="frequency-label">
                                
                            </td>
                        </tr>
                        <tr class="frequency-tr">
                            <td width="100%" colspan="2">
                                <div class="frequency-slider slider"></div>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <h3>Year</h3>
                            </td>
                            <td class="year-label">
                                
                            </td>
                        </tr>
                        <tr>
                            <td width="100%" colspan="2">
                                <div class="year-slider slider"></div>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
        <div class="filters-expanding-icon" onclick="filterPanelInvert()"><img src="./icons/expand_arrow.svg"></div>
    </div>
    `;

    $(".filters-td").html(contents);

    $("#page-map .region-dropdown").attr('id', 'map-region-dropdown');
    $("#page-report .region-dropdown").attr('id', 'report-region-dropdown');

    $("#page-map .hazard-dropdown").attr('id', 'map-hazard-dropdown');
    $("#page-report .hazard-dropdown").attr('id', 'report-hazard-dropdown');

    $("#page-map .slr-slider").attr('id', 'map-slr-slider');
    $("#page-report .slr-slider").attr('id', 'report-slr-slider');

    $("#page-map .frequency-slider").attr('id', 'map-frequency-slider');
    $("#page-report .frequency-slider").attr('id', 'report-frequency-slider');

    $("#page-map .year-slider").attr('id', 'map-year-slider');
    $("#page-report .year-slider").attr('id', 'report-year-slider');

    mapRegionMenu = new vlDropDown("map-region-dropdown");
    reportRegionMenu = new vlDropDown("report-region-dropdown");

    for (var item of Object.keys(centroids)) {
        mapRegionMenu.push(item);
        reportRegionMenu.push(item);
    }

    var region_onchange = function (value) {
        if (map) {
            map.setView(centroids[filter_values.region], 12);
            showAreaOutline();
        }
        filter_values.region = value;
    }
    mapRegionMenu.setOnChange(region_onchange);
    reportRegionMenu.setOnChange(region_onchange);


    mapHazardMenu = new vlDropDown("map-hazard-dropdown");
    reportHazardMenu = new vlDropDown("report-hazard-dropdown");

    mapHazardMenu.populate(hazards);
    reportHazardMenu.populate(hazards);

    var hazard_onchange = function (value) {
        if (value == 'Inundation') {
            mapFrequencySlider.recreate(0, 2, 1, true);
            reportFrequencySlider.recreate(0, 2, 1, true);

            $(".frequency-tr").css('display', 'table-row');

        } else {
            mapFrequencySlider.recreate(0, 0, 1, true);
            reportFrequencySlider.recreate(0, 0, 1, true);

            $(".frequency-tr").css('display', 'none');
        }
        filter_values.hazard = value;

        mapSLRSlider.recreate(0, 2, hazard_slrs[filter_values.hazard], true);
        reportSLRSlider.recreate(0, 2, hazard_slrs[filter_values.hazard], true);
    }
    mapHazardMenu.setOnChange(hazard_onchange);
    reportHazardMenu.setOnChange(hazard_onchange);




    // SLRs
    mapSLRSlider = new vlSlider("map-slr-slider", 0, 2, hazard_slrs[filter_values.hazard], true);
    reportSLRSlider = new vlSlider("report-slr-slider", 0, 2, hazard_slrs[filter_values.hazard], true);
    var sli_onchange = function (value) {
        $(".slr-label").html(`<h3>${value}m</h3>`);
        onFiltersChange();
    }
    mapSLRSlider.setOnChange(sli_onchange);
    reportSLRSlider.setOnChange(sli_onchange);



    // Frequencies
    mapFrequencySlider = new vlSlider("map-frequency-slider", 0, 0, 1, true);
    reportFrequencySlider = new vlSlider("report-frequency-slider", 0, 0, 1, true);
    var frequency_onchange = function (value) {
        if (hazard_frequencies[filter_values.hazard]) {
            var label = hazard_frequencies[filter_values.hazard][value];
            $(".frequency-label").html(`<h3>ARI ${label}</h3>`);
            onFiltersChange();
        } else {
            $(".frequency-label").html(`<h3>ARI 1</h3>`); 
        }
    }
    mapFrequencySlider.setOnChange(frequency_onchange);
    reportFrequencySlider.setOnChange(frequency_onchange);

    $(".frequency-tr").css('display', 'none');

    // Years
    mapYearSlider = new vlSlider("map-year-slider", 0, 4, 1);
    reportYearSlider = new vlSlider("report-year-slider", 0, 4, 1);
    var year_onchange = function (value) {
        var label = yearLabels[value];
        $(".year-label").html(`<h3>${label}</h3>`); 
        updateSLRPointers(value);
    }
    mapYearSlider.setOnChange(year_onchange);
    reportYearSlider.setOnChange(year_onchange);




    // Filters
    filterItems = [
        {'map': mapRegionMenu, 'report': reportRegionMenu},
        {'map': mapHazardMenu, 'report': reportHazardMenu},
        {'map': mapSLRSlider, 'report': reportSLRSlider},
        {'map': mapFrequencySlider, 'report': reportFrequencySlider},
        {'map': mapYearSlider, 'report': reportYearSlider},
    ];


    var pointers = [
        {short: 'L',
        long: 'Low'
        },
        {short: 'M',
        long: 'Medium'
        },
        {short: 'HM',
        long: 'High<br><span>(Median Estimate)</span>'
        },
        {short: 'HU',
        long: 'High<br><span>(Upper Estimate)</span>'
        }
    ];
    var pointer_contents = "";
    for (var pointer of pointers) {
        pointer_contents += `<div class="${pointer.short}"><img src="./icons/PointerArrow.svg"/><div class="label">${pointer.short}</div><div class="hover">${pointer.long}</div></div>`;
    }

    $(".slr-pointers-div").html(pointer_contents);

    filtersApplyChanges();
}

var filters_expanded = true;
function filterPanelInvert() {
    filters_expanded = !filters_expanded;
    filterPanelRender();
}
function filterPanelRender() {
    if (filters_expanded) {
        $(".filters-div").css('height', '');
        $(".filters-div .form-table").css("display", "table");
        $(".filters-div .summary-table").css("display", "none");
    } else {
        $(".filters-div").css('height', '5rem');
        $(".filters-div .form-table").css("display", "none");
        $(".filters-div .summary-table").css("display", "table");

        var frequencyLabel = hazard_frequencies[filter_values.hazard][filter_values.frequency];

        var yearLabel = yearLabels[filter_values.year];

        $(".filters-div .summary-table .region").text(filter_values.region);
        $(".filters-div .summary-table .hazard").text(filter_values.hazard);
        $(".filters-div .summary-table .slr").text(filter_values.slr);
        $(".filters-div .summary-table .frequency").text(frequencyLabel + " years");
        $(".filters-div .summary-table .year").text(yearLabel);
    }
}




function onFiltersChange() {
    $(".filters-apply-button").addClass("active");
}

function filtersApplyChanges() {
    $(".filters-apply-button").removeClass("active");

    if (mapYearSlider) {
        if (current_page == 'map') {
            filter_values.region = mapRegionMenu.value;
            filter_values.hazard = mapHazardMenu.value;
            filter_values.slr = mapSLRSlider.value;
            filter_values.frequency = mapFrequencySlider.value;
            
            mapSLRSlider.updateMarker();
            mapFrequencySlider.updateMarker();
    
        } else {
            filter_values.region = reportRegionMenu.value;
            filter_values.hazard = reportHazardMenu.value;
            filter_values.slr = reportSLRSlider.value;
            filter_values.frequency = reportFrequencySlider.value;
            
            reportSLRSlider.updateMarker();
            reportFrequencySlider.updateMarker();
    
        }
    }
}




function tncCheckboxChange() {
    if ($("#tnc-checkbox").is(':checked')) {
        $("#tnc-button").addClass("active");
    } else {
        $("#tnc-button").removeClass("active");
    }
}

function tncButtonClick() {
    if ($("#tnc-checkbox").is(':checked')) {
        $("#tnc-popup-backdrop").css("display", "none");
    }
}




function updateSLRPointers(value) {
        // Update SLR Pointers according to Year
        var low = [0, 0.17, 0.25, 0.5, 0.6][value];
        var med = [0, 0.18, 0.35, 0.65, 0.8][value];
        var high_med = [0, 0.2, 0.45, 1.1, 1.35][value];
        var high_upper = [0, 0.25, 0.65, 1.45, 1.8][value];

        var conv = function (val) {return mapSLRSlider.valueToPerc(val);};

        $(".slr-pointers-div .L").css("left", conv(low) + "%");
        $(".slr-pointers-div .M").css("left",  conv(med) + "%");
        $(".slr-pointers-div .HM").css("left",  conv(high_med) + "%");
        $(".slr-pointers-div .HU").css("left",  conv(high_upper) + "%");
}



var selected_asset = null;

function mapAsset(asset, asset_label) {
    filters_expanded = false;
    filterPanelRender();

    $("#map-menu-td").css("display", "none");
    $("#map-report-td").css("display", "table-cell");
    
    $("#map-report-header-td").html(`<h1>${asset_label}</h1>`);
    $("#map-report-header-td").css("background-color", category_colors[available_layers[asset].category]);

    // Render asset on map
    available_layers[asset].display();
    selected_asset = asset;
}

function mapAssetReturn() {

    $("#map-menu-td").css("display", "table-cell");
    $("#map-report-td").css("display", "none");
    
    available_layers[selected_asset].remove();
    selected_asset = null;
}



/* ==== TOP RIGHT UI ELEMENT ==== 

var amenity_legend = L.control({position: 'topright'});

amenity_legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend rightControlPanel');

    title = '<h4 id="time_header">CHAP ' + 
            '<a id="helpLink" title="Help!" href="#" onclick="showHelpPopup();return false;"><img class="qimg" src="icons/qmark.svg"></a>' + 
            '</h4>';
    
    amenity_drop = '<td><h3 style="display:inline">Hazard:</h3></td>' + 
                    '<td><div class="location_drop_div" style="float: right;min-width:150px;"><select class="location_drop" id="hazardDropDown">'
    amenity_drop += '</select></div></td>';

    hazard_text = '<td colspan="2" style="padding:0;"><div id="hazard_text"></div></td>';

    div.innerHTML = title + '<hr>'  + '<table style="width:100%;"><tr>' + 
                     amenity_drop + '</tr><tr>' + hazard_text + '</tr></table>';
    
    return div;
};

amenity_legend.addTo(map);

function setHazardMenu() {
    amenity_drop = '<option value="none" selected>No Hazard</option>';
    for (hazard_id in all_hazards){
        var hazard = all_hazards[hazard_id];
        amenity_drop += '<option value="' + hazard.id + '">' + hazard.name + '</option>"';
    }
    $('#hazardDropDown').html(amenity_drop);
}

/* Updates the map on changing the hazard

var hazardMenu = document.getElementById("hazardDropDown");
hazardMenu.onchange = function() {
    for (hazard_id in all_hazards) {
        all_hazards[hazard_id].remove();
    }
    if (hazardMenu.value != 'none') {
        var hazard = all_hazards[hazardMenu.value];
        hazard.display();
        $('#hazardText').text('Hazard: ' + hazard.name);
        $('#hazardText').css('color', '#D55')
    } else {
        $('#hazardText').text('No Hazard Overlay');
        $('#hazardText').css('color', '#A55A')
    }
}








/* ==== TOP RIGHT SELECTION BOX ==== 

var layers = [];

var selection_panel = L.control({position: 'topright'});
var expanded_headers = [];

selection_panel.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend rightControlPanel');
    div.id = 'selectionPanel';
    
    return div;
};

selection_panel.addTo(map);



function initSelectionPanel() {
    var div = document.getElementById('selectionPanel');

    contents = '<h4 id="time_header">Layer Selection' + 
            '</h4><hr>';

    var all_categories = [];
    for (layer_key in available_layers) {
        if (!all_categories.includes(available_layers[layer_key].category)) all_categories.push(available_layers[layer_key].category);
    }

    console.log(all_categories);

    contents += '<table style="width:100%">';
    var i = 0;
    for (category of all_categories) {
        i ++;
        var matching_layers = Object.keys(available_layers).filter(d => available_layers[d].category == category);
        expanded_headers.push(false);
        contents += '<tr><td class="expandingHeader" onclick="expandingHeader(\''+category+'\','+matching_layers.length+')">' + category_titles[category] + 
                    '<img class="icon" src="icons/DropdownArrow.svg"></td></tr><tr><td><div class="expandingContents" style="height:0px;" id="expandingContents' + category + '"><table style="width:100%;">';
        
        for (layer_id of matching_layers) {
            var layer = available_layers[layer_id];
            contents += '<tr><td><div style="width:2px;"><input type="checkbox" id="sel' + layer.id + '" name="selItem" onclick="selectionMade(\''+layer.id+'\');"></div></td><td>' + layer.name + '</td></tr>';
        }
        contents += '</table></div></td></tr>';
    }
    contents += '</table>';
    
    div.innerHTML = contents;
}


function expandingHeader(category, length) {
    if (expanded_headers[category]) {
        $('#expandingContents'+category).css('height', '0px');
    } else {
        $('#expandingContents'+category).css('height', (length * 30) + 'px');
    }
    expanded_headers[category] = !expanded_headers[category];
};

function updateLayerOpacities() {
    var opacity = 0.5;
    for (layer_item of layers) {
        var curr_layer = available_layers[layer_item[0]];
        console.log(curr_layer, available_layers, layer_item);
        curr_layer.opacity = opacity;
        opacity *= 0.5;
        curr_layer.update();
    }
}

function selectionMade(layer_id) {
    var layer = available_layers[layer_id];
    var div = document.getElementById('sel'+layer_id);
    if (div.checked) {
        if (layers.length < 4) {
            /*
            var colors = ["#b2d8d8", '#66b2b2', '#008080', '#006666', '#004c4c'];
            for (var i in layers) {
                colors = colors.filter(d => d != layers[i][1]);
            }
            var color = colors[Math.floor(Math.random()*colors.length)];
            layers.unshift([layer_id, layer.name, layer.color]);

            if (layers.length == 4) {
                // Fade out other layer options
                $(".expandingContents input:not(:checked)").attr("disabled", true);
            }
            

            layer.display();

        } else {
            div.checked = false;
        }
    } else {
        for (var i in layers) {
            if (layers[i][0] == layer_id) layers.splice(i, 1);
        }

        if (layers.length == 3) {
            // Un-fade-out other layer options
            $(".expandingContents input:not(:checked)").removeAttr("disabled");
        }
        
        layer.remove();
    }
    updateLayers();
    updateLayerOpacities();
};







/* ==== TOP RIGHT LAYER PANEL ==== 

var layers_legend = L.control({position: 'topright'});

layers_legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend rightControlPanel');
    div.id = 'layerPanel';
    
    return div;
};

layers_legend.addTo(map);

var last_length = 0;
function updateLayers() {
    var div = document.getElementById('layerPanel');

    content = '<div id="hazardLayerText"><span id="hazardText">No Hazard Overlay</span></div>';
    content += '<table id="layerTable">';
    
    var style = '';
    if (last_length < layers.length) style = 'top: -46px; transition: top 0.1s ease-in-out';
    for (i = 0; i < 4; i++) {
        if (i < layers.length) {
            content += '<tr><td class="active"><div class="contents" style="'+style+'"><div class="colorbar" style="background-color:'+layers[i][2]+'"></div>'+layers[i][1]+'</div></td></tr>';
        } else {
            content += '<tr><td><td></tr>';
        }
    }

    content += '</table>';
    
    if (layers.length == 0) {
        content += '<div style="font-style:italic;color:grey;position:absolute;top:50%;width:250px;text-align:center;font-size:16px;">Add some layers!</div>';
    }

    div.innerHTML = content;

    if (last_length < layers.length) {
        setTimeout(function() {
            $("#layerTable .contents").css('top', '0px');
        }, 50);
    }
    
    last_length = layers.length;
}
updateLayers();






















/* ==== BOTTOM LEFT UI ELEMENTS ==== 

let scale_legend = L.control({ position: 'bottomleft' });
scale_legend.onAdd = function(map) {
    var div = L.DomUtil.create('div', 'info legend');
    div.id = "hazard_legend";
    
    return div;
};
scale_legend.addTo(map);

/* Generates the contents of the Scale Legend in the bottom right.
*//*
function setScaleLegend(div = null) {
    if (!div) div = document.getElementById("scale_legend");

    var labels = [];
    labels.push('<tr>' + 
        '<td class="legend cblock" id="legi" style="color: #FFF; background: #000"></td>' +
        '<td class="ltext">Isolated</td></tr>');
    cmap.forEach( function(v) {
      labels.push('<tr>' + 
          '<td class="legend cblock" id="leg' + v.idx + '" style="color:' + v.text + '; background:' + v.fill + '"></td>' +
          '<td class="ltext">' + v.label + '</td></tr>');
    });
    labels.reverse();

    table = '<table id="legend_table">' + labels.join('') + '</table>';
    
    div.innerHTML = '<h3 style="font-size:0.9rem;margin:0.2rem;">Driving Distance:</h3>' + table;
}
/* FOR MANUALLY SETTING STATE ZOOMS & CENTERS */ /*
document.getElementById('scale_legend').onclick = function () {
    console.log({'center': map.getCenter(), 'zoom': map.getZoom()});
}

/* Roads Legend
*//*
let roads_legend = L.control({ position: 'bottomleft' });
roads_legend.onAdd = function(map) {
    var div = L.DomUtil.create('div', 'info legend');
    div.id = "roads_legend";

    return div;
};
roads_legend.addTo(map);

function setRoadsLegend(div = null) {
    if (!div) div = document.getElementById("roads_legend");
    
    var closed_roads_length = 0;
    for (object of road_lengths) {
        if (simulateHazard && object.city == locMenu.value && object.hazard == hazardMenu.value) {
            closed_roads_length = object.total;
        }
    }

    var labels = [];
    labels.push('<tr>' + 
        '<td class="legend cblock" style="padding-left:4px;font-weight:bold;font-size: 16px;color: #f54242">―</td>' +
        '<td class="ltext" style="width: 3.2rem;padding-right:0;">Closed</td>' +
        '<td style="width:3.2rem; font-size: 14px; text-align: center; font-weight: bold;padding:0;">' + closed_roads_length + 'km</td></tr>');


    table = '<table id="legend_table">' + labels.join('') + '</table>';
    
    div.innerHTML = '<h3 style="font-size:0.9rem;margin:0.2rem;">Roads:</h3>' + table;
}

/* Availability Legend
*//*
let availability_legend = L.control({ position: 'bottomleft' });
availability_legend.onAdd = function(map) {
    var div = L.DomUtil.create('div', 'info legend');
    div.id = "availability_legend";

    return div;
};
availability_legend.addTo(map);

function setAvailabilityLegend(div = null) {
    if (!div) div = document.getElementById("availability_legend");
    
    var counts = [0,0];
    for (dest of filtered_destinations) {
        if (dest.operational.toLowerCase() != "false" && simulateHazard) {
            counts[1] += 1;
        } else {
            counts[0] += 1;
        }
    }

    var labels = [];
    labels.push('<tr>' + 
        '<td class="legend cblock" style="padding-left:4px;font-size: 16px;color: #55F">	⬤</td>' +
        '<td class="ltext" style="width: 3.2rem;padding-right:0;">Open </td>' +
        '<td style="width:1rem; font-size: 14px; text-align: center; font-weight: bold;padding:0;">' + counts[0] + '</td></tr>');
    labels.push('<tr>' + 
        '<td class="legend cblock" style="padding-left:4px;font-size: 16px;color: #000">	⬤</td>' +
        '<td class="ltext" style="width: 3.2rem;padding-right:0;">Closed  </td>' +
        '<td style="width:3.2rem; font-size: 14px; text-align: center; font-weight: bold;padding:0;">' + counts[1] + '</td></tr>');
    

    table = '<table id="legend_table">' + labels.join('') + '</table>';
    
    div.innerHTML = '<h3 style="font-size:0.9rem;margin:0.2rem;">Destinations:</h3>' + table;
}















// Gives Info on Q-mark click
function showHelpPopup(){
    var popup = document.getElementById("help-popup");

    // If Help Popup isn't populated yet, populate.
    if (popup.innerHTML == "") {
        /*
        var content = '<h2>Service Access Resilience</h2>' +
        "<p>Although local communities urgently need to build their resilience to natural hazards, very few analytical tools exist to support them in doing so. It is well understood that equitable access to amenities is vital to community function and inherent resilience. However, to measure this we must acknowledge that access is dependent on the operability of both the road network and amenities.<br>" +
        "<br>This tool enables local and national governments to build equity and resilience by:<br><ul>" +
        "<li>Guiding investment prioritization to maximize access equity and performance within pre & post hazard scenarios<br>" +
        "<li>Guiding disaster response preparedness<br>" +
        "<li>Identifying critical nodes within amenity networks (food resources, health care, etc.)<br>" +
        "<li>Identifying critical links within the transport network<br>" +
        "<li>Identifying vulnerable geographic areas and demographic groups<br>" +
        '</ul><br><span style="font-style: italic; font-size: 80%;">M. J. Anderson, D. A. F. Kiddle, & T. M. Logan (2021). The Underestimated Role of the Transportation Network: Improving Disaster & Community Resilience. Transportation Research Part D : Transport and Environment. (Under Review)</span></p>' +
            "<br><br>" +
            '<span class="contact">Have suggestions or feedback? Contact us at <a href="mailto:info@urbanintelligence.co.nz?subject=About Your CHAP Project...">info@urbanintelligence.co.nz</a></span>';
        
        var button = '<button onclick="hideHelpPopup()">&#10006;</button>';
        
        popup.innerHTML = button + '<br><br><br>';// + content;
    }
    popup.style.display = "block";

    var mouse_info = document.getElementById("mouseInfo");
    mouse_info.style.visibility = "hidden";
}
function hideHelpPopup() {
    var popup = document.getElementById("help-popup");
    popup.style.display = "none";
}




// Region Info Follows Mouse (Also known as the distance pop-up)
let info_legend = L.control({position: 'topleft'});
info_legend.onAdd = function(map) {
    var div = L.DomUtil.create('div', 'info legend');
    div.id = "mouseInfo";
    div.style.position = "absolute";
    div.style.whiteSpace = "nowrap";
    div.style.fontSize = "15px";
    div.style.visibility = "hidden";
    div.innerHTML = 'Distance: 0km';
    
    return div;
};
info_legend.addTo(map);

document.addEventListener('mousemove', function(e) {
    var info_legend = document.getElementById("mouseInfo");
    let left = e.pageX;
    let top = e.pageY;
    info_legend.style.left = left + 'px';
    info_legend.style.top = top + 'px';
});





// Disable Map Dragging while cursor on controls
for (element of document.getElementsByClassName("legend")) {
    element.addEventListener('mouseover', function () {
        map.dragging.disable();
        map.doubleClickZoom.disable();
        map.boxZoom.disable();
     });
    element.addEventListener('mouseout', function () {
        map.dragging.enable();
        map.doubleClickZoom.enable();
        map.boxZoom.enable();
     });
}*/