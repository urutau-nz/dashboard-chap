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




import_manager.addImport('banks_groundwater', 'Banks Peninsula Groundwater', 'json', 
'https://projects.urbanintelligence.co.nz/chap/data/banks_gw1.json');


import_manager.onComplete(importsComplete);
import_manager.runImports();


function importsComplete(imports) {


  new DataLayer('coastal_protection',
        'Coastal Protection',
        'Built',
        '#80B',
        imports['coastal_protection']
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

class DataLayer {
  constructor(id, name, category, color, topojson, style_func=null) {
    this.id = id;
    this.name = name;
    this.category = category;
    this.topojson = topojson;
    this.color = color;

    this.layer = null;
    this.style_func = style_func;

    this.opacity = 0.2;

    this.default_style = this.default_style_generator();
    this.onEachFeature = this.onEachFeatureGenerator();
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
  onEachFeatureGenerator() {
    var myself = this;
    return function (feature, layer) { 
      feature.datalayer = myself;
      layer.on({
          mouseover: function(e) {
              e.target.setStyle({
                weight: 3,
                opacity: 1,
                fillOpacity: 0.5
              });

              // Update Mouse Info
              var mouse_info = document.getElementById("mouseInfo");
              mouse_info.style.visibility = "visible";
              mouse_info.style.background = "rgb(255,255,255)";
              mouse_info.innerHTML = '<table><tr><td style="font-weight:bold;">' + e.target.feature.properties.title + '</td></tr><tr><td style="font-style:italic;padding-top:3px;">' + e.target.feature.datalayer.name + '</td></tr></table>';
              console.log(e);
          },
          mouseout: function(e) {
            e.target.setStyle({
              weight: 2,
              opacity: myself.opacity,
              fillOpacity: myself.opacity
            });
            
            // Update Mouse Info
            var mouse_info = document.getElementById("mouseInfo");
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
        var alpha = 1/(values.length) * (i+1);
        this.legend_colors.push('rgba(0,30,140,'+alpha+')');
      }
    }
    return this;
  }
  display () {
    if (!this.layer && this.topojson) {
      // Find GeometryCollection in topojson
      var geomCollection = this.topojson.objects[Object.keys(this.topojson.objects)[0]];
      console.log(geomCollection);
      //Create layer, converting topojson to geojson
      this.layer = L.geoJSON(topojson.feature(this.topojson, geomCollection), 
                {style : (this.style_func ? this.style_func : this.default_style), onEachFeature : (this.hazard_description ? null : this.onEachFeature)}
                );
      this.layer.addTo(map);
      
      
      if (this.legend_header) {
        this.displayLegend();
      }
      if (this.hazard_description) {
        $("#hazard_text").text(this.hazard_description);
      }
    }
  }
  remove () {
    if (this.layer) {
      map.removeLayer(this.layer);
      if (this.legend_header) {
        this.removeLegend();
      }
      this.layer = null;
      if (this.hazard_description) {
        $("#hazard_text").text('');
      }
    }
  }
  update () {
    if (this.layer) {
      this.layer.setStyle((this.style_func ? this.style_func : this.default_style));
    }
  }
}


class ImageLayer {
  constructor (id, name, category, url, nw_lat, nw_lng, se_lat, se_lng) {

    this.id = id;
    this.name = name;
    this.category = category;
    this.url = url;

    this.visible = false;

    this.bounds = [[nw_lat, nw_lng], [se_lat, se_lng]];

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
      var alpha = 1/(this.legend_values.length) * (i+1);
      var color = this.legend_colors[i];
      content += '<tr><td class="cblock" style="background: ' + color + ';opacity:' +alpha+';)"></td><td class="ltext">' + this.legend_values[i] + '</td></tr>';
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
        this.legend_colors.push('#018');
      }
    }
    return this;
  }
  display() {
    // Show this.element
    if (!this.visible) {
      this.layer = L.imageOverlay(this.url, this.bounds).addTo(map);
      if (this.hazard_description) {
        $("#hazard_text").text(this.hazard_description);
      }
      if (this.legend_header) {
        this.displayLegend();
      }
      this.visible = true;
    }
  }
  remove() {
    // Hide this.element
    if (this.visible) {
      map.removeLayer(this.layer);
      if (this.hazard_description) {
        $("#hazard_text").text('');
      }
      if (this.legend_header) {
        this.removeLegend();
      }
      this.visible = false;
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
    initSelectionPanel();
    setHazardMenu();
    updateMap();
  }
}



/* Updates entire map */
function updateMap() {
  null;
}