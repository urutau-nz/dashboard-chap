


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
import_url + `/data/adaptation_priority_areas.json`);

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

import_manager.addImport('domain_status', 'Domain Statuses CSV', 'csv', 
import_url + `/data/domain_status.csv`);


import_manager.onComplete(importsComplete);
import_manager.runImports();


var areas;
var asset_info;
var assets;
var asset_descriptions;
var built_points;
var domain_status;


function importsComplete(imports) {

  areas = imports['priority_areas'];
  hazard_info = imports['hazard_info'];
  asset_info = imports['asset_info'];
  built_points = imports['built_points'];
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
      assets[d.asset_tag] = {
        display_name: d.display_name,
        name: d.display_name,
        file_name: import_url + '/data/' + d.domain + '_assets/' + d.asset_tag + '.topojson',
        exposure_file_name: import_url + '/data/exposure_values/exposure_' + d.asset_tag + '.csv',
        category: d.domain,
        id: d.asset_tag,
        type: d.file_type // Either TOPOJSON or POINTS
      };

      index ++;
    }
  );



  initMap();
}





  
var category_titles = {'built': 'Built Domain',
'cultural': 'Cultural Domain',
'natural': 'Natural Domain',
'human': 'Human Domain'
};

var centroids = {
  "All": {lat: -43.5025469, lng: 172.6798971},
  "Akaroa Wairewa": {lat: -43.76843673, lng: 172.8636687},
  "Open Coast": {lat: -43.50655657, lng: 172.7235934},
  "Styx": {lat: -43.44038741, lng: 172.676245},
  "Avon": {lat: -43.5025469, lng: 172.6798971},
  "Estuary to Sumner": {lat: -43.56595513, lng: 172.7347677},
  "Heathcote": {lat: -43.55728148, lng: 172.6798259},
  "Lyttelton-Mt Herbert": {lat: -43.64895336, lng: 172.7456975}
};

var region_ids = {'All': 'all',
  'Styx' : 'styx' ,
  'Avon': 'avon',
  'Open Coast': 'open_coast',
  'Heathcote': 'heathcote',
  'Estuary to Sumner' : 'estuary_to_sumner',
  'Lyttelton-Mt Herbert': 'lyttelton_mt_herbert',
  'Akaroa Wairewa' : 'akaroa_wairewa'
};

var category_colors = {'built': '#ffcb6d',
'cultural': '#ff8686',
'natural': '#a6ff8b',
'human': '#A4A4FF',
"overview": "#54ebbc"
};

var category_map_colors = {'built': '#DA7B1C',
'cultural': '#D74343',
'natural': '#5FB944',
'human': '#5959C1',
"overview": "#1C8E6A"
};

var category_text_colors = {'built': '#763100',
'cultural': '#780021',
'natural': '#037c09',
'human': '#34229d',
"overview": "#005652"
};

var category_highlight_colors = {'built': '#ffe2af',
'cultural': '#ffbdbd',
'natural': '#ceffbf',
'human': '#cdcdff',
"overview": "#a1f4da"
};

var assets_to_tile = [
  "water_supply_network_pipes",
  "roads",
  "wastewater_network_pipes",
  "stormwater_network_pipes"
]

























/* ==== DATALAYER DEFINITION ==== */
/* - Used to control adding & removing layers of topojson data 
*/
var all_hazards = {};

class Layer {
  constructor(id, name, category) {
    this.id = id;
    this.name = name;
    this.category = category;

    this.visible = false;

    this.layer = null;
  }


  addToHazards(hazard_description) {
    all_hazards[this.id] = this;
    this.hazard_description = hazard_description;
    return this;
  }

  displayLegend() {    
    content = '<table id="legend_table">';
    for (var i=0; i < this.legend_values.length; i++) {
      var color = this.legend_colors[i];
      content += '<tr><td class="cblock" style="background: ' + color + ';)"></td><td class="ltext">' + this.legend_values[i] + '</td></tr>';
    }
    content += '</table>';

    $('#hazard_legend').html('<h3 style="font-size:0.9rem;margin:0.2rem;">' + this.legend_header + ' (' + this.legend_unit + ')</h3>' + content);
    $('#hazard_legend').css('display', 'block');
  }
  removeLegend() {
    $('#hazard_legend').css('display', 'none');
  }
  addLegend(header, unit, values, colors=null) {
    this.legend_header = header;
    this.legend_unit = unit;
    this.legend_values = values;
    if (colors) {
      this.legend_colors = colors;
    } else {
      this.legend_colors = [];
      for (var i in values) {
        var alpha = 1/(values.length) * (parseInt(i)+1);
        this.legend_colors.push('rgba(0,30,140,'+alpha+')');
      }
    }
    return this;
  }


  display() {
    if (!this.visible) {
      this.visible = true;
      
      if (this.legend_header) {
        this.displayLegend();
      }
      if (this.hazard_description) {
        $("#hazard_text").text(this.hazard_description);
      }
    }
  }
  remove() {
    // Hide this.element
    if (this.layer) {
      map.removeLayer(this.layer);
      this.layer = null;
    }
    if (this.visible) {
      if (this.hazard_description) {
        $("#hazard_text").text('');
      }
      if (this.legend_header) {
        this.removeLegend();
      }
      this.visible = false;
    }
  }
  update() {
  }
}


class DataLayer extends Layer {
  constructor(id, name, category, color, topojson, tiling=false, style_func=null) {
    super(id, name, category);

    this.topojson = topojson;
    console.log(this.topojson);

    this.style_func = style_func;

    this.opacity = 0.4;

    this.tiled = tiling;

    this.default_style = this.default_style_generator();
    this.onEachFeature = this.onEachFeatureGenerator();
  }
  onEachFeatureGenerator() {
    var myself = this;
    return function (feature, layer) { 
      feature.datalayer = myself;
      layer.on({
          mouseover: function(e) {
            var color = category_text_colors[myself.category];
              e.target.setStyle({
                weight: 8,
                opacity: 1,
                fillOpacity: 1,
              });

              // Update Mouse Info
              var mouse_info = document.getElementById("mouse-info");
              mouse_info.style.visibility = "visible";
              mouse_info.style.background = "rgb(255,255,255)";

              //console.log(filter_values.hazard, hover_data, e.target.feature.properties.asset_id, hover_data[e.target.feature.properties.asset_id]);
              
              var hover_val = "";
              if (hover_data[e.target.feature.properties.asset_id]) {
                if (filter_values.hazard.toLowerCase() == 'erosion') {
                  hover_val = `${hover_data[e.target.feature.properties.asset_id]}% Likelihood of Erosion`;
                } else if (filter_values.hazard.toLowerCase() == 'inundation') {
                  hover_val = `${hover_data[e.target.feature.properties.asset_id]}cm of Inundation`;
                }
              } else {
                if (filter_values.hazard.toLowerCase() == 'erosion') {
                  hover_val = `No Likelihood of Erosion`;
                } else if (filter_values.hazard.toLowerCase() == 'inundation') {
                  hover_val = `No Inundation`;
                }
              }
              mouse_info.innerHTML = '<table><tr><td style="font-weight:bold;">' + hover_val + '</td></tr><tr><td style="font-style:italic;padding-top:3px;">' + e.target.feature.datalayer.name + '</td></tr></table>';
          },
          mouseout: function(e) {
            var color = category_map_colors[myself.category];
            e.target.setStyle({
              weight: 4,
              opacity: 1,
              fillOpacity: myself.opacity,
            });
            
            // Update Mouse Info
            var mouse_info = document.getElementById("mouse-info");
            mouse_info.style.visibility = "hidden";
            mouse_info.style.background = "rgba(255,255,255, 0.8)";
          }
      });
    }
  }
  default_style_generator () {
    var myself = this;
    return function (feature) { 
      //var color = ( hover_data[feature.properties.asset_id] ? category_colors[myself.category] : "#000");
      var color = category_map_colors[myself.category];
      return { fillColor: color, weight: 4, color: color, opacity: 1, fillOpacity: myself.opacity}; 
    }
  }
  display () {
    super.display();

    if (!this.layer && this.topojson) {
      // Find GeometryCollection in topojson
      var geomCollection = this.topojson.objects[Object.keys(this.topojson.objects)[0]];

      //Create layer, converting topojson to geojson
      
      if (this.tiled) {
        // Tile the layer using geojson-vt (i.e. it's large)
        var options = {
          maxZoom: 18,
          tolerance: 0,
          debug: 0,
          style: {
            fillColor: category_map_colors[this.category],
            color: category_map_colors[this.category],
            weight: 2,
            opacity: 1,
            fillOpacity: 0.5
          },
        };
        this.layer = L.geoJson.vt(topojson.feature(this.topojson, geomCollection), options).addTo(map);
      
      } else {
        // No tiling (faster if small)
        this.layer = L.geoJSON(topojson.feature(this.topojson, geomCollection), 
                  {style : (this.style_func ? this.style_func : this.default_style), onEachFeature : (this.hazard_description ? null : this.onEachFeature)}
                  );
        this.layer.addTo(map);
      }
    }
  }
  update () {
    super.update();

    if (this.layer) {
      if (this.tiled) {
        this.layer.setStyle(this.layer, (this.style_func ? this.style_func : this.default_style));
      } else {
        this.layer.setStyle((this.style_func ? this.style_func : this.default_style));
      }
    }
  }
}


class ImageLayer extends Layer {
  constructor (id, name, category, url, nw_lat, nw_lng, se_lat, se_lng) {
    super(id, name, category);
    this.url = url;

    this.bounds = [[nw_lat, nw_lng], [se_lat, se_lng]];
  }
  display() {
    super.display();
    // Show this.element
    if (this.visible) {
      this.layer = L.imageOverlay(this.url, this.bounds).addTo(map);
    }
  }
}

class MarkerLayer extends Layer {
  constructor (id, name, category, color, csv, style_func=null) {
    super(id, name, category);

    this.csv = csv;

    this.style_func = style_func;

    this.default_style = this.default_style_generator();
    this.onEachFeature = this.onEachFeatureGenerator();
  }
  onEachFeatureGenerator() {
    var myself = this;
    return {
          mouseover: function(e) {
              e.target.setStyle({
                radius: 10,
                weight: 4,
              });
              console.log(e);

              // Update Mouse Info
              var mouse_info = document.getElementById("mouse-info");
              mouse_info.style.visibility = "visible";
              mouse_info.style.background = "rgb(255,255,255)";

              console.log(filter_values.hazard, hover_data, e.target.feature.properties.asset_id, hover_data[e.target.feature.properties.asset_id]);
              
              var hover_val = "";
              if (hover_data[e.target.feature.properties.asset_id]) {
                if (filter_values.hazard.toLowerCase() == 'erosion') {
                  hover_val = `${hover_data[e.target.feature.properties.asset_id]}% Likelihood of Erosion`;
                } else if (filter_values.hazard.toLowerCase() == 'inundation') {
                  hover_val = `${hover_data[e.target.feature.properties.asset_id]}cm of Inundation`;
                }
              } else {
                if (filter_values.hazard.toLowerCase() == 'erosion') {
                  hover_val = `No Likelihood of Erosion`;
                } else if (filter_values.hazard.toLowerCase() == 'inundation') {
                  hover_val = `No Inundation`;
                }
              }
              mouse_info.innerHTML = '<table><tr><td style="font-weight:bold;">' + hover_val + '</td></tr><tr><td style="font-style:italic;padding-top:3px;">' + e.target.feature.datalayer.name + '</td></tr></table>';
          },
          mouseout: function(e) {
            e.target.setStyle({
              radius: 6,
              weight: 3,
            });
            
            // Update Mouse Info
            var mouse_info = document.getElementById("mouse-info");
            mouse_info.style.visibility = "hidden";
            mouse_info.style.background = "rgba(255,255,255, 0.8)";
          }
      };
  }
  default_style_generator () {
    var myself = this;
    return function (feature) { 
      return { fillColor: category_map_colors[myself.category], weight: 2, color: category_map_colors[myself.category], opacity: myself.opacity, fillOpacity: myself.opacity}; 
    }
  }
  display () {
    super.display();

    if (!this.layer && this.csv) {
      var markers = [];
      for (var d of this.csv) {
          var marker = L.circleMarker([(d.Y ? d.Y : d.lat), (d.X ? d.X : d.lon)]).setStyle({
              radius: 6,
              fillColor: "#FFF",
              color: category_map_colors[this.category],
              weight:3,
              opacity: 1,
              fillOpacity: 1
          }).on({
              mouseover: this.onEachFeature.mouseover,
              mouseout: this.onEachFeature.mouseout
          });
          marker.feature = {properties: d,
                            datalayer: this};
          d.markerlayer = this;
          marker.destination = d;
          markers.push(marker);
      }
      this.layer = L.layerGroup(markers);
      this.layer.addTo(map);
    }
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
    // Let user in
    tncCheckboxChange();

    initFilterPanels();
    $("#loading-popup").css("right", "-20rem");
    updateMap();
  }
}


