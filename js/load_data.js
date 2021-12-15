/* ==== MODULAR IMPORTS (EXPERIMENTAL!) ==== */

class ImportManager {
  constructor () {
    this.checks = {};
    this.outputs = {};
    this.imports = {};
    this.has_imports = false;
    this.oncomplete = (d) => (null);
  }
  isFinished() {
    for (var id in this.checks) {
      if (!this.checks[id]) return false;
    }
    return true;
  }
  addImport(id, title, type, url, csv_typing = d3.autoType) {
    this.imports[id] = {'id': id, 'title': title, 'type': type, 'url': url, 'csv_typing': csv_typing};
    this.checks[id] = false;
    this.outputs[id] = null;
    this.has_imports = true;
  }
  onComplete(func) {
    this.oncomplete = func;
  }
  runImports() {
    var onImports = {};
    var impmod = this;
    if (this.has_imports) {
      for (var imp_id in this.imports) {
        var imp = this.imports[imp_id];
        var gen = function(imp) {
          return function(error, json) {
            if (error) return console.error(error);
            impmod.outputs[imp.id] = json;
            impmod.checks[imp.id] = true;
            if (DEBUGGING) {
              console.log(imp.title + " Imported");
              console.log(json);
            }
            if (impmod.isFinished()) impmod.oncomplete(impmod.outputs);
          }
        };
        onImports[imp_id] = gen(imp);
        if (imp.type == 'csv') {
          d3.csv(imp.url, imp.csv_typing, onImports[imp_id]);
        } else if (imp.type == 'json') {
          d3.json(imp.url, onImports[imp_id]);
        }
      }
    } else {
      this.oncomplete({});
    }
  }
}



/* MODULAR IMPORTS */

var import_manager = new ImportManager();
/*
import_manager.addImport('isolation_county', 'Isolated County Pops', 'csv', 
    'https://raw.githubusercontent.com/urutau-nz/dashboard-slr-usa/master/data/results/isolation_county.csv',
    (d) => ({geoid: d.geoid_county, year: +d.year, rise: +d.rise, pop: +d.count}));
*/

import_manager.addImport('ses_public', 'Sites of Eco Sig Public', 'json', 
'https://projects.urbanintelligence.co.nz/chap/data/ses_a.json');

import_manager.addImport('ses_private', 'Sites of Eco Sig Private', 'json', 
'https://projects.urbanintelligence.co.nz/chap/data/ses_b.json'); 

import_manager.addImport('priority_areas', 'Adaptation Priority Areas', 'json', 
'https://projects.urbanintelligence.co.nz/chap/data/adaptation_priority_areas.json');

import_manager.addImport('wildife_significance', 'Sites of Wildlife Sig.', 'json', 
'https://projects.urbanintelligence.co.nz/chap/data/sites_of_special_wildlife_significance.json');

import_manager.addImport('coastal_protection', 'Coastal Protection', 'json', 
'https://projects.urbanintelligence.co.nz/chap/data/coastal_protection.json');

import_manager.addImport('DOC_conservation', 'DOC Conservation Areas', 'json', 
'https://projects.urbanintelligence.co.nz/chap/data/DOC_public_conservation_land.json');

import_manager.addImport('cemetery', 'Cemeteries', 'json', 
'https://projects.urbanintelligence.co.nz/chap/data/cemetery.json');

import_manager.addImport('water_pipes', 'Water Pipes', 'json', 
'https://projects.urbanintelligence.co.nz/chap/data/potable_water_pipes_in_service.json');

import_manager.addImport('landfill', 'Landfills', 'json', 
'https://projects.urbanintelligence.co.nz/chap/data/landfill.json');

import_manager.addImport('port_access', 'Port Access', 'json', 
'https://projects.urbanintelligence.co.nz/chap/data/port_access.json');

import_manager.addImport('port_land_claim', 'Port Land Claim', 'json', 
'https://projects.urbanintelligence.co.nz/chap/data/port_land_claim.json');

import_manager.addImport('port_operations', 'Port Operations', 'json', 
'https://projects.urbanintelligence.co.nz/chap/data/port_operations.json');

import_manager.addImport('port_storage', 'Port Storage', 'json', 
'https://projects.urbanintelligence.co.nz/chap/data/port_storage.json');

import_manager.addImport('potable_water_strcutures_in_service', 'Potable Water Structures', 'json', 
'https://projects.urbanintelligence.co.nz/chap/data/potable_water_strcutures_in_service.json');




import_manager.addImport('community_facilities', 'Community Facilities', 'csv', 
'https://projects.urbanintelligence.co.nz/chap/data/clipped_community_facilities.csv');

import_manager.addImport('transfer_stations', 'Transfer Stations', 'csv', 
'https://projects.urbanintelligence.co.nz/chap/data/transfer_stations.csv');

import_manager.addImport('potable_water_pumps', 'Potable Water Pumps', 'csv', 
'https://projects.urbanintelligence.co.nz/chap/data/potable_water_pumps.csv');

import_manager.addImport('tanks', 'Tanks', 'csv', 
'https://projects.urbanintelligence.co.nz/chap/data/tanks.csv');





import_manager.addImport('banks_groundwater', 'Banks Peninsula Groundwater', 'json', 
'https://projects.urbanintelligence.co.nz/chap/data/banks_gw1.json');


import_manager.onComplete(importsComplete);
import_manager.runImports();


function importsComplete(imports) {


  new DataLayer('coastal_protection',
      'Coastal Protection',
      'Built',
      '#D0D',
      imports['coastal_protection']
    ).addToLayers();
  new DataLayer('cemetery',
      'Cemetery',
      'Built',
      '#B88',
      imports['cemetery']
    ).addToLayers();
  new DataLayer('water_pipes',
      'Potable Water Pipes',
      'Built',
      '#88B',
      imports['water_pipes'],
      true // LARGE - needs to be tiled
    ).addToLayers();
  new MarkerLayer('community_facilities',
      'Community Facilities',
      'Built',
      '#4B4',
      imports['community_facilities']
    ).addToLayers();
  new MarkerLayer('transfer_stations',
      'Transfer Stations',
      'Built',
      '#B44',
      imports['transfer_stations']
    ).addToLayers();
  new MarkerLayer('tanks',
      'Tanks',
      'Built',
      '#8B0',
      imports['tanks']
    ).addToLayers();
  new DataLayer('potable_water_strcutures_in_service',
      'Potable Water Structures',
      'Built',
      '#B80',
      imports['potable_water_strcutures_in_service']
    ).addToLayers();
  new DataLayer('landfill',
      'Landfills',
      'Built',
      '#44B',
      imports['landfill']
    ).addToLayers();
  new DataLayer('port_access',
      'Port Access',
      'Built',
      '#44F',
      imports['port_access']
    ).addToLayers();
  new DataLayer('port_land_claim',
      'Port land Claim',
      'Built',
      '#F44',
      imports['port_land_claim']
    ).addToLayers();
  new DataLayer('port_operations',
    'Port Operations',
    'Built',
    '#4F4',
    imports['port_operations']
  ).addToLayers();
  new DataLayer('port_storage',
    'Port Storage',
    'Built',
    '#0B8',
    imports['port_storage']
  ).addToLayers();
  new MarkerLayer('potable_water_pumps',
    'Potable Water Pumps',
    'Built',
    '#08B',
    imports['potable_water_pumps']
  ).addToLayers();



  new DataLayer('temp3',
        'Placeholder',
        'Cultural',
        '#B40',
        null
      ).addToLayers();

    

  new DataLayer('ses_public',
        'Public Sites of E.S.',
        'Natural',
        '#0B8',
        imports['ses_public']
      ).addToLayers();
  new DataLayer('ses_private',
        'Private Sites of E.S.',
        'Natural',
        '#8B0',
        imports['ses_private']
      ).addToLayers();
  new DataLayer('wildife_significance',
        'Sites of Wildlife Sig.',
        'Natural',
        '#DD0',
        imports['wildife_significance']
      ).addToLayers();
  new DataLayer('DOC_conservation',
        'DOC Conservation Areas',
        'Natural',
        '#0DD',
        imports['DOC_conservation']
      ).addToLayers();




  new DataLayer('temp2',
      'Placeholder',
      'Social',
      '#B40',
      null
    ).addToLayers();

    

  new DataLayer('priority_areas',
    'Adaptation Priority Areas',
    'Misc',
    '#B40',
    imports['priority_areas']
    ).addToLayers();


  // HAZARDS
  new DataLayer('banks_groundwater',
      'Groundwater Rise (Banks Peninsula)',
      null,
      '#018',
      imports['banks_groundwater'],
      false,
      function (feature) {
        var col = (feature.properties.DN == 1 ? "#018" : "#2AF")
        return { fillColor: col, weight: 1, color: col, opacity: 0.2, fillOpacity: 0.2}
      }
    ).addToHazards("Expected groundwater levels with 1.9m SLR")
    .addLegend('Depth to Groundwater', 'm', ["GW is at or above ground", "GW is within 0.7m of ground"], ["#018", "#2AF"]);


  initMap();
}





  
var category_titles = {'Built': 'Built Domain',
'Cultural': 'Cultural Domain',
'Natural': 'Natural Domain',
'Social': 'Social Domain',
'Misc': 'Misc Layers',
};


/* ==== DATALAYER DEFINITION ==== */
/* - Used to control adding & removing layers of topojson data 
*/
var available_layers = {};
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
  addToLayers() {
    available_layers[this.id] = this;
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

    this.color = color;
    this.topojson = topojson;

    this.style_func = style_func;

    this.opacity = 0.3;

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
            console.log(e);
              e.target.setStyle({
                weight: 3,
                opacity: 1,
                fillOpacity: 0.7
              });

              // Update Mouse Info
              var mouse_info = document.getElementById("mouse-info");
              mouse_info.style.visibility = "visible";
              mouse_info.style.background = "rgb(255,255,255)";
              
              var hover_val = "";
              if (e.target.feature.properties.title) {
                hover_val = e.target.feature.properties.title;
              } else if (e.target.feature.properties.name) {
                hover_val = e.target.feature.properties.name;
              }
              mouse_info.innerHTML = '<table><tr><td style="font-weight:bold;">' + hover_val + '</td></tr><tr><td style="font-style:italic;padding-top:3px;">' + e.target.feature.datalayer.name + '</td></tr></table>';
              console.log(e);
          },
          mouseout: function(e) {
            e.target.setStyle({
              weight: 2,
              opacity: myself.opacity,
              fillOpacity: myself.opacity
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
      return { fillColor: myself.color, weight: 2, color: myself.color, opacity: myself.opacity, fillOpacity: myself.opacity}; 
    }
  }
  display () {
    super.display();

    if (!this.layer && this.topojson) {
      // Find GeometryCollection in topojson
      var geomCollection = this.topojson.objects[Object.keys(this.topojson.objects)[0]];
      console.log(geomCollection);

      //Create layer, converting topojson to geojson
      
      if (this.tiled) {
        // Tile the layer using geojson-vt (i.e. it's large)
        var options = {
          maxZoom: 16,
          tolerance: 3,
          debug: 0,
          style: {
            fillColor: this.color,
            color: this.color,
            weight: 2,
            opacity: this.opacity,
            fillOpacity: this.opacity
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

    this.color = color;
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
                radius: 6
              });

              // Update Mouse Info
              var mouse_info = document.getElementById("mouse-info");
              mouse_info.style.visibility = "visible";
              mouse_info.style.background = "rgb(255,255,255)";
              
              var hover_val = "";
              console.log(e.target);
              if (e.target.destination.title) {
                hover_val = e.target.destination.title;
              } else if (e.target.destination.name) {
                hover_val = e.target.destination.name;
              }
              mouse_info.innerHTML = '<table><tr><td style="font-weight:bold;">' + hover_val + '</td></tr><tr><td style="font-style:italic;padding-top:3px;">' + e.target.destination.markerlayer.name + '</td></tr></table>';
              console.log(e);
          },
          mouseout: function(e) {
            e.target.setStyle({
              radius: 3
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
      return { fillColor: myself.color, weight: 2, color: myself.color, opacity: myself.opacity, fillOpacity: myself.opacity}; 
    }
  }
  display () {
    super.display();

    if (!this.layer && this.csv) {
      var markers = [];
      for (var d of this.csv) {
          var marker = L.circleMarker([d.Y, d.X]).setStyle({
              radius: 3,
              fillColor: this.color,
              color: "#000",
              weight: 0,
              opacity: 1,
              fillOpacity: 1
          }).on({
              mouseover: this.onEachFeature.mouseover,
              mouseout: this.onEachFeature.mouseout
          });
          d.markerlayer = this;
          marker.destination = d;
          markers.push(marker);
      }
      this.layer = L.layerGroup(markers);
      this.layer.addTo(map);
    }
  }
}






// Hazards

new ImageLayer('coastal_erosion',
  'Coastal Erosion (Detailed)',
  null,
  'https://projects.urbanintelligence.co.nz/chap/data/tif5_2.png',
  -43.8175583203575, 172.68006589048363,
  -43.38980174324621, 172.97179259824534,
  ).addToHazards("Probabilistic Erosion by 2150 with 2.0m of SLR")
  .addLegend("Probability of Erosion", '%', [0, 25, 50, 75, 100]);

new ImageLayer('slr_2m',
  'Coastal Inundation',
  null,
  'https://projects.urbanintelligence.co.nz/chap/data/slr_2m.png',
  -43.910311494073454, 172.370005888,
  -43.387693258, 173.1430543875895,
  ).addToHazards("Expected inundation depth during a 1 in 100year event with 2.0m SLR")
  .addLegend("Inundation Depth", 'm', [0, 1, 2, 3, 4, 5, 6]);

new ImageLayer('ch_gw',
  'Groundwater Rise (Christchurch)',
  null,
  'https://projects.urbanintelligence.co.nz/chap/data/ch_gw_2.png',
  -43.598523872449995, 172.53134737505002,
  -43.39146096005, 172.77043032545,
  ).addToHazards("Expected groundwater levels 85% of the time with 2.4m SLR")
  .addLegend("Depth to Groundwater", 'm', [2, 1, 0, -1, -2, -3, -4, -5, -6]);


  
  
  



  

  
  
  
  









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
    initFilterPanels();
    $("#loading-popup").css("right", "-20rem");
    updateMap();
  }
}



/* Updates entire map */
var map = null;
function updateMap() {
  
  if (map != null) {
    map.remove();
  }
  /* ==== INITIALISE LEAFLET MAP & TILE LAYER ==== */

  map = L.map('map-div', {"attributionControl": false, center: [-43.530918, 172.636744], zoom: 11, minZoom : 4, zoomControl: false, worldCopyJump: true, crs: L.CRS.EPSG3857});
  //attr = L.control.attribution().addAttribution('<a href="https://urbanintelligence.co.nz/">Urban Intelligence</a>');
  //attr.addTo(map);

  L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_nolabels/{z}/{x}/{y}.png',
                              {"attributionControl": false, "detectRetina": false, "maxZoom": 16, "minZoom": 4,
                                "noWrap": false, "subdomains": "abc"}).addTo(map);

  map.createPane('labels');
  map.getPane('labels').style.zIndex = 650;
  map.getPane('labels').style.pointerEvents = 'none';

  L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_only_labels/{z}/{x}/{y}{r}.png',
              {pane: 'labels'}).addTo(map);
  
  



  var category_colors = {'Built': ['#FFC400', '#885400'],
  'Cultural': ['#82003D', '#390009'],
  'Natural': ['#8FD760', '#1F8324'],
  'Social': ['#495CB1', '#2A284F'],
  'Misc': ['#00A9A7', '#004B57'],
  };
  

  // Generate Asset Menu
  var asset_menu = [];
  for (var category in category_titles) {
    var items = [];
    for (var layer_id in available_layers) {
      var layer = available_layers[layer_id];
      if (layer.category == category) {
        items.push([layer.id, layer.name]);
      }
    }
    asset_menu.push({'header': category_titles[category], 'category': category,  'items': items});
  }
  asset_menu.sort(function(a, b) { // Larger length to smaller. If equal, put in original order.
    var len = a.items.length - b.items.length;
    if (len == 0) {
      var keys = Object.values(category_titles);
      var out = keys.indexOf(b.header) - keys.indexOf(a.header);
      return out;
    } else {
      return len;
    }
  });

  $("#map-asset-table").html("");

  var content = "";
  var looping = true;
  var left = [];
  var right = [];
  var left_cat = null;
  var right_cat = null;

  while(looping) {
    if (left.length + right.length + asset_menu.length == 0) {
      looping = false;
      break;
    }
    
    content += '<tr>';

    if (left.length == 0 && asset_menu.length > 0) {
      var asset = asset_menu.pop();
      content += `<td class="header">${asset.header}</td>`;
      left = asset.items;
      left_cat = asset.category;

    } else if (left.length > 0) {
      var item = left.pop(); // Add clickability & use item[0]
      content += `<td class="item ${left_cat}" onclick="mapAsset('${item[0]}', '${item[1]}')">${item[1]}</td>`;

    } else {
      content += '<td></td>';
    }


    if (right.length == 0 && asset_menu.length > 0) {
      var asset = asset_menu.pop();
      content += `<td class="header">${asset.header}</td>`;
      right = asset.items;
      right_cat = asset.category;

    } else if (right.length > 0) {
      var item = right.pop(); // Add clickability & use item[0]
      content += `<td class="item ${right_cat}" onclick="mapAsset('${item[0]}', '${item[1]}')">${item[1]}</td>`;
      
    } else {
      content += '<td></td>';
    }
    
    content += '</tr>';
  }

  $("#map-asset-table").html(content);
}