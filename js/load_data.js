
elos_list = [['No change - business as usual', 'As stored in individual homes, provided by FMCG suppliers who are still operating, or emergency food supply brought in with priority to vulnerable people', 'Access to a supplied supermarket or distribution point  within 2km  following an event for urban areas', '', 'Access to a supplied supermarket or distribution point within 2km in urban areas', 'At least 80% of individuals receive at least 80% of ‘BAU’ delivery'],
['No change - business as usual', 'Minimum of 3 litres per person per day , but recommended 20 litres per person per day, as stored at homes by individuals', '15-20 litres of potable  water per person per day  within 1km of the house', '', '80% of supply of potable water to 80% of customers', 'At least 80% of individuals receive at least 80% of ‘BAU’ delivery'],
['No change - business as usual', 'Walking access available', 'Walking access available, mobile phone charging & limited wifi', '', 'Walking access available, mobile phone charging & limited wifi', 'Walking access available, mobile phone charging & limited wifi'],
['No change - business as usual', 'Walking access available', 'Walking access available', '', 'Walking access available','Walking access available'],
['No change - business as usual', 'Access to priority users only', 'Access to priority users only', '', 'Walking access available to priority fuel stations','At least 80% of individuals receive at least 80% of ‘BAU’ delivery']]




/* ==== LOAD DISTANCES DATA ==== */

var distances = [];
var distances_loaded = false;

var blocks = [];
var blocks_loaded = false;

var destinations = [];
var destinations_loaded = false;

var islands;
var islands_loaded = false;

function checkLoaded() {
  return distances_loaded && blocks_loaded && destinations_loaded && islands_loaded;
}

var url = 'https://raw.githubusercontent.com/urutau-nz/wremo/master/data/results/distances.csv'; 
d3.csv(url, ({geoid, dest_type, distance, time}) => ({geoid: geoid, dest_type: dest_type, distance: +distance/1000, time:+time}), function(error, json) 
  {
    if(error)
    {
      return console.error(error);
    }
    distances = json;
    distances_loaded = true;

    if (DEBUGGING) {
        console.log("Distances Imported");
        console.log(distances);
    };
    
    if (checkLoaded()) {
        updateMap("supermarket", "0");
    }
  });


/* ==== LOAD BLOCKS DATA ==== */

var url = 'https://raw.githubusercontent.com/urutau-nz/wremo/master/data/results/blocks.topojson'; 
d3.json(url, function(error, json) 
  {
    if(error)
    {
      return console.error(error);
    }
    blocks = json;
    blocks_loaded = true;

    // This removes the duplicate geometry ids, by finding the point at which it starts looping,
    // and cutting the geometries off there.
    var prev = [];
    var filtered_geometries = [];
    for (geometry_id in blocks.objects.data.geometries){
        prop_id = blocks.objects.data.geometries[geometry_id].properties.id;
        if (!prev.includes(prop_id)) {
            prev.push(prop_id);
            filtered_geometries.push(blocks.objects.data.geometries[geometry_id]);
        }
    }
    blocks.objects.data.geometries = filtered_geometries;

    if (DEBUGGING) {
        console.log("Blocks Imported");
        console.log(blocks);
    };
    
    if (checkLoaded()) {
        updateMap("supermarket", "0");
    }
  });

  

/* ==== LOAD ISLANDS DATA ==== */

var url = "https://raw.githubusercontent.com/urutau-nz/wremo/master/data/results/islands2.json";
d3.json(url, function(error, json) {
  if(error)
  {
    return console.error(error);
  }
  islands = json;
  islands_loaded = true;

  if (DEBUGGING) {
      console.log("Islands Imported");
      console.log(islands);
  };
    
  if (checkLoaded()) {
      updateMap("supermarket", "0");
  }
})




/* ==== LOAD DESTINATIONS DATA ==== */

var url = 'https://raw.githubusercontent.com/urutau-nz/wremo/master/data/results/destinations.csv';
d3.csv(url, d3.autoType, function(error, json) {
  if(error)
  {
    return console.error(error);
  }
  destinations = json;
  destinations_loaded = true;

  if (DEBUGGING) {
      console.log("Destinations Imported");
      console.log(destinations);
  };
    
    if (checkLoaded()) {
        updateMap("supermarket", "0");
    }
})








/* ==== LOAD HISTROGRAM DATA ==== */
var histogram_data = [];
var temp_all_regions = [];
var url = "https://raw.githubusercontent.com/urutau-nz/wremo/master/data/results/access_bars.csv?";
d3.csv(url, d3.autoType, function(error, json) {
    if(error)
    {
      return console.error(error);
    }
    histogram_data = json;
  
    if (DEBUGGING) {
        console.log("Histogram Data Imported");
        console.log(histogram_data);

        var all_demos = [];
        for (data of histogram_data) {
          if (!all_demos.includes(data.group)) {
            all_demos.push(data.group);
          }
        }
        console.log(">> Demographics Found: ", all_demos);
        
        var all_demos = [];
        for (data of histogram_data) {
          if (!all_demos.includes(data.region)) {
            all_demos.push(data.region);
            if (!Object.keys(city_bounds).includes(data.region)) {
              temp_all_regions.push(data.region);
            }
          }
        }
        console.log(">> Regions Found: ", all_demos);
        console.log(">> New Regions Found: ", temp_all_regions);
    };

    updateFilteredHistogramData("supermarket", "0", "population");
})



/* ==== LOAD PARCEL DESTINATIONS DATA ==== */

var parcel_dists;
var url = 'https://projects.urbanintelligence.co.nz/wremo/data/parcel_distances.csv';
d3.csv(url, d3.autoType, function(error, json) {
  if(error)
  {
    return console.error(error);
  }
  parcel_dists = json;

  if (DEBUGGING) {
      console.log("Parcel destinations Imported");
      console.log(parcel_dists);
  };

  $("#simulate_button").addClass("active");
})

/* ==== LOAD ORIGINS DATA ==== */

var origins;
var url = 'https://raw.githubusercontent.com/urutau-nz/wremo/master/data/results/origins.csv';
d3.csv(url, d3.autoType, function(error, json) {
  if(error)
  {
    return console.error(error);
  }
  origins = json;

  if (DEBUGGING) {
      console.log("Origins Imported");
      console.log(origins);
  };
})




  

/* Updates filtered_distances to distances filtered by the user's current selections.
Params:
  amenity - String code for an amenity.
  time - String of integer 0-6, representing time passed after the disaster.
*/
var filtered_distances = [];
var distances_by_geoid = {};
function updateFilteredDistances(amenity, time) {
    filtered_distances = distances.filter(d => d.dest_type == amenity && d.time == time);
    distances_by_geoid = Object.assign({}, ...filtered_distances.map((d) => ({[d.geoid]: d.distance})));

    if (DEBUGGING) {
        console.log("Updated Filtered Distances");
        console.log(">> " + amenity);
        console.log(">> " + time);
        console.log(filtered_distances);
    };
}


/* Updates filtered_destinations to destinations filtered by the user's current selections.
Params:
  amenity - String code for an amenity.
*/
var filtered_destinations = [];
function updateFilteredDestinations(amenity) {
    filtered_destinations = destinations.filter(d => d.dest_type == amenity);

    if (DEBUGGING) {
        console.log("Updated Filtered Destinations");
        console.log(">> " + amenity);
        console.log(filtered_destinations);
    };
}


var filtered_histogram_data = [];
function updateFilteredHistogramData(amenity, time, demographic, region="All") {
    filtered_histogram_data = histogram_data.filter(d => d.service == amenity && d.time == time &&
                                                    d.region == region && d.distance < 10 &&
                                                    d.group == demographic); // Add Demographics && Region

    if (DEBUGGING) {
        console.log("Updated Filtered Histrogram Data");
        console.log(">> " + amenity);
        console.log(">> " + time);
        console.log(filtered_histogram_data);
    };
}


/* Updates entire map */
function updateMap(amenity, time) {
  if (!LOADED) {
      var wait_to_load = setInterval(function() {
          if (LOADED) {
              clearInterval(wait_to_load); 
              updateMap(amenity, time);
          }
      }, 100);
  } else {
      updateFilteredDistances(amenity, time);
      updateFilteredDestinations(amenity);
      updateFilteredHistogramData(amenity, time, demographicMenu.value, locMenu.value);

      updateBlocks();
      updateMarkers();
      updateIsland();
      updateGraph();
      setAvailabilityLegend();
  }
}