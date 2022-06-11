


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

    }
}



function initPageHome() {
    for (var i = 1; i <= 7; i ++) {
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
    $("#loading-popup").css("transform", "scaleY(0)");
    setTimeout(function () {
        $("#loading-popup").css("transform", "scaleY(1)");
    }, 20);
}
function hideLoading() {
    loadingIconVisibleCount -= 1;
    if (loadingIconVisibleCount == 0) {
        $("#loading-popup").css("transform", "scaleY(0)");
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
        ["5 - 33% &nbsp;(Unlikely)", "#EADACE"],
        ["33 - 65% &nbsp;(Even)", "#C1A48B"],
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
    given_map.addTopoLayer(non_study_area, {weight: 1, color: "#d4dadc", fillColor: "#d4dadc", opacity: 1, fillOpacity: 0.7}, {
        layer_id: "non_study_area",
        pane: "marker",
        hover: true,
        hover_style: {},
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
    region_dropdown.setValue('All Regions');

    // Set Onchange
    region_dropdown.onChange(function (value) {
        given_map.setView(centroids[value], 12);
        
        // Filter areas by current region
        given_map.applySettings("regions", {
            filter: function(feature) { return feature.properties.Area != value && value != "All Regions"; }
        });
        /*given_map.applySettings("regions_heightlight", {
            filter: function(feature) { return feature.properties.Area == value && value != "All Regions"; }
        });*/

        if (current_page == 'reports' && report_asset_selected) {
            // Only update report data if report tab is open & an asset is selected
            openAssetReport(report_asset_selected.id);
        }
    });
}



function studyAreaOnMouseOver(hover_element, target, properties) {
    hover_element.html(`
    <div class="vulnerability-highlight" style="background-color:#F00">
    </div>
    <table>
        <tr>
            <td class="header-td">
                Out of Study Area
            </td>
        </tr>
    </table>
    `);
}
