
var current_overview_tab; // The current tab, 'overview' or a domain

var overview_collapsables = [];
var overview_collapsable_graphs = {};
var overview_big_graph;
var overview_region_dropdown;
var overview_slr_value = 20;

var overview_graph_sections = { 
    'built-potable-water': {id: 'overview-collapsing-2', file: '', data: null, hazardMenu: null, vulnerabilityMenu: null, areaMenu: null},
    'built-buildings':  {id: 'overview-collapsing-3', file: '', data: null, hazardMenu: null, vulnerabilityMenu: null, areaMenu: null},
    'built-landfills':  {id: 'overview-collapsing-4', file: '', data: null, hazardMenu: null, vulnerabilityMenu: null, areaMenu: null},
    'built-wastewater':  {id: 'overview-collapsing-5', file: '', data: null, hazardMenu: null, vulnerabilityMenu: null, areaMenu: null},
    'built-transportation':  {id: 'overview-collapsing-6', file: 'built_transportation.csv', data: null, hazardMenu: null, vulnerabilityMenu: null, areaMenu: null},
    'built-electricity':  {id: 'overview-collapsing-7', file: '', data: null, hazardMenu: null, vulnerabilityMenu: null, areaMenu: null}
};
var overview_graph_section_html = `
<div class="graph-section">
    <div class="form-div">
    </div>
    <div class="graph-div">
    </div>
</div>
`;


function initPageOverview() {
    var index = 1;
    while(true) {
        if ($(`#overview-collapse-${index}`).length == 0) {
            break;
        } 
        var collapser = new vlCollapsing('overview-collapse-' + index, 'overview-collapsing-'+index);
        if (!$(`#overview-collapse-${index}`).hasClass('summary')) {
            collapser.collapse();
        }
        overview_collapsables.push(collapser);
        index += 1;
    }

    // Add graphs
    for (var section_name in overview_graph_sections) {
        var section_id = overview_graph_sections[section_name].id;
        var section = $(`#${section_id}`);
        section.html(overview_graph_section_html);

        var form_html = '';
        form_html += `<div id="${section_id}-hazard-form"></div>`;
        form_html += `<div class="ari-form" id="${section_id}-ari-form"></div>`;
        form_html += `<div id="${section_id}-vulnerability-form"></div>`;
        form_html += `<div id="${section_id}-area-form"></div>`;

        section.find('.form-div').html(form_html);

        // Create dropdowns
        var hazardMenu = new vlDropDown(`${section_id}-hazard-form`);
        hazardMenu.populate([["all", "All"], ["inundation", "Inundation"], ["erosion", "Erosion"], ["groundwater", "Groundwater"]]);
        hazardMenu.setValue("all");
        
        var hazard_onchange = function (value) {
            updateSubdomainGraphs();
        }
        hazardMenu.setOnChange(hazard_onchange);
        overview_graph_sections[section_name].hazardMenu = hazardMenu;


        var ariMenu = new vlDropDown(`${section_id}-ari-form`);
        ariMenu.populate([['1', 'ARI 1'], ['10', 'ARI 10'], ['100', 'ARI 100']]);
        
        var ari_onchange = function (value) {
            updateSubdomainGraphs();
        }
        ariMenu.setOnChange(ari_onchange);
        overview_graph_sections[section_name].ariMenu = ariMenu;


        var vulnerabilityMenu = new vlDropDown(`${section_id}-vulnerability-form`);
        vulnerabilityMenu.populate(['Exposed', 'Low', 'Medium', 'High']);
        vulnerabilityMenu.setValue("Exposed");
        
        var vulnerability_onchange = function (value) {
            updateSubdomainGraphs();
        }
        vulnerabilityMenu.setOnChange(vulnerability_onchange);
        overview_graph_sections[section_name].vulnerabilityMenu = vulnerabilityMenu;

        var areaMenu = new vlDropDown(`${section_id}-area-form`);
        for (var region in region_ids) {
            areaMenu.push(region_ids[region], region);
        }
        
        var area_onchange = function (value) {
            updateSubdomainGraphs();
        }
        areaMenu.setOnChange(area_onchange);
        overview_graph_sections[section_name].areaMenu = areaMenu;

        
        // Create graph
        importSubdomainGraph(section_name, section_id, overview_graph_sections[section_name].file);
    }

    // Create Big Graph Region Dropdown
    var regionMenu = new vlDropDown(`overview-controls-region-form`);
    for (var region in region_ids) {
        regionMenu.push(region_ids[region], region);
    }
    
    var region_onchange = function (value) {
        updateBigGraph();
    }
    regionMenu.setOnChange(region_onchange);
    overview_region_dropdown = regionMenu;

    // Create Big Graph
    updateBigGraph();
}
function openPageOverview() {
    if (!current_overview_tab) {
        setOverviewTab('overview');
    }

    overview_big_graph.barGraph();
}
function closePageOverview() {
    
}




function overviewBigGraphSLR(slr) {
    overview_slr_value = slr;

    $(`#overview-controls-div .slr-form .button`).removeClass('active');
    $(`#overview-controls-div .slr-form .button-${slr}`).addClass('active');

    updateBigGraph();
}


function updateBigGraph() {
    var filtered_data = consquence_rating_data.filter(d => {
        return d.region.toLowerCase() == overview_region_dropdown.value && d.assessor == '1';
    });
    console.log(consquence_rating_data, filtered_data);

    // Separate out column names
    var final_data = [];
    var column_strings = [];
    for (var row_i in filtered_data) {
        var dict = { ...filtered_data[row_i] };

        var column_string = filtered_data[row_i].subdomain;
        if (!column_strings.includes(column_string)) {
            column_strings.push(column_string);
        }
        dict.subdomain = column_strings.indexOf(column_string);

        final_data.push(dict);
    }
    for (var i in column_strings) {
        console.log(column_strings);
        var name = column_strings[i].slice(8);
        if (name[0] == ' ') name = name.slice(1);
        column_strings[i] = capitalize(name);
        /*
        var get_next = false;
        for (var letter of name) {
            if (get_next) column_strings[i] += letter.toUpperCase();
            get_next = letter == ' ';
        }*/
    }

    $('#overview-display-graph').html('');

    overview_big_graph = new vlGraph(`overview-display-graph`, final_data, 'subdomain', 'consequence');
    overview_big_graph.x_axis_adjust(3);
    overview_big_graph.y_axis_label("Consequence");
    overview_big_graph.y_axis_adjust(2);
    overview_big_graph.margin_top(40);
    overview_big_graph.margin_right(25);
    overview_big_graph.margin_left(35);
    overview_big_graph.margin_bottom(380);
    overview_big_graph.font_size(13);
    overview_big_graph.x_categories(column_strings);
    overview_big_graph.opacity_column('evidence');
    overview_big_graph.opacity_function(function (n) {return (n-0.6)/3.4;});
    overview_big_graph.color_column('domain');
    overview_big_graph.x_value_in_hover(false);
    overview_big_graph.colors({'Built': '#db7900', 'Natural': '#32b888', 'Cultural': '#c94040', 'Social': '#3e7691'});
    overview_big_graph.x_ticks(7);
    overview_big_graph.line_width(2);
    overview_big_graph.y_tick_size(1);
    overview_big_graph.x_tick_size(3);
    overview_big_graph.y_outer_tick_size(0);
    overview_big_graph.x_outer_tick_size(0);
    overview_big_graph.min_x(0);
    overview_big_graph.max_x('strict');
    overview_big_graph.max_y(10);
    overview_big_graph.dots(false);
    overview_big_graph.rotate_x_values(true);
    overview_big_graph.barGraph();

    /*overview_big_graph.svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(overview_big_graph.x))
    .selectAll("text")
        .attr("transform", "translate(-10,0)rotate(-45)")
        .style("text-anchor", "end");*/
}

function importSubdomainGraph(section_name, section_id, section_file) {
    vlQuickImport('data/overview_subdomain_graphs/' + section_file, 'csv', function (d) {
        // Find all separate elements, collect their data
        var d_by_element = {};

        for (var row of d) {
            var element = row.element;

            if (!Object.keys(d_by_element).includes(element)) {
                d_by_element[element] = [];
            }
            d_by_element[element].push(row);
        }

        overview_graph_sections[section_name].data = d_by_element;

        updateSubdomainGraph(section_name);
    });

}

function updateSubdomainGraphs() {
    for (var section_name in overview_graph_sections) {
        updateSubdomainGraph(section_name);
    }
}
function updateSubdomainGraph(section_name) {
    var section = overview_graph_sections[section_name];

    console.log(`UPDATESUBDOMAINGRAPH`, section_name);

    // FILTER DATA
    var ari_value = section.ariMenu.value;
    var vulnerability_value = section.vulnerabilityMenu.value.toLowerCase();
    var area_value = section.areaMenu.value;
    var hazard_value = section.hazardMenu.value.toLowerCase();
    if (hazard_value == 'inundation') {
        hazard_value += ari_value;

        $(`#${section.id}-ari-form`).removeClass('hide');
    } else {
        $(`#${section.id}-ari-form`).addClass('hide');
    }


    // UPDATE GRAPHS
    $(`#${section.id} .graph-div`).html("");

    for (var element in section.data) {
        console.log("ELEMENT ", element)
        var element_data = section.data[element];

        var filtered_data = element_data.filter(d => {
            return d.hazard == hazard_value && d.region == area_value && d.vulnerability == vulnerability_value;
        });
        console.log(filtered_data, element_data, hazard_value, area_value, vulnerability_value);


        // Create parent div
        form_html = `<div id="${section.id}-${element}-graph-div"></div>`;

        $(`#${section.id}`).find('.graph-div').append(form_html);

        // Gen Title
        if (assets[element]) {
            var title = assets[element].display_name;
        } else {
            var title = capitalize(element);
        }


        var linegraph = new vlGraph(`${section.id}-${element}-graph-div`, filtered_data, 'slr', 'percentage');
        linegraph.x_axis_label("SLR");
        linegraph.x_axis_adjust(3);
        linegraph.y_axis_label("Percentage");
        linegraph.y_axis_adjust(2);
        linegraph.margin_top(40);
        linegraph.margin_right(25);
        linegraph.margin_left(35);
        linegraph.margin_bottom(50);
        linegraph.font_size(13);
        linegraph.y_suffix("%");
        linegraph.x_suffix("m");
        linegraph.colors(['#3e7691']);
        linegraph.x_ticks(7);
        linegraph.line_width(2);
        linegraph.y_tick_size(1);
        linegraph.x_tick_size(3);
        linegraph.y_outer_tick_size(0);
        linegraph.x_outer_tick_size(0);
        linegraph.min_x(0);
        linegraph.max_x('strict');
        linegraph.dots(false);
        linegraph.lineGraph();
    
        overview_collapsable_graphs[section_name] = linegraph;

        // ADD GRAPH TITLE
        $(`#${section.id}-${element}-graph-div`).append(`<div class="vl-graph-title">${title}</div>`);

        // HYPERLINK THE GRAPH TITLE (if it's a valid asset)
        if (assets[element]) {
            $(`#${section.id}-${element}-graph-div .vl-graph-title`).wrap(`<div style="cursor: pointer;" onclick="openReport('${element}')"></div>`);
        }
    }
}


function setOverviewTab(tab) {
    if (tab != current_overview_tab) {
        $(`#overview-menu-${current_overview_tab}-td`).removeClass("active");
        $('#overview-info-table').removeClass(current_overview_tab);
        $('#overview-info-table').addClass(tab)

        current_overview_tab = tab;

        // Activate Tab
        $(`#overview-menu-${current_overview_tab}-td`).addClass("active");

        
        switch(tab) {
            case "overview": {
                $("#overview-summary-td .title").html(`<h1>Overview</h1>`);

            } break;
            case "built": {
                $("#overview-summary-td .title").html(`<h1>Built <span class="field">Domain</span></h1>`);

            } break;
            case "natural": {
                $("#overview-summary-td .title").html(`<h1>Natural <span class="field">Domain</span></h1>`);

            } break;
            case "cultural": {
                $("#overview-summary-td .title").html(`<h1>Cultural <span class="field">Domain</span></h1>`);

            } break;
            case "human": {
                $("#overview-summary-td .title").html(`<h1>Social <span class="field">Domain</span></h1>`);

            } break;
        }
        
        // Switch shown contents
        $(".overview-report-table").removeClass('active');
        $(`#overview-${tab}-table`).addClass('active');

        // Reset collapsing boxes
        for (var collapsable of overview_collapsables) {
            collapsable.reset();
        }
        // Reset collapsing graphs
        for (var graph_name in overview_collapsable_graphs) {
            updateSubdomainGraph(graph_name);
        }
    }
}