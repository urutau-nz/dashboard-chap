
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
                <td class="frequency-td">
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

        if (hazard_frequencies[filter_values.hazard]) {
            $(".frequency-td").css("visibility", "visible");
            var frequencyLabel = hazard_frequencies[filter_values.hazard][filter_values.frequency];
            $(".filters-div .summary-table .frequency").text(frequencyLabel + " years");
        } else {
            $(".frequency-td").css("visibility", "hidden");
        }

        var yearLabel = yearLabels[filter_values.year];

        $(".filters-div .summary-table .region").text(filter_values.region);
        $(".filters-div .summary-table .hazard").text(filter_values.hazard);
        $(".filters-div .summary-table .slr").text(filter_values.slr);
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

        $(".low-estimate-span").text(low + 'm');
        $(".moderate-estimate-span").text(med + 'm');
        $(".high-median-estimate-span").text(high_med + 'm');
        $(".high-upper-estimate-span").text(high_upper + 'm');
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

