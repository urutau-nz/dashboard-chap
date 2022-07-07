


var current_page = "home";
function setPage(page) {
    if (current_page != page) {
        // Remove the "Try Map!" Popup if possible
        $('#try-map-popup').remove();
        $('#try-map-popup-arrow').remove();

        $("#menu-table td").removeClass("active");
        $(`#menu-table td[value="${page}"]`).addClass("active");

        $(`#page-${page}`).addClass("active");
        $(`#page-${current_page}`).removeClass("active");

        switch(current_page) {
            case "overview": { 
                closePageOverview();
            } break;
            case "reports": {
                closePageReports();
            } break;
            case "map": {
                closePageMap();
            } break;
        }

        switch(page) {
            case "overview": {
                openPageOverview();
            } break;
            case "reports": {
                openPageReports();
            } break;
            case "map": {
                openPageMap();
            } break;
        }

        current_page = page;

        
        updateHazard();
    }
}



function initPageHome() {
    for (var i = 1; i <= 5; i ++) {
        var collapser = new vlCollapsing('home-collapse-' + i, 'home-collapsing-'+i);
        collapser.collapse();
    }
}

function hideHeaderAndFooter() {
    $("#header-tr").toggleClass("hide");
    $("#footer-tr").toggleClass("hide");
    $("#try-map-popup").toggleClass("hide");
    $("#try-map-popup-arrow").toggleClass("hide");

    $("#hide-header-div").toggleClass("hide");
    $("#show-header-div").toggleClass("hide");

    // Move map overlay in/out
    if ($("#header-tr").hasClass('hide')) {
        $(`#map-region-overlay`).css('right', '25px');
    } else {
        $(`#map-region-overlay`).css('right', '');
    }

    // Adjust Maps to new size
    if (current_page == 'reports') {
        report_map.invalidateSize();
    } else if (current_page == 'map') {
        map_map.invalidateSize();
    }
}



// Loading Icon set up to only truly hide after recieving as many hideLoading()s as it recieved showLoading()s.
// This lets us have a number of those pairs around, & not worry about overlapping hides & shows
var loadingIconVisibleCount = 1;
function showLoading() {
    loadingIconVisibleCount += 1;
    $("#loading-popup").css("display", "block");
    $("#loading-popup").css("transform", "scaleY(0) translate(-68px, -136px)");
    setTimeout(function () {
        $("#loading-popup").css("transform", "scaleY(1) translate(-68px, 0px)");
    }, 20);
}
function hideLoading() {
    loadingIconVisibleCount -= 1;
    if (loadingIconVisibleCount == 0) {
        $("#loading-popup").css("transform", "scaleY(0) translate(-68px, -136px)");
        loadingIconVisible = false;
        setTimeout(function () {
            if (loadingIconVisibleCount == 0) {
                $("#loading-popup").css("display", "none");
            }
        }, 120);
    }
}








/* ============== FUNCTIONS USED TO INIT BOTH REPORT & MAP TAB ============== */




function addLegendsToMap(given_map) {
    // Adds the necessary legends to both the report & map maps
    
    given_map.addLegend("Inundation Depth", [
        ["0 - 20cm", "#8fd3d8"],
        ["20 - 50cm", "#79b2c0"],
        ["50 - 100cm", "#6290a8"],
        ["100cm +", "#4c6e90"]
    ], {
        legend_id: "inundation"
    });
    given_map.addLegend("Groundwater Height (85th PCTL)", [
        ["Within 70cm of ground surface", "#CBCCFA"],
        ["Up to or above ground surface", "#9790C1"]
    ], {
        legend_id: "groundwater",
        visible: false
    });
    given_map.addLegend("Probability of Erosion", [
        ["1 - 33% &nbsp;(Unlikely)", "#EADACE"],
        ["33 - 65%<br>(Likely as not)", "#C1A48B"],
        ["66 - 100% &nbsp;(Likely)", "#8F7565"]
    ], {
        legend_id: "erosion",
        visible: false
    });

    given_map.addLegend("Vulnerability", [
        ["High", "#c94040"],
        ["Medium", "#db7900"],
        ["Low", "#32b888"],
        ["Undefined", "#666"]
    ], {
        legend_id: "vulnerability",
        visible: false
    });
}



function initializeRegionDropdown(region_dropdown, given_map) {
    // Initializes the region dropdowns for both the report & map tabs

    // Create Non-Study Layer for given map
    given_map.addTopoLayer(non_study_area, {weight: 1, color: "#d4dadc", fillColor: "#C0C8CC", opacity: 1, fillOpacity: 0.7}, {
        layer_id: "non_study_area",
        pane: "marker",
        hover: true,
        hover_style: {fillColor: "#B0B8BC"},
        onmouseover: studyAreaOnMouseOver
    });

    // Create Regions Layer for given map
    given_map.addTopoLayer(areas, {weight: 1, color: "#d4dadc", fillColor: "#d4dadc", opacity: 1, fillOpacity: 0.7}, {
        filter: function() { return false; },
        layer_id: "regions",
        hover: false,
        pane: "marker"
    });
    /*given_map.addTopoLayer(areas, {weight: 1, color: "#6d858d", fillColor: "#6d858d", opacity: 0.6, fillOpacity: 0}, {
        filter: function() { return false; },
        layer_id: "regions_heightlight",
        hover: false,
        pane: "marker"
    });*/

    // Populate Regions Dropdown
    for (var region_name in region_ids) {
        region_dropdown.push(region_name);
    }

    // Set Onchange
    region_dropdown.onChange(function (value) {
        given_map.setView(centroids[value], 12);
        
        // Filter areas by current region
        given_map.applySettings("regions", {
            filter: function(feature) { return feature.properties.Area != value && value != "All Adaptation Areas"; }
        });
        /*given_map.applySettings("regions_heightlight", {
            filter: function(feature) { return feature.properties.Area == value && value != "All Regions"; }
        });*/

        if (current_page == 'reports' && report_asset_selected) {
            // Only update report data if report tab is open & an asset is selected
            openAssetReport(report_asset_selected.id);
        }
    });
    region_dropdown.setValue('Lyttelton-Mt Herbert');
}



function studyAreaOnMouseOver(hover_element, target, properties) {
    hover_element.html(`
    <div class="study-mouse-over">
        Out of Study Area
    </div>
    `);
}




function initializeBasemapSwitch(tab_id, given_map) {
    var basemap_switch = $(`#${tab_id} .basemap-switch-overlay`);
    basemap_switch.on('click', function () {
        var front = basemap_switch.find('.mid');
        basemap_switch.find('.back').removeClass('back').addClass('mid');
        basemap_switch.find('.front').removeClass('front').addClass('back');
        front.removeClass('mid').addClass('front');

        if (front.hasClass('normal')) {
            // Switch to normal basemap
            given_map.basemap('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_nolabels/{z}/{x}/{y}.png',
                {"detectRetina": false, "minZoom": 4,
                "noWrap": false, "subdomains": "abc"});
            
            $(`#${tab_id} .leaflet-labels-pane`).css('visibility', 'visible');

        } else if (front.hasClass('satellite')) {
            // Switch to satellite basemap
            given_map.basemap('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
                {attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community', "detectRetina": false, "minZoom": 4,
                "noWrap": false, "subdomains": "abc"});
            
            $(`#${tab_id} .leaflet-labels-pane`).css('visibility', 'visible');
            
        } else if (front.hasClass('contours')) {
            // Switch to contours basemap
            given_map.basemap('https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}',
                {attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ, TomTom, Intermap, iPC, USGS, FAO, NPS, NRCAN, GeoBase, Kadaster NL, Ordnance Survey, Esri Japan, METI, Esri China (Hong Kong), and the GIS User Community', "detectRetina": false, "minZoom": 4,
                "noWrap": false, "subdomains": "abc"});
            
            $(`#${tab_id} .leaflet-labels-pane`).css('visibility', 'hidden');
        }
    });
}