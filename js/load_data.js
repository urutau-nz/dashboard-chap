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


import_manager.onComplete(importsComplete);
import_manager.runImports();

var ses_public;
var ses_private;
var priority_areas;

function importsComplete(imports) {
  ses_public = imports['ses_public'];
  ses_private = imports['ses_private'];
  priority_areas = imports['priority_areas'];


  new DataLayer('temp1',
      'Placeholder',
      'Built',
      '#B40',
      null
    );

  new DataLayer('ses_public',
        'Public Sites of E.S.',
        'Nature',
        '#0B8',
        ses_public
      );
  new DataLayer('ses_private',
        'Private Sites of E.S.',
        'Nature',
        '#8B0',
        ses_private
      );
  new DataLayer('priority_areas',
        'Adaptation Priority Areas',
        'Nature',
        '#B40',
        priority_areas
      );


  new DataLayer('temp2',
      'Placeholder',
      'Social',
      '#B40',
      null
    );

  new DataLayer('temp3',
    'Placeholder',
    'Cultural',
    '#B40',
    null
  );

  initMap();
}





  

/* ==== DATALAYER DEFINITION ==== */
/* - Used to control adding & removing layers of topojson data 
*/
var available_layers = {};

class DataLayer {
  constructor(id, name, category, color, topojson, style_func=null) {
    available_layers[id] = this;

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
  onEachFeatureGenerator() {
    var myself = this;
    return function (feature, layer) { 
      layer.on({
          mouseover: function() {
              myself.layer.setStyle({
                weight: 3,
                opacity: 1,
                fillOpacity: 0.5
              });
          },
          mouseout: function() {
            myself.layer.setStyle({
              weight: 2,
              opacity: myself.opacity,
              fillOpacity: myself.opacity
            });
          }
      });
    }
  }
  default_style_generator () {
    var myself = this;
    return function (feature) { return { fillColor: myself.color, weight: 2, color: myself.color, opacity: myself.opacity, fillOpacity: myself.opacity}; }
  }
  display () {
    if (!this.layer && this.topojson) {
      // Find GeometryCollection in topojson
      var geomCollection = this.topojson.objects[Object.keys(this.topojson.objects)[0]];
      //Create layer, converting topojson to geojson
      this.layer = L.geoJSON(topojson.feature(this.topojson, geomCollection), 
                {style : (this.style_func ? this.style_func : this.default_style), onEachFeature : this.onEachFeature}
                );
      this.layer.addTo(map);
    }
  }
  remove () {
    if (this.layer) {
      map.removeLayer(this.layer);
      this.layer = null;
    }
  }
  update () {
    if (this.layer) {
      this.layer.setStyle((this.style_func ? this.style_func : this.default_style));
    }
  }
  blur () {
    // For Image Layers
  }
}

var all_hazards = {};

class HazardLayer {
  constructor (id, name, aspect_width, aspect_height, center_lat, center_lng, aspect_lat, aspect_lng) {
    all_hazards[id] = this;

    this.id = id;
    this.name = name;

    this.visible = false;

    this.aspect_width = aspect_width;
    this.aspect_height = aspect_height;

    this.opacity = 0.2;

    this.center_lat = center_lat;
    this.center_lng = center_lng;

    this.aspect_lat = aspect_lat;
    this.aspect_lng = aspect_lng;

    this.last_zoom = null;
  }
  calculateTransform() {
    var bounds = map.getBounds();
    var lat = bounds._northEast.lat;
    var lng = bounds._southWest.lng;
    var zoom = map.getZoom();
    console.log(bounds, zoom);

    var element = document.getElementById(this.id);
    console.log(element);

    if (this.last_zoom != zoom) {
      element.style.width = 2**zoom * this.aspect_width + 'px';
      element.style.height = 2**zoom * this.aspect_height + 'px';
      this.last_zoom = zoom;
    }

    element.style.top = 2**zoom * (lat - this.center_lat) * this.aspect_lat + 'px';
    element.style.left = 2**zoom * (lng - this.center_lng) * this.aspect_lng + 'px';
  }
  display() {
    // Show this.element
    this.calculateTransform();
    var element = document.getElementById(this.id);
    element.style.display = 'block';
    this.visible = true;
  }
  remove() {
    // Hide this.element
    var element = document.getElementById(this.id);
    element.style.display = 'none';
    this.visible = false;
  }
  blur () {
    if (this.visible) {
      var element = document.getElementById(this.id);
      element.style.filter = 'blur(6px)';
    }
  }
  update () {
    // Called on map zoom or move end
    if (this.visible) {
      var element = document.getElementById(this.id);
      this.calculateTransform();
      element.style.filter = '';
    }
  }
}

// Hazards

new HazardLayer('test_image',
  'Test Image',
  1.23291, 0.9399,
  -43.03477, 171.65863,
  0.9813737, -0.7093915
  );















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
    updateMap();
  }
}



/* Updates entire map */
function updateMap() {
  null;
}