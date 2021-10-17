/* ==== TOP RIGHT UI ELEMENT ==== */

var amenity_legend = L.control({position: 'topright'});

amenity_legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend');

    title = '<h4 id="time_header">Level of Service ' + 
            '<a id="helpLink" title="Help!" href="#" onclick="showHelpPopup();return false;"><img class="qimg" src="qmark.svg"></a>' + 
            '</h4>';


    amenity_drop = '<h3>Amenity/Service:</h3>' + 
                  '<select name="amenity" id="amenityDropDown">' +
                  '  <option value="supermarket">Supermarkets</option>' +
                  '  <option value="water">Water Points</option>' +
                  '  <option value="EM_hubs">Emergency Management Hubs</option>' +
                  '  <option value="health_services">Health Services</option>' +
                  '  <option value="fuel_station">Fuel Stations</option>' +
                  '</select>';
    
    location_drop = '<td><h3 style="display:inline">Region:</h3></td>' + 
                    '<td><div id="location_drop_div" style="float: right"><select class="location_drop" id="regionDropDown">';
    for (bound_name in city_bounds) {
        location_drop += '<option value="' + bound_name + '">' + bound_name + '</option>';
    }
    location_drop += '</select></div></td>';

    simulate_button = '<button id="simulate_button" onclick="showExpectPopup()">What can I expect?</button>';

    demographic_drop = '<td><h3 style="display:inline">Sociodemographic:</h3></td>' + 
                    '<td><div id="location_drop_div" style="float: right"><select class="location_drop" id="demographicDropDown">' + 
                    '<option value="population">Population</option>' +
                    '<option value="difficulty_walking">Difficulty Walking</option>' +
                    '<option value="social_deprivation_1-5">Social Deprivation Index 1-5</option>' +
                    '<option value="social_deprivation_6-10">Social Deprivation Index 6-10</option>' +
                    '</select></div></td>';

    div.innerHTML = title + '<hr>'  + amenity_drop + '<hr><table><tr>' + location_drop + '</tr><tr>' + demographic_drop + '</tr></table><hr>' + simulate_button;// + '<hr>' + docsUploader + '<hr>' + submit + '</form><hr>' + download;
    
    return div;
};

amenity_legend.addTo(map);


/* Updates the map on changing amenity selection.
*/
var amenityMenu = document.getElementById("amenityDropDown");
amenityMenu.onchange = function() {

    // Change legend if amenity is Water Points (half it)
    if (amenityMenu.value == "water") {
        for (colset of cmap) {
            colset.lower = colset.default / 2;
            colset.upper = colset.default / 2 + 1;
        }
    } else {
        for (colset of cmap) {
            colset.lower = colset.default;
            colset.upper = colset.default + 2;
        }
    }

    updateELOS();
    setScaleLegend();
    updateMap(amenityMenu.value, timeValue);
}

/* Relocates map to focus on region selected, when region is selected. 
*/
var locMenu = document.getElementById("regionDropDown");
locMenu.onchange = function() {
    map.fitBounds(city_bounds[locMenu.value]);
    updateFilteredHistogramData(amenityMenu.value, timeValue, demographicMenu.value, locMenu.value);
    updateGraph();
    updateIsland();
}

/* Updates the graph on changing demographic selection.
*/
var demographicMenu = document.getElementById("demographicDropDown");
demographicMenu.onchange = function() {
    updateFilteredHistogramData(amenityMenu.value, timeValue, demographicMenu.value, locMenu.value);
    updateGraph();
}







/* ==== TOP LEFT UI ELEMENT ==== */

var time_legend = L.control({position: 'topleft'});

time_legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend');
    div.id = "timeRadioButtons";

    time_slider = '<h3 style="text-align:left;margin:6px 0;">Time since disruption:</h3>' +
              '<label><input type="radio" name="timeRadio" class="radio" value="0" checked="checked"/> Before</label> ' +
                '<label><input type="radio" name="timeRadio" class="radio" value="1"/> 0-7 days</label> ' +
                '<label><input type="radio" name="timeRadio" class="radio" value="2"/> 8-14</label> ' +
                '<label><input type="radio" name="timeRadio" class="radio" value="3"/> 15-30</label> ' +
                '<label><input type="radio" name="timeRadio" class="radio" value="4"/> 31-90</label> ' +
                '<label><input type="radio" name="timeRadio" class="radio" value="5"/> 90+</label> <br>';

    div.innerHTML = time_slider;
    
    return div;
};

time_legend.addTo(map);

 // When Radio Button clicked, sets timeValue to its value, and updates map.
var timeRadio = document.getElementById("timeRadioButtons");
var timeValue = 0;
timeRadio.onchange = function(e) {
    var target = e.target;
    timeValue = target.value;
    updateELOS();
    updateMap(amenityMenu.value, timeValue);
}

// ELOS Element

var elos_legend = L.control({position: 'topleft'});

elos_legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend');
    div.id = "elosLegend";

    time_slider = `<h3>ELOS: <span style="font-weight:normal">${getELOS()} <span></h3>`;

    div.innerHTML = time_slider;
    
    return div;
};

elos_legend.addTo(map);

function getELOS() {

    var amenity_ids = {"supermarket": 0,
                        "water": 1,
                        "EM_hubs": 2,
                        "health_services": 3,
                        "fuel_station": 4};
    
    return `${elos_list[amenity_ids[amenityMenu.value]][(timeValue == 3 ? 2 : timeValue)]}`;
}

function updateELOS() {
    var elem  = $("#elosLegend span").get(0);
    elem.innerHTML = getELOS();
}










/* ==== BOTTOM LEFT UI ELEMENTS ==== */

let scale_legend = L.control({ position: 'bottomleft' });
scale_legend.onAdd = function(map) {
    var div = L.DomUtil.create('div', 'info legend');
    div.id = "scale_legend";
    
    setScaleLegend(div);
    
    return div;
};
scale_legend.addTo(map);

/* Generates the contents of the Scale Legend in the bottom right.
*/
function setScaleLegend(div = null) {
    if (!div) div = document.getElementById("scale_legend");

    var labels = [];
    labels.push('<tr>' + 
        '<td class="legend cblock" id="legi" style="color: #FFF; background: #000"></td>' +
        '<td class="ltext">Isolated</td></tr>');
    cmap.forEach( function(v) {
      labels.push('<tr>' + 
          '<td class="legend cblock" id="leg' + v.idx + '" style="color:' + v.text + '; background:' + v.fill + '"></td>' +
          '<td class="ltext">' + v.lower + (v.idx == 0 ? '+' : '-' + v.upper) + ' km</td></tr>');
    });
    labels.reverse();

    table = '<table id="legend_table">' + labels.join('') + '</table>';
    
    div.innerHTML = '<h3 style="font-size:0.9rem;margin:0.2rem;">Walking Distance:</h3>' + table;
}

/* Availability Legend
*/
let availability_legend = L.control({ position: 'bottomleft' });
availability_legend.onAdd = function(map) {
    var div = L.DomUtil.create('div', 'info legend');
    div.id = "availability_legend";

    return div;
};
availability_legend.addTo(map);

function setAvailabilityLegend(div = null) {
    if (!div) div = document.getElementById("availability_legend");
    
    var counts = [0,0,0];
    for (dest of filtered_destinations) {
        counts[dest[timeValue]-1] += 1;
    }

    var labels = [];
    labels.push('<tr>' + 
        '<td class="legend cblock" style="padding-left:4px;font-size: 16px;color: ' + cdest[1] + '">	⬤</td>' +
        '<td class="ltext" style="width: 3.2rem;">Open </td>' +
        '<td style="width:1rem; font-size: 14px; text-align: center; font-weight: bold;">' + counts[0] + '</td></tr>');
    labels.push('<tr>' + 
        '<td class="legend cblock" style="padding-left:4px;font-size: 16px;color: ' + cdest[2] + '">	⬤</td>' +
        '<td class="ltext" style="width: 3.2rem;">Open*  </td>' +
        '<td style="width:1rem; font-size: 14px; text-align: center; font-weight: bold;">' + counts[1] + '</td></tr>');
    labels.push('<tr>' + 
        '<td class="legend cblock" style="padding-left:4px;font-size: 16px;color: ' + cdest[3] + '">	⬤</td>' +
        '<td class="ltext" style="width: 3.2rem;">Closed  </td>' +
        '<td style="width:1rem; font-size: 14px; text-align: center; font-weight: bold;">' + counts[2] + '</td></tr>');
    

    table = '<table id="legend_table">' + labels.join('') + '</table>';
    table += '<span style="font-style:italic;font-size:11px;line-height:0px;">*Priority customers<br>and stock dependent.</span>'
    
    div.innerHTML = '<h3 style="font-size:0.9rem;margin:0.2rem;">Destinations:</h3>' + table;
}



/* Lower-Right Graph
*/
let graph_legend = L.control({ position: 'bottomright' });
graph_legend.onAdd = function(map) {
    var div = L.DomUtil.create('div', 'info legend');
    div.id = "dist-graph";

    return div;
};
graph_legend.addTo(map);

/*
// REMOVE THIS !!!!!!!!!!!    A TOOL TO GET THE BOUNDS OF THE CURRENT VIEWPORT
document.getElementById("dist-graph").onclick = function() {
    var b = map.getBounds();
    console.log('"' + temp_all_regions.pop() + '"  : [[' + b._northEast.lat + ', ' +  b._northEast.lng + '], [' + 
                                                           b._southWest.lat + ', ' + b._southWest.lng + ']],');
}
*/





// Gives Info on Q-mark click
function showHelpPopup(){
    var popup = document.getElementById("help-popup");

    // If Help Popup isn't populated yet, populate.
    if (popup.innerHTML == "") {

        var content = "<h2>Additional Information</h2>" +
            "This pop up will provide additional information.<br>" + 
            "We just haven't determined what that information will be yet.<br>" + 
            "<br>" +
            "However, it's important to have a decent amount of text here, in anticipation of the large amount of text that we may, or may not, eventually add to this rather helpful help box.<br>" + 
            "<br>" +
            "Truly, the possibilities are endless.<br>" + 
            "<br><br>" +
            '<span class="contact">Have suggestions or feedback? Contact us at <a href="mailto:info@urbanintelligence.co.nz?subject=About Your WREMO Project...">info@urbanintelligence.co.nz</a></span>';
        
        var button = '<button onclick="hideHelpPopup()">&#10006;</button>';
        
        popup.innerHTML = button + content;
    }
    popup.style.display = "block";

    var mouse_info = document.getElementById("mouseInfo");
    mouse_info.style.visibility = "hidden";
}
function hideHelpPopup() {
    var popup = document.getElementById("help-popup");
    popup.style.display = "none";
}





// Gives Expectation by Address
function showExpectPopup(){
    var popup = document.getElementById("expect-popup");
    popup.style.display = "block";

    var backdrop = document.getElementById("popup-backdrop");
    backdrop.style.display = "block";

    var mouse_info = document.getElementById("mouseInfo");
    mouse_info.style.visibility = "hidden";
}
function hideExpectPopup() {
    var popup = document.getElementById("expect-popup");
    popup.style.display = "none";

    var backdrop = document.getElementById("popup-backdrop");
    backdrop.style.display = "none";
}




// Region Info Follows Mouse (Also known as the distance pop-up)
let info_legend = L.control({position: 'topleft'});
info_legend.onAdd = function(map) {
    var div = L.DomUtil.create('div', 'info legend');
    div.id = "mouseInfo";
    div.style.position = "absolute";
    div.style.whiteSpace = "nowrap";
    div.style.fontSize = "15px";
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
}

