
var current_page = "overview";
function setPage(page) {
    if (current_page != page) {
        $('#try-map-popup').remove();
        $('#try-map-popup-arrow').remove();

        $("#menu-table td").removeClass("active");
        $(`#menu-table td[value="${page}"]`).addClass("active");

        $(`#page-${page}`).addClass("active");

        filterPanelRender();

        if (page == "map") {
            updateMap();

            filters_expanded = false;
            filterPanelRender();

            for (var form_item of filterItems) {
                console.log(form_item);
                console.log(form_item.map.value , form_item.report.value);
                form_item.map.setValue(form_item.report.value);
            }

        } else if (page == "report") {

            filters_expanded = false;
            filterPanelRender();

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
        
        filtersApplyChanges();
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

var yearLabels = {2020: '2020', 2050: '2050', 2080: '2080', 2130: '2130', 2150: '2150+'};
var hazards = ['Erosion', 'Inundation']; //, 'Groundwater'
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
                </td>
                <td>
                    <h3>SLR:&nbsp;&nbsp;<span class="slr"></span></h3>
                </td>
                <td class="frequency-td">
                    <h3>Frequency:&nbsp;&nbsp;<span class="frequency"></span></h3>
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
                        <tr>
                            <td>
                                <div class="region-dropdown"></div>
                                <div style="font-style:italic;"></div>
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
                            <td width="100%" colspan="2" style="height: 4.5rem; position: relative">
                                <div class="slr-slider slider"></div>
                                <div class="slr-slider-marker-info">0.2m</div>
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
        <div class="filters-expanding-icon" onclick="filterPanelInvert()"><img src="./icons/overview-Expand.png"></div>
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
        filter_values.region = value;
        if (map) {
            map.setView(centroids[value], 12);
            showAreaOutline();
        }
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

        mapSLRSlider.recreate(0, 2, hazard_slrs[filter_values.hazard.toLowerCase()], true);
        reportSLRSlider.recreate(0, 2, hazard_slrs[filter_values.hazard.toLowerCase()], true);
        
        filtersApplyChanges();
    }
    mapHazardMenu.setOnChange(hazard_onchange);
    reportHazardMenu.setOnChange(hazard_onchange);




    // SLRs

    hazard_info.forEach( function(d) {
        if (!hazard_slrs[d.hazard_type].includes(d.slr)) {
            hazard_slrs[d.hazard_type].push(d.slr);
        }
    });

    mapSLRSlider = new vlSlider("map-slr-slider", 0, 2, hazard_slrs[filter_values.hazard.toLowerCase()], true);
    reportSLRSlider = new vlSlider("report-slr-slider", 0, 2, hazard_slrs[filter_values.hazard.toLowerCase()], true);
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
    mapYearSlider = new vlSlider("map-year-slider", 2020, 2150, Object.keys(yearLabels));
    reportYearSlider = new vlSlider("report-year-slider", 2020, 2150, Object.keys(yearLabels));
    var year_onchange = function (value) {
        var label = yearLabels[value];
        $(".year-label").html(`<h3>${label}</h3>`); 
        updateSLRPointers(value);
    }
    mapYearSlider.setOnChange(year_onchange);
    reportYearSlider.setOnChange(year_onchange);
    mapYearSlider.setValue(2150);
    reportYearSlider.setValue(2150);




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
    var pointer_contents = "";
    for (var pointer of pointers) {
        pointer_contents += `<div class="${pointer.short}"><img src="./icons/overview-Pointer.png"/><div class="label">${pointer.short}</div><div class="hover">${pointer.long}</div></div>`;
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

        if (hazard_frequencies[filter_values.hazard]) {
            $(".frequency-td").css("visibility", "visible");
            var frequencyLabel = hazard_frequencies[filter_values.hazard][filter_values.frequency];
            $(".filters-div .summary-table .frequency").text("ARI " + frequencyLabel);

        } else {
            $(".frequency-td").css("visibility", "hidden");

        }

        var yearLabel = yearLabels[filter_values.year];
        if (filter_values.year) {
            updateSLRPointers(filter_values.year);
        } else {
            updateSLRPointers(2150);
        }

        $(".filters-div .summary-table .region").text(filter_values.region);
        $(".filters-div .summary-table .hazard").text(filter_values.hazard);
        $(".filters-div .summary-table .slr").text(filter_values.slr + "m");
        $(".filters-div .summary-table .year").text(yearLabel);
    }
    
}




function onFiltersChange() {
    $(".filters-apply-button").addClass("active");

    if ((current_page == 'map' ? mapSLRSlider.value != filter_values.slr : reportSLRSlider.value != filter_values.slr)) {
        $(".slr-slider-marker-info").css('opacity', 1);
    } else {
        $(".slr-slider-marker-info").css('opacity',0);
    }
}


var hazard_layer = null;

var hazard_scenario = null;

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

    $(".slr-slider-marker-info").css('opacity', 0);
    $(".slr-slider-marker-info").text(filter_values.slr + "m");

    

    // Change Hazard Overlay

    if (hazard_layer) {
        hazard_layer.remove();
    }
    if (map) {

        var target_hazards = hazard_info.filter(d => d.hazard_type == filter_values.hazard.toLowerCase() && 
                                                    d.slr == filter_values.slr && 
                                                    (d.hazard_type != "inundation" || d.ari == [1,10,100][filter_values.frequency]));
        
        if (target_hazards.length > 1) {
            target_hazards.sort(function(a, b) {
                if (a.year < b.year) return -1;
                return 1;
            });
        }

        var target_hazard = target_hazards[0];

        hazard_scenario = target_hazard.file_name;
        
        var url = import_url + `/data/hazards/${target_hazard.file_name}`;
        
        hazard_layer = new ImageLayer('hazard_overlay',
        'Hazard Overlay',
        null,
        url,
        target_hazard.ne_lat , target_hazard.ne_lon,
        target_hazard.sw_lat , target_hazard.sw_lon,
        ); 
    
        hazard_layer.display();


    
        // Collect Hover Data
    
        hover_data = {};
    
        exposure_built.filter(d => d.hazard_scenario == target_hazard.file_name).forEach(function (d) {
            hover_data[d.asset_id] = d.exposure;
        });
    }

    
    if (selected_asset) {
        createAssetReport("map-report-sub-div", assets[selected_asset].display_name);
    }
}




function tncCheckboxChange() {
    if (assets) {
        $("#tnc-button").text("Continue");
    }
    if ($("#tnc-checkbox").is(':checked') && assets) {
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
        var index = Object.keys(yearLabels).indexOf(value.toString());
        console.log(value, yearLabels,  Object.keys(yearLabels), index);

        var low = [0, 0.17, 0.25, 0.5, 0.6][index];
        var med = [0, 0.18, 0.35, 0.65, 0.8][index];
        var high_med = [0, 0.2, 0.45, 1.1, 1.35][index];
        var high_upper = [0, 0.25, 0.65, 1.45, 1.8][index];

        var conv = function (val) {return mapSLRSlider.valueToPerc(val);};

        $(".slr-pointers-div .L").css("left", conv(low) + "%");
        $(".slr-pointers-div .M").css("left",  conv(med) + "%");
        $(".slr-pointers-div .HM").css("left",  conv(high_med) + "%");
        $(".slr-pointers-div .HU").css("left",  conv(high_upper) + "%");

        $(".low-estimate-span").text(low + 'm');
        $(".moderate-estimate-span").text(med + 'm');
        $(".high-median-estimate-span").text(high_med + 'm');
        $(".high-upper-estimate-span").text(high_upper + 'm');
}

