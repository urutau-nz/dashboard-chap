function geocoding(address, geo_bounds = [], number_result = 1) {
    let viewbox =
      geo_bounds && geo_bounds[0] && geo_bounds[1]
        ? `&viewbox=${geo_bounds[0][0]},${geo_bounds[0][1]},${geo_bounds[1][0]},${geo_bounds[1][1]}`
        : "";
    return fetch(
      `https://nominatim.openstreetmap.org/search/${address}?format=json&limit=${number_result}${viewbox}`,
      { referrer: "https://observablehq.com/@pierreleripoll/geocoding-nominatim" }
    )
      .then(res => {
        if (res.ok && res.json) {
          return res.json();
        } else {
          return {
            error: `Position not found for address = ${address}`
          };
        }
      })
      .catch(err => {
        return { error: err };
      });
}

function c_max(numArray) {
    var val = numArray[0];
    for (new_val of numArray) {
      if (new_val > val) val = new_val;
    }
    return val;
}

function c_min(numArray) {
  var val = numArray[0];
  for (new_val of numArray) {
    if (new_val < val) val = new_val;
  }
  return val;
}

function c_minIndex(numArray) {
    return numArray.indexOf(c_min(numArray));
}

function c_maxIndex(numArray) {
    return numArray.indexOf(c_max(numArray));
}

function c_round(num, level) {
    return Math.round(num * (10**level)) / (10**level)
}



function fillTableItem(identifier, dist, color) {
  if (dist && dist > 0) {
    $(identifier).text(dist);
    $(identifier).css("background-color", color+"33");
    $(identifier).css("color", color);
  } else {
    $(identifier).text("No Access"); // No Access
    $(identifier).css("background-color", "#BBB3");
    $(identifier).css("color", "#BBB");
  }
}


function parseDistances(csv_obj) {
  var out = [];
  for (var i=0; i < 6; i++) {
    var val = csv_obj['dist_'+i];
    if (i > 0 && val == 0) {
      val = out[0];
    } else if (val == -1) {
      val = null;
    } else if (i > 1 && val == -2) {
      val = out[out.length-1];
    } else {
      val /= 1000;
    }
    out.push(val);
  }
  return out;
}




// WHAT CAN I EXPECT MENU
document.getElementById("expect-address").addEventListener('input', function () {
    $("#expect-reload").addClass("active");
});
document.getElementById("expect-watertrips").addEventListener('input', function () {
    $("#expect-reload").addClass("active");
});
document.getElementById("expect-supermarkettrips").addEventListener('input', function () {
    $("#expect-reload").addClass("active");
});
document.getElementById("expect-emhubtrips").addEventListener('input', function () {
    $("#expect-reload").addClass("active");
});

async function reloadExpectedWalkingDistance() {
    $("#expect-reload").addClass("spinning");

    var address = document.getElementById("expect-address").value;
    var water_use = document.getElementById("expect-watertrips").value;
    var food_use = document.getElementById("expect-supermarkettrips").value;
    var EM_use = document.getElementById("expect-emhubtrips").value;

    
    // Generate Position
    var position;

    const t1 = performance.now();
    let result = await geocoding(address);
    if (result[0]) {
        result[0].time = performance.now() - t1;
        position = result[0];
    } else position = result;

    var x = parseFloat(position.lon);
    var y = parseFloat(position.lat);

    console.log(x,y);
    if (-40.66397287638688 > y &&  176.39373779296875 > x && y > -41.600040006763784 && x > 174.5878601074219) {
      $("#expect-error").css("display", "none");
      $("#expect-error-backdrop").css("display", "none");


      //Find closest origin
      var xy_array = origins.map(d => (d['x']-x)**2 + (d['y']-y)**2);

      orig_id = origins[c_minIndex(xy_array)].id;

      // Find Amenity Distances
      var food_dist = parseDistances(parcel_dists.filter(function(d) { 
              return ( d.dest_type == 'supermarket' && d.geoid == orig_id)
          })[0]);
      
      var water_dist = parseDistances(parcel_dists.filter(function(d) { 
              return ( d.dest_type == 'water' && d.geoid == orig_id)
            })[0]);

      var EM_dist = parseDistances(parcel_dists.filter(function(d) { 
              return ( d.dest_type == 'EM_hubs' && d.geoid == orig_id)
            })[0]);
      
      //Fill Table
      var water_results = [];
      for (var i = 0; i < 6; i++) {
        var dist = c_round(water_use * water_dist[i] * 2, 2);
        water_results.push(dist);
        fillTableItem(`#expect-results tr:eq(1) td:eq(${i+1})`, dist, getColor(water_dist[i]));
      }
      var food_results = [];
      for (var i = 0; i < 6; i++) {
        var dist = c_round(food_use * food_dist[i] * 2, 2);
        food_results.push(dist);
        fillTableItem(`#expect-results tr:eq(2) td:eq(${i+1})`, dist, getColor(food_dist[i]));
      }
      var emhub_results = [];
      for (var i = 0; i < 6; i++) {
        var dist = c_round(EM_use * EM_dist[i] * 2, 2);
        emhub_results.push(dist);
        fillTableItem(`#expect-results tr:eq(3) td:eq(${i+1})`, dist, getColor(EM_dist[i]));
      }
      for (var i = 0; i < 6; i++) {
        var total = c_round((water_results[i] ? water_results[i] : 0) + 
                            (food_results[i] ? food_results[i] : 0) + 
                            (emhub_results[i] ? emhub_results[i] : 0),2);
        if (!total || total <= 0) total = "";
        $(`#expect-results tr:eq(4) td:eq(${i+1})`).text(total);
      }
    } else {
      $("#expect-error").text("Address Invalid!");
      $("#expect-error").css("display", "block");
      $("#expect-error-backdrop").css("display", "block");
    }
    
    $("#expect-reload").removeClass("active");
    $("#expect-reload").removeClass("spinning");
}