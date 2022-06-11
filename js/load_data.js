


/* MODULAR IMPORTS */

var import_manager = new ImportManager();
/*
import_manager.addImport('isolation_county', 'Isolated County Pops', 'csv', 
    'https://raw.githubusercontent.com/urutau-nz/dashboard-slr-usa/master/data/results/isolation_county.csv',
    (d) => ({geoid: d.geoid_county, year: +d.year, rise: +d.rise, pop: +d.count}));
*/

var import_url = '';
if (domain == 'test') {
  import_url = `https://test.urbanintelligence.co.nz/chap`;
} else {
  import_url = `https://projects.urbanintelligence.co.nz/chap`;
}

import_manager.addImport('priority_areas', 'Adaptation Priority Areas', 'json', 
import_url + `/data/adaptation_priority_areas.topojson`);

import_manager.addImport('non_study_area', 'Non Study Area', 'json', 
import_url + `/data/non-study-area.json`);

import_manager.addImport('hazard_info', 'Hazard CSV', 'csv', 
import_url + `/data/hazard_info.csv`);

import_manager.addImport('asset_info', 'Asset CSV', 'csv', 
import_url + `/data/website_assets.csv`);

/*
import_manager.addImport('exposure_built', 'Exposure Built CSV', 'csv', 
import_url + `/data/exposure_built.csv`,
(d) => ({asset_id: d.asset_id, hazard_scenario: d.hazard_scenario, exposure: d.exposure})); // For hover-over data
*/

import_manager.addImport('asset_descriptions', 'Asset Descriptions CSV', 'csv', 
import_url + `/data/reports.csv`);

import_manager.addImport('built_points', 'Built Points CSV', 'csv', 
import_url + `/data/built_points.csv`);

import_manager.addImport('natural_points', 'Natural Points CSV', 'csv', 
import_url + `/data/natural_points.csv`);

import_manager.addImport('human_points', 'Human Points CSV', 'csv', 
import_url + `/data/human_points.csv`);

import_manager.addImport('cultural_points', 'Cultural Points CSV', 'csv', 
import_url + `/data/cultural_points.csv`);

import_manager.addImport('domain_status', 'Domain Statuses CSV', 'csv', 
import_url + `/data/domain_status.csv`);


import_manager.onComplete(importsComplete);
import_manager.runImports();


var areas;
var hazard_info;
var asset_info;
var assets;
var informative_assets = {};
var asset_descriptions;
var built_points;
var human_points;
var natural_points;
var cultural_points;
var domain_status;
var non_study_area;

var groups_and_single_layers = [];

var asset_groups = {};


function importsComplete(imports) {

  areas = imports['priority_areas'];
  non_study_area = imports['non_study_area'];
  hazard_info = imports['hazard_info'];
  asset_info = imports['asset_info'];
  built_points = imports['built_points'];
  human_points = imports['human_points'];
  natural_points = imports['natural_points'];
  cultural_points = imports['cultural_points'];
  asset_descriptions = imports['asset_descriptions'];
  domain_status = imports['domain_status'];

  asset_info.sort((x, y) => {
    if (x.display_name < y.display_name) {return -1;}
    if (x.display_name > y.display_name) {return 1;}
    return 0;
  });


  // Build Assets Dict
  var index = 0;
  assets = {};
  asset_info.forEach(
    function (d) {
      // Get Points for this asset
      var points = null;
      if (d.file_type == 'point') {
        if (d.domain == 'built') {
          points = built_points.filter(f => f.asset_tag == d.asset_tag);
        } else if (d.domain == 'natural') {
          points = natural_points.filter(f => f.asset_tag == d.asset_tag);
        } else if (d.domain == 'human') {
          points = human_points.filter(f => f.asset_tag == d.asset_tag);
        } else if (d.domain == 'cultural') {
          points = cultural_points.filter(f => f.asset_tag == d.asset_tag);
        }
      }


      // Add asset
      if (d.domain == 'informative') {
        informative_assets[d.asset_tag] = {
          display_name: d.display_name,
          name: d.display_name,
          file_name: import_url + '/data/' + d.domain + '_assets/' + d.asset_tag + '.topojson',
          instances_file_name: import_url + '/data/asset_instances/' + d.asset_tag + '.csv',
          domain: d.domain,
          id: d.asset_tag,
          type: d.file_type, // Either POLYGON, POLYLINE or POINT
          points: points
        };
        
      } else {
        // NOT INFORMATIVE ASSET, NORMAL ASSET
        assets[d.asset_tag] = {
          display_name: d.display_name,
          name: d.display_name,
          file_name: import_url + '/data/' + d.domain + '_assets/' + d.asset_tag + '.topojson',
          instances_file_name: import_url + '/data/asset_instances/' + d.asset_tag + '.csv',
          domain: d.domain,
          group: d.asset_group,
          id: d.asset_tag,
          type: d.file_type, // Either POLYGON, POLYLINE or POINT
          points: points
        };
      }

      // Compile asset groups
      if (d.asset_group) {
        if (!Object.keys(asset_groups).includes(d.asset_group)) {
          asset_groups[d.asset_group] = [];
        }
        asset_groups[d.asset_group].push(d.asset_tag);
      }

      index ++;
    }
  );
  

  // Collect options, both layers & groups
  for (var asset_id in assets) {
      var asset = assets[asset_id];

      if (!asset.group) {
          // Not in a group, so add
          groups_and_single_layers.push(asset_id);
      } else if (!groups_and_single_layers.includes(asset.group)) {
          // Group is not yet added, so add
          groups_and_single_layers.push(asset.group);
      }
  }
  // Arrage alphabetically
  groups_and_single_layers.sort((x, y) => {
      if (x.toLowerCase() < y.toLowerCase()) {return -1;}
      if (x.toLowerCase() > y.toLowerCase()) {return 1;}
      return 0;
  });

  initMap();
}





  
var domain_titles = {'built': 'Built Domain',
'cultural': 'Cultural Domain',
'natural': 'Natural Domain',
'human': 'Social Domain'
};

var centroids = {
  "All Regions": {lat: -43.5025469, lng: 172.6798971},
  "Akaroa Wairewa": {lat: -43.76843673, lng: 172.8636687},
  "Open Coast": {lat: -43.50655657, lng: 172.7235934},
  "Styx": {lat: -43.44038741, lng: 172.676245},
  "Avon": {lat: -43.5025469, lng: 172.6798971},
  "Estuary to Sumner": {lat: -43.56595513, lng: 172.7347677},
  "Heathcote": {lat: -43.55728148, lng: 172.6798259},
  "Lyttelton-Mt Herbert": {lat: -43.64895336, lng: 172.7456975}
};

var region_ids = {'All Regions': 'all',
  'Styx' : 'styx' ,
  'Avon': 'avon',
  'Open Coast': 'open_coast',
  'Heathcote': 'heathcote',
  'Estuary to Sumner' : 'estuary_to_sumner',
  'Lyttelton-Mt Herbert': 'lyttelton_mt_herbert',
  'Akaroa Wairewa' : 'akaroa_wairewa'
};

var domain_colors = {'built': '#ffb670',
'cultural': '#fb7b8f',
'natural': '#b3e36e',
'human': '#85b6df',
"overview": "#63e5c2"
};

var domain_map_colors = {'built': '#DA7B1C',
'cultural': '#D74343',
'natural': '#5FB944',
'human': '#5959C1',
"overview": "#1C8E6A"
};

var domain_text_colors = {'built': '#763100',
'cultural': '#780021',
'natural': '#037c09',
'human': '#34229d',
"overview": "#005652"
};

var domain_highlight_colors = {'built': '#ffe2af',
'cultural': '#ffbdbd',
'natural': '#ceffbf',
'human': '#cdcdff',
"overview": "#a1f4da"
};

var assets_to_tile = [/*
  "water_supply_network_pipes",
  "roads",
  "wastewater_network_pipes",
  "stormwater_network_pipes"*/
];























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




  
  

/* First update to map */
function initMap() {
  if (!LOADED) {
      var wait_to_load = setInterval(function() {
          if (LOADED) {
              clearInterval(wait_to_load); 
              initMap();
          }
      }, 100);
  } else {
    // Initialize all pages
    initPageHome();
    initPageReports();
    initPageMap();
    initPageOverview();

    // Initialize other aspects
    initFilters();

    // Let user in
    tncCheckboxChange();

    hideLoading();
  }
}

