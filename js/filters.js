var hazard_settings_default_values = {
    slr: 80,
    hazard: 'inundation',
    frequency: 1
}





var hazard_popup = new vlPopup('Hazard Settings', `
<table style="height: 100%; width: 100%; table-layout: fixed;margin-bottom: 1rem;" id="hazard-popup-table">
<col style="width:100px"/>
<col style="width:100px"/>
<col style="width:150px"/>
<tr>
    <td style="vertical-align: bottom;" colspan="3">
        <h3 style="margin:0;">Hazard:</h3>
    </td>
</tr>
<tr>
    <td colspan="3">
        <div id="hazard-dropdown"></div>
        <div id="hazard-description" style="font-style:italic;font-size: 0.8em;">This is a description for a hazard, if that is needed.</div>
    </td>
</tr>
<tr>
    <td style="padding-top: 1rem;">
        <h3>Sea Level Rise</h3>
    </td>
    <td style="padding-top: 1rem;" class="slr-label text-align-right">
        
    </td>
    <td style="width:250px;position:relative;">
        <div id="hazard-year-div">
            <table>
                <tr>
                    <td>
                        <h3>Year</h3>
                    </td>
                    <td class="year-label text-align-right">
                    </td>
                </tr>
                <tr>
                    <td width="100%" colspan="2">
                        <div class="year-slider slider" id="year-slider"></div>
                    </td>
                </tr>
            </table>
        </div>
    </td>
</tr>
<tr>
    <td width="100%" colspan="2" style="height: 4.5rem; position: relative">
        <div class="slr-slider slider" id="slr-slider"></div>
        <div class="slr-slider-marker-info">20cm</div>
        <div class="slr-pointers-div">
        </div>
    </td>
</tr>
<tr class="frequency-tr">
    <td>
        <h3>Frequency</h3>
    </td>
    <td class="frequency-label text-align-right">
        
    </td>
</tr>
<tr class="frequency-tr">
    <td width="100%" colspan="2">
        <div class="frequency-slider slider" id="frequency-slider"></div>
    </td>
</tr> 
</table>`, {
    exit_type: 'x',
    on_exit: onHazardPopupClosed,
    extra_buttons: [
        {text: 'Apply', onclick: updateHazard, html_id: "hazard-popup-apply-button"}
    ],
    html_id: "hazard-settings-popup",
    backdrop: false,
    draggable: true,
    snapping: true
});


var hazardMenu = null;
var SLRSlider = null;
var frequencySlider = null;
var yearSlider = null;


var yearLabels = {2020: '2020', 2050: '2050', 2080: '2080', 2130: '2130', 2150: '2150+'};
var hazards = ['Erosion', 'Inundation', 'Groundwater'];
var hazard_labels = {
    'erosion': 'Erosion',
    'inundation': 'Inundation',
    'groundwater': 'Groundwater'
}
var hazard_slrs = {
    'erosion': [],
    'inundation': [],
    'groundwater': []
};
var hazard_frequencies = {
    'Erosion': null,
    'Inundation': [1, 10, 100],
    'Groundwater': null,
};

var slr_pointers = [
    {short: 'L',
    long: 'Low: <span class="low-estimate-span">0m</span>'
    },
    {short: 'M',
    long: 'Moderate: <span class="moderate-estimate-span">0m</span>'
    },
    {short: 'HM',
    long: 'High: <span class="high-median-estimate-span">0m</span><br><span class="subtitle">(Median Estimate)</span>'
    },
    {short: 'HU',
    long: 'High: <span class="high-upper-estimate-span">0m</span><br><span class="subtitle">(Upper Estimate)</span>'
    }
];






function initFilters() {

    // HAZARD DROPDOWN

    hazardMenu = new vlDropDown("hazard-dropdown");
    hazardMenu.populate(hazards);
    hazardMenu.setValue("Inundation");
    
    var hazard_onchange = function (value) {
        if (value == 'Inundation') {
            $(".frequency-tr").css('display', 'table-row');

        } else {
            $(".frequency-tr").css('display', 'none');
        }

        onHazardValuesChanged();

        // Update SLRs to the new hazard's SLR options
        //mapSLRSlider.recreate(0, 2, hazard_slrs[filter_values.hazard.toLowerCase()], true);
        SLRSlider.recreate(0, 200, hazard_slrs[getHazard()], true);
        updateSLRPointers(yearSlider.value);
    }
    hazardMenu.setOnChange(hazard_onchange);



    // SLR SLIDER

    hazard_info.forEach( function(d) { // Find all unique SLR values for each hazard
        if (!hazard_slrs[d.hazard_type].includes(d.slr)) {
            hazard_slrs[d.hazard_type].push(d.slr);
        }
    });
    
    SLRSlider = new vlSlider("slr-slider", 0, 200, hazard_slrs['inundation'], true);
    
    var sli_onchange = function (value) {
        $(".slr-label").html(`<h3>${value}cm</h3>`);
        onHazardValuesChanged();
    }
    SLRSlider.setOnChange(sli_onchange);
    SLRSlider.setValue(hazard_settings_default_values.slr);



    // FREQUENCIES

    frequencySlider = new vlSlider("frequency-slider", 0, 2, 1, true);
    var frequency_onchange = function (value) {
        if (hazard_frequencies[hazardMenu.value]) {
            var label = hazard_frequencies[hazardMenu.value][value];
            $(".frequency-label").html(`<h3>ARI ${label}</h3>`);
        } else {
            $(".frequency-label").html(`<h3>ARI 1</h3>`); 
        }
        onHazardValuesChanged();
    }
    frequencySlider.setOnChange(frequency_onchange);
    frequencySlider.setValue(hazard_settings_default_values.frequency);

    

    // YEARS

    yearSlider = new vlSlider("year-slider", 2020, 2150, Object.keys(yearLabels));
    var year_onchange = function (value) {
        var label = yearLabels[value];
        $(".year-label").html(`<h3>${label}</h3>`); 
        updateSLRPointers(value);
        if (getHazard() == 'erosion') {
            /* Only effects hazard if erosion */
            onHazardValuesChanged();
        }
    }
    yearSlider.setOnChange(year_onchange);
    yearSlider.setValue(2150);




    // POINTERS
    
    var pointer_contents = "";
    for (var pointer of slr_pointers) {
        pointer_contents += `<div class="${pointer.short}"><img src="./icons/overview-Pointer.png"/><div class="label">${pointer.short}</div><div class="hover">${pointer.long}</div></div>`;
    }

    $(".slr-pointers-div").html(pointer_contents);

    updateSLRPointers(2150);


    // Update Hazard to be the above
    updateHazard();


    // Connect .hazard-button 's with their onclick
    $('.hazard-button').on('click', function () {
        hazard_popup.show();
        if (current_page == 'reports') {
            var left = $("#reports-left-td").width() / 2;
            if (left < 350) { left = '' } // Either put in center of left column, or center of screen if didn't fit
            else { 
                left -= $("#hazard-settings-popup").width() / 2;
                left += 'px';
            }
            console.log("LEFT", left);

            $("#hazard-settings-popup").css("left", left);
            $("#reports-left-td-overlay").css("display", "block");
        } else if (current_page == 'map') {
            // SHOULD BE EMPTY - POPUP WILL be in center by default
        }
    });
}


function updateSLRPointers(value) {
    // Update SLR Pointers according to Year
    var index = Object.keys(yearLabels).indexOf(value.toString());
    //console.log(value, yearLabels,  Object.keys(yearLabels), index);

    var low = [0, 17, 25, 50, 60][index];
    var med = [0, 18, 35, 65, 80][index];
    var high_med = [0, 20, 45, 110, 135][index];
    var high_upper = [0, 25, 65, 145, 180][index];

    var conv = function (val) {return SLRSlider.valueToPerc(val);};

    $(".slr-pointers-div .L").css("left", conv(low) + "%");
    $(".slr-pointers-div .M").css("left",  conv(med) + "%");
    $(".slr-pointers-div .HM").css("left",  conv(high_med) + "%");
    $(".slr-pointers-div .HU").css("left",  conv(high_upper) + "%");

    $(".low-estimate-span").text(low + 'cm');
    $(".moderate-estimate-span").text(med + 'cm');
    $(".high-median-estimate-span").text(high_med + 'cm');
    $(".high-upper-estimate-span").text(high_upper + 'cm');
}


function onHazardValuesChanged() {
    // Triggered by changing hazard form items, before the changes are applied
    $('#hazard-popup-apply-button').addClass('active');
}

function updateHazard() {
    // Triggered when the user clicks the "Apply" button
    showLoading();

    setTimeout(function () {

        SLRSlider.updateMarker();
        frequencySlider.updateMarker();
    
        // Update Summary Text Fields
        var summary = '';
        summary += hazardMenu.value;
        summary += ' (' + SLRSlider.value + 'cm';
        if (hazardMenu.value == 'Inundation') summary += ', ARI ' + getFrequency();
        if (hazardMenu.value == 'Erosion') summary += ', ' + getYear();
        summary += ')';
        $('.hazard-summary').text(summary);
    
        // Disable "Apply" button
        $('#hazard-popup-apply-button').removeClass('active');
        $('#hazard-settings-popup .vl-popup-exit-button').text('Close');

        // Update Icon
        $(`.hazard-button .hazard-symbol`).css('display', 'none');
        $(`.hazard-button .hazard-symbol.${hazardMenu.value}`).css('display', 'block');
    
    
        // Update Map & Report accordingly
        if (current_page == 'reports') {
    
            // Update Hazard Layer on Map
            updateMapHazard(report_map);
    
            if (report_asset_selected) {
                // If a report is open, reopen it
                openAssetReport(report_asset_selected.id);
            }
    
        } else if (current_page == 'map') {
    
            // Update Hazard Layer on Map
            updateMapHazard(map_map);

            // Update Map Layers
            updateMapLayers();

        }
        // Hide Loading in a bit
        setTimeout(hideLoading, 1000);

    }, 100);
}

function onHazardPopupClosed() {
    // updateHazard(); Doesn't apply hazard changes any more! It's just an X after all.
    $("#reports-left-td-overlay").css("display", "none");
}


function esriOutlineStyle(symbol) {
    var color = symbol['color'];
    var style = symbol['style'];
    
    if (style == 'esriSLSDash') {
        var style_obj = { dashArray: '5,5' }
    } else if (style == 'esriSLSSolid') {
        var style_obj = {}
    } else {
        console.log(">> ESRI OUTLINE > NEW STYLE:", symbol);
    }
    
    return {
        "color": `rgba(${color[0]},${color[1]},${color[2]},${color[3]})`,
        "weight": symbol.width * 0.75,
        ...style_obj
    };
}
function esriSymbolToStyle(symbol) {
    if (symbol.type == 'esriSFS') {
        var outline_style = esriOutlineStyle(symbol.outline);
        var fill_color = symbol.color;
        
        return {
            "fillColor": `rgba(${fill_color[0]},${fill_color[1]},${fill_color[2]},${fill_color[3]})`,
            ...outline_style
        };

    } else if (symbol.type == 'esriSLS') {
        var outline_style = esriOutlineStyle(symbol);

        return outline_style;
    }
    console.log(">> ESRI SYMBOL > NEW STYLE:", symbol);

}
function updateMapHazard(relevant_map) {
    // Updates the image layer of the map
    showLoading();


    // Update Hazard Legend
    relevant_map.hideLegend('inundation');
    relevant_map.hideLegend('groundwater');
    relevant_map.hideLegend('erosion');
    relevant_map.showLegend(getHazard());


    var file_name = getHazardScenarioPng();
    relevant_map.removeLayer('hazard-esri-1');
    relevant_map.removeLayer('hazard-esri-2');
    $('#hazard-description').text('');
    
    for (var geo_i = 1; geo_i <= 10; geo_i++ ) {
        relevant_map.removeLayer(`hazard-geo-${geo_i}`);
    }

    var hazard_set = getHazardInfo();
    if (hazard_set != null) {
        var chch_id = hazard_set.chch_rest_id;
        var banks_id = hazard_set.banks_rest_id;
    
        /* Add CHCH & Banks Pen esri layers */
        relevant_map.addEsriLayer(`https://gis.ccc.govt.nz/arcgis/rest/services/CorporateSolution/ChristchurchCoastalHazardViewer/MapServer/`,
            chch_id, {
                layer_id: 'hazard-esri-1'
            });
        relevant_map.addEsriLayer(`https://gis.ccc.govt.nz/arcgis/rest/services/CorporateSolution/ChristchurchCoastalHazardViewer/MapServer/`,
            banks_id, {
                layer_id: 'hazard-esri-2'
            });
        

        $('#hazard-description').text(hazard_set.hazard_comment);
        
        console.log("HAZARD SET", hazard_set);
        var tryAddGeoIndex = function(geo_i) {
            if (hazard_set[`additional_layer${geo_i}_rest_id`] != null) {
                var geo_id = hazard_set[`additional_layer${geo_i}_rest_id`];
                var geojson_url = `https://gis.ccc.govt.nz/arcgis/rest/services/CorporateSolution/ChristchurchCoastalHazardViewer/MapServer/${geo_id}/query?f=geojson&outSR=4326&resultType=tile&returnExceededLimitFeatures=false&spatialRel=esriSpatialRelIntersects&where=1%3D1&geometryType=esriGeometryEnvelope` 
                vlQuickImport(`https://gis.ccc.govt.nz/arcgis/rest/services/CorporateSolution/ChristchurchCoastalHazardViewer/MapServer/${geo_id}?f=pjson`, 'json',
                function (d) {
                    console.log(d);
                    var name = d['description'];



                    if (d.drawingInfo.renderer.uniqueValueInfos) {

                        /* Converts the uniqueValueInfos list into a object using the 'value' property as the keys */
                        var unique_dict = d.drawingInfo.renderer.uniqueValueInfos.reduce((obj, style) => (obj[style.value] = style, obj), {});

                        /* Generate the style function, ensuring it maintains access to unique_dict */
                        var myStyleGenerator = function (uniqueValueInfos) {
                            var uniqueValueInfos = uniqueValueInfos;
                            var myStyle = function (feature) {
                                return esriSymbolToStyle(uniqueValueInfos[feature.properties.Type]['symbol']);
                            }
                            return myStyle;
                        }

                        var myStyle = myStyleGenerator(unique_dict);

                    } else {
                        var myStyle = esriSymbolToStyle(d['drawingInfo']['renderer']['symbol']);
                    }
                
                    
                    relevant_map.loadGeoLayer(geojson_url, myStyle, {layer_id: `hazard-geo-${geo_i}`});
                });
            }
        }
        
        for (var geo_index = 1; geo_index <= 10; geo_index++ ) {
            tryAddGeoIndex(geo_index);
        }
    }
    
/* 


    if (file_name) {
        var url = import_url + `/data/hazards/${file_name}`;
        
        var target_hazard = getHazardInfo();

        relevant_map.addImageLayer(url, 
            target_hazard.ne_lat , target_hazard.ne_lon,
            target_hazard.sw_lat , target_hazard.sw_lon, {
                layer_id: 'hazard-layer',
                opacity: (getHazard() == 'groundwater' ? 0.8 : 0.9)
            });

            /*
        // Update Hazard Legends
        $('#hazard-legend table').css('display', 'none');
        $(`#${filter_values.hazard.toLowerCase()}-legend`).css('display', 'table');

        // Collect Hover Data
        updateHoverData(); 
    } else {
        alert("No data for specified hazard.");
    }   */
    hideLoading();
}





function getHazardInfo() {
    // GET THE MATCHING HAZARD INFO FOR THE CURRENT HAZARD
    if (hazard_info) {
        // If hazard info exists, we can go ahead

        // We now get the hazard scenario, by filtering hazard info by our hazard settings, 
        // and getting the "file_name" column's value
        var target_hazards = hazard_info.filter(d => d.hazard_type == getHazard() && 
                            d.slr == getSLR() && 
                            (d.hazard_type != "inundation" || d.ari == getFrequency()) && 
                            (d.hazard_type != "erosion" || d.year == getYear()));

        if (target_hazards.length > 1) {
            target_hazards.sort(function(a, b) {
            if (a.year < b.year) return -1;
            return 1;
            });
        }

        var target_hazard = null;
        if (target_hazards.length > 0) {
            target_hazard = target_hazards[0];
        }
        return target_hazard;

    } else {
        // No Data yet, so this will do
        return null;
    }

}

function getHazardScenarioTif() {
    // GET THE CURRENT HAZARD SCENARIO FILENAME
    var target_hazard = getHazardInfo();
    if (target_hazard) {
        return target_hazard.filename;

    } else {
        // No Data yet, so this will do
        return null;
    }

}
function getHazardScenarioPng() {
    var file_name = getHazardScenarioTif();
    //if (file_name) return `${file_name.slice(0, file_name.length-4)}.png`;
    return file_name;
}

function getCurrentRegion() {
    if (current_page == "reports") {
        return report_region_dropdown.value;
    } else if (current_page == "map") {
        return map_region_dropdown.value;
    }
}

function getCurrentRegionId() {
    if (current_page == "reports") {
        if (report_region_dropdown) {
            return region_ids[report_region_dropdown.value];
        } else {
            return "all";
        }
    } else if (current_page == "map") {
        if (map_region_dropdown) {
            return region_ids[map_region_dropdown.value];
        } else {
            return "all";
        }
    }
}

function getHazard() {
    if (hazardMenu) {
        return hazardMenu.value.toLowerCase();
    } else {
        return hazard_settings_default_values.hazard;
    }
}

function getSLR() {
    if (SLRSlider) {
        return SLRSlider.value;
    } else {
        return hazard_settings_default_values.slr;
    }
}

function getYear() {
    if (yearSlider) {
        return yearSlider.value;
    } else {
        return hazard_settings_default_values.year;
    }
}

function getFrequency() {
    if (frequencySlider) {
        return [1,10,100][frequencySlider.value];
    } else {
        return hazard_settings_default_values.frequency;
    }
}