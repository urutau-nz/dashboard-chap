var hazard_settings_default_values = {
    slr: 0.8,
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
        <div class="slr-slider-marker-info">0.2m</div>
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
        SLRSlider.recreate(0, 2, hazard_slrs[getHazard()], true);
        updateSLRPointers(yearSlider.value);
    }
    hazardMenu.setOnChange(hazard_onchange);



    // SLR SLIDER

    console.log(hazard_info);
    hazard_info.forEach( function(d) { // Find all unique SLR values for each hazard
        if (!hazard_slrs[d.hazard_type].includes(d.slr)) {
            hazard_slrs[d.hazard_type].push(d.slr);
        }
    });
    
    SLRSlider = new vlSlider("slr-slider", 0, 2, hazard_slrs['inundation'], true);
    
    var sli_onchange = function (value) {
        $(".slr-label").html(`<h3>${value}m</h3>`);
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

    var low = [0, 0.17, 0.25, 0.5, 0.6][index];
    var med = [0, 0.18, 0.35, 0.65, 0.8][index];
    var high_med = [0, 0.2, 0.45, 1.1, 1.35][index];
    var high_upper = [0, 0.25, 0.65, 1.45, 1.8][index];

    var conv = function (val) {return SLRSlider.valueToPerc(val);};

    $(".slr-pointers-div .L").css("left", conv(low) + "%");
    $(".slr-pointers-div .M").css("left",  conv(med) + "%");
    $(".slr-pointers-div .HM").css("left",  conv(high_med) + "%");
    $(".slr-pointers-div .HU").css("left",  conv(high_upper) + "%");

    $(".low-estimate-span").text(low + 'm');
    $(".moderate-estimate-span").text(med + 'm');
    $(".high-median-estimate-span").text(high_med + 'm');
    $(".high-upper-estimate-span").text(high_upper + 'm');
}


function onHazardValuesChanged() {
    // Triggered by changing hazard form items, before the changes are applied
    $('#hazard-popup-apply-button').addClass('active');

    // Set hazard description
    var haz_desc = "";
    if (getHazard() == "groundwater" && getSLR() == 2.4) {
        haz_desc = "Note: This extent has only been completed for Sumner to Kaiapoi";
    }
    $('#hazard-description').text(haz_desc);
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
        summary += ' (' + SLRSlider.value + 'm';
        if (hazardMenu.value == 'Inundation') summary += ', ARI ' + getFrequency();
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



function updateMapHazard(relevant_map) {
    // Updates the image layer of the map
    showLoading();
    var file_name = getHazardScenarioPng();
    relevant_map.removeLayer('hazard-layer');

    // Update Hazard Legend
    relevant_map.hideLegend('inundation');
    relevant_map.hideLegend('groundwater');
    relevant_map.hideLegend('erosion');
    relevant_map.showLegend(getHazard());


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
        updateHoverData(); */
    } else {
        alert("No data for specified hazard.");
    }  
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
                            (d.hazard_type != "inundation" || d.ari == getFrequency()));

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
        return target_hazard.file_name;

    } else {
        // No Data yet, so this will do
        return null;
    }

}
function getHazardScenarioPng() {
    var file_name = getHazardScenarioTif();
    if (file_name) return `${file_name.slice(0, file_name.length-4)}.png`;
    return null;
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

function getFrequency() {
    if (frequencySlider) {
        return [1,10,100][frequencySlider.value];
    } else {
        return hazard_settings_default_values.frequency;
    }
}