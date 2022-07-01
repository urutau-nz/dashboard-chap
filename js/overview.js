
var current_overview_tab; // The current tab, 'overview' or a domain

var overview_collapsables = {};
var overview_collapsable_graphs = {};
var overview_big_graph;
var overview_region_dropdown;
var overview_slr_value = 20;

var overview_graph_sections = { 
    'built-potable-water': {id: 'overview-collapsing-2', file: 'built_Risk_to_potable_water_supply.csv', title: "Risk to potable water supply", data: null, hazardMenu: null, vulnerabilityMenu: null, areaMenu: null},
    'built-buildings':  {id: 'overview-collapsing-3', file: 'built_Risk_to_buildings_(residential,_commercial,_industrial,_miscellaneous_structures).csv', title: 'Risk to buildings', data: null, hazardMenu: null, vulnerabilityMenu: null, areaMenu: null},
    'built-landfills':  {id: 'overview-collapsing-4', file: 'built_Risk_to_landfills_and_contaminated_sites.csv', title: 'Risk to landfills and contaminated sites', data: null, hazardMenu: null, vulnerabilityMenu: null, areaMenu: null},
    'built-wastewater':  {id: 'overview-collapsing-5', file: 'built_Risk_to_wastewater_and_stormwater.csv', title: 'Risk to wastewater and stormwater', data: null, hazardMenu: null, vulnerabilityMenu: null, areaMenu: null},
    'built-transportation':  {id: 'overview-collapsing-6', file: 'built_Risk_to_transportation.csv', title: 'Risk to transportation', data: null, hazardMenu: null, vulnerabilityMenu: null, areaMenu: null},
    'built-electricity':  {id: 'overview-collapsing-7', file: 'built_Risk_to_electricity,_energy,_and_communications.csv', title: 'Risk to electricity, energy, and communications', data: null, hazardMenu: null, vulnerabilityMenu: null, areaMenu: null},
    'natural-terrestial':  {id: 'overview-collapsing-8', file: 'natural_Risks_to_indigenous_terrestrial_ecosystems_and_organisms.csv', 
        title: 'Risks to indigenous terrestrial coastal ecosystems and organisms', data: null, hazardMenu: null, vulnerabilityMenu: null, areaMenu: null},
    'natural-marine':  {id: 'overview-collapsing-9', file: 'natural_Risks_to_indigenous_marine_ecosystems_and_organisms.csv', 
        title: 'Risks to indigenous marine coastal ecosystems and organisms', data: null, hazardMenu: null, vulnerabilityMenu: null, areaMenu: null},
    'natural-freshwater':  {id: 'overview-collapsing-10', file: 'natural_Risks_to_indigenous_freshwater_ecosystems_and_organisms.csv', 
        title: 'Risks to indigenous freshwater coastal ecosystems and organisms', data: null, hazardMenu: null, vulnerabilityMenu: null, areaMenu: null},
    'natural-exotic':  {id: 'overview-collapsing-11', file: 'natural_Risks_to_exotic_ecosystems_and_species?_(incl_biosecurity).csv', 
        title: 'Risks to exotic coastal ecosystems and species', data: null, hazardMenu: null, vulnerabilityMenu: null, areaMenu: null},
    'natural-parks':  {id: 'overview-collapsing-12', file: 'natural_Risks_to_parks_and_blue_green_infrastructure.csv', 
        title: 'Risks to parks and blue-green infrastructure', data: null, hazardMenu: null, vulnerabilityMenu: null, areaMenu: null},
    'natural-endangered':  {id: 'overview-collapsing-13', file: '', 
        title: 'Risks to endangered species', data: null, hazardMenu: null, vulnerabilityMenu: null, areaMenu: null
    },
    'natural-structures':  {id: 'overview-collapsing-29', file: '', 
        title: 'Risks to natural structures, formations, and/or regimes', data: null, hazardMenu: null, vulnerabilityMenu: null, areaMenu: null
    },
    'social-socialcohesion':  {id: 'overview-collapsing-15', file: 'human_Risk_to_social_cohesion_&_community_wellbeing_(incl._Mental_health).csv', 
        title: 'Risk to social cohesion & community wellbeing', data: null, hazardMenu: null, vulnerabilityMenu: null, areaMenu: null
    },
    'social-physicalhealth':  {id: 'overview-collapsing-16', file: 'human_Risk_to_physical_health_from_exposure_to_hazards.csv', 
        title: 'Risk to physical health from exposure to hazards', data: null, hazardMenu: null, vulnerabilityMenu: null, areaMenu: null
    },
    'social-inequalities':  {id: 'overview-collapsing-17', file: 'human_Risk_to_exacerbate_and_create_inequalities.csv', 
        title: 'Risk to exacerbate and create inequalities', data: null, hazardMenu: null, vulnerabilityMenu: null, areaMenu: null
    },
    'social-education':  {id: 'overview-collapsing-18', file: '', 
        title: 'Risk to accessing education', data: null, hazardMenu: null, vulnerabilityMenu: null, areaMenu: null
    },
    'social-medicalcare':  {id: 'overview-collapsing-19', file: '', 
        title: 'Risk to accessing medical care', data: null, hazardMenu: null, vulnerabilityMenu: null, areaMenu: null
    },
    'social-emergency':  {id: 'overview-collapsing-20', file: '', 
        title: 'Risk to accessing emergency services', data: null, hazardMenu: null, vulnerabilityMenu: null, areaMenu: null
    },
    'social-communityservices':  {id: 'overview-collapsing-30', file: 'human_Risk_to_accessing_to_community_services.csv', 
        title: 'Risk to accessing to community services', data: null, hazardMenu: null, vulnerabilityMenu: null, areaMenu: null
    },
    'social-resources':  {id: 'overview-collapsing-31', file: '', 
        title: 'Risk to accessing food/resources', data: null, hazardMenu: null, vulnerabilityMenu: null, areaMenu: null
    },
    'cultural-maorisocial':  {id: 'overview-collapsing-22', file: 'cultural_Risks_to_M?ori_social_and_cultural_wellbeing.csv', 
        title: 'Risks to Māori social and cultural wellbeing', data: null, hazardMenu: null, vulnerabilityMenu: null, areaMenu: null
    },
    'cultural-waiorawellbeing':  {id: 'overview-collapsing-23', file: 'cultural_Risks_to_waiora___wellbeing_health.csv', 
        title: 'Risks to waiora - wellbeing/health', data: null, hazardMenu: null, vulnerabilityMenu: null, areaMenu: null
    },
    'cultural-maoricultural':  {id: 'overview-collapsing-24', file: 'cultural_Risks_to_M?ori_cultural_heritage_sites_pa_marae_w?hi_taonga.csv', 
        title: 'Risks to Māori cultural heritage sites/pa/marae/wāhi taonga', data: null, hazardMenu: null, vulnerabilityMenu: null, areaMenu: null
    },
    'cultural-mahingakai':  {id: 'overview-collapsing-25', file: 'cultural_Risks_to_mahinga_kai_species_mahinga_kai_collection.csv', 
        title: 'Risks to mahinga kai species/mahinga kai collection', data: null, hazardMenu: null, vulnerabilityMenu: null, areaMenu: null
    },
    'cultural-tangatawhenua':  {id: 'overview-collapsing-26', file: '', 
        title: 'Risks to tangata whenua’s locality', data: null, hazardMenu: null, vulnerabilityMenu: null, areaMenu: null
    },
    'cultural-mauriwairua':  {id: 'overview-collapsing-27', file: '', 
        title: 'Risks to mauri, wairua and adaptive capacity', data: null, hazardMenu: null, vulnerabilityMenu: null, areaMenu: null
    },
    'cultural-maoriautonomy':  {id: 'overview-collapsing-32', file: '', 
        title: 'Risks to Māori/tangata whenua’s autonomy/te tiriti rights', data: null, hazardMenu: null, vulnerabilityMenu: null, areaMenu: null
    },
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
        overview_collapsables['overview-collapsing-'+index] = collapser;
        index += 1;
    }

    // Add graphs
    for (var section_name in overview_graph_sections) {
        var section_id = overview_graph_sections[section_name].id;
        var section = $(`#${section_id}`);
        section.html(overview_graph_section_html);

        // Update title
        $(`#${section_id}`).siblings().html(`<ul><li>${overview_graph_sections[section_name].title}</li></ul>`)

        var form_html = '';
        form_html += `<div id="${section_id}-hazard-form"></div>`;
        form_html += `<div class="ari-form" id="${section_id}-ari-form"></div>`;
        form_html += `<div id="${section_id}-area-form"></div>`;
        form_html += `<div class="vulnerability-form" id="${section_id}-vulnerability-form"></div>`;

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


        var vulnerabilityMenu = new vlMultiDropDown(`${section_id}-vulnerability-form`);
        vulnerabilityMenu.populate([['exposed', 'Exposed'], ['low', 'Low'], ['medium', 'Medium'], ['high', 'High']]);
        vulnerabilityMenu.addValue("exposed");
        
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

    updateBigGraph();
    
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
        return d.region.toLowerCase() == overview_region_dropdown.value && d.SLR == overview_slr_value;
    });
    filtered_data.sort((a,b) => a.subdomain.length - b.subdomain.length);
    filtered_data.sort((a,b) => b.consequence_mean - a.consequence_mean);

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

    overview_big_graph = new vlGraph(`overview-display-graph`, final_data, 'subdomain', 'consequence_mean');
    overview_big_graph.x_axis_adjust(3);
    overview_big_graph.y_axis_label("Consequence");
    overview_big_graph.y_axis_adjust(2);
    overview_big_graph.margin_top(40);
    overview_big_graph.margin_right(25);
    overview_big_graph.margin_left(35);
    overview_big_graph.margin_bottom(320);
    overview_big_graph.font_size(13);
    overview_big_graph.x_categories(column_strings);
    overview_big_graph.opacity_column('evidence');
    overview_big_graph.opacity_function(function (n) {return (n)/4;});
    overview_big_graph.hover_text_function(function (row) {
        return "Consequence " + row.consequence_mean + "<br>Evidence " + row.evidence
    });
    overview_big_graph.color_column('domain');
    overview_big_graph.watermark('Draft data');
    overview_big_graph.x_value_in_hover(false);
    overview_big_graph.colors({'Built': '#db7900', 'Natural': '#32b888', 'Cultural': '#c94040', 'Social': '#3e7691'});
    overview_big_graph.x_ticks(7);
    overview_big_graph.line_width(2);
    overview_big_graph.y_tick_size(1);
    overview_big_graph.x_tick_size(3);
    overview_big_graph.y_outer_tick_size(0);
    overview_big_graph.x_outer_tick_size(0);
    overview_big_graph.upper_uncertainty_column('consequence_low');
    overview_big_graph.lower_uncertainty_column('consequence_high');
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


    // Add links to the graph
    $(`#overview-display-graph .vl-x-axis text`).each(function(index) {
        $(this).addClass('overview-big-graph-x-axis-label');
        $(this).on('click', function () {
            var result = filtered_data.filter(d => d.subdomain.toLowerCase().endsWith($(this).text().toLowerCase()));
            result.sort((a,b) => a.subdomain.length - b.subdomain.length);
            openSubdomainSection(result[0]);
        })
    })
}

function importSubdomainGraph(section_name, section_id, section_file) {
    if (section_file && section_file.length > 1) {
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

}


function openSubdomainSection(consequence_row) {
    var domain = consequence_row.domain.toLowerCase();
    if (domain == 'social') domain = 'human';
    setOverviewTab(domain);

    var result = Object.values(overview_graph_sections).filter(d => d.title == consequence_row.subdomain);
    overview_collapsables[result[0].id].open();
    setTimeout(function () {
        $(`#${result[0].id}`).siblings()[0].scrollIntoView();
    }, 100);
}

function updateSubdomainGraphs() {
    for (var section_name in overview_graph_sections) {
        updateSubdomainGraph(section_name);
    }
}
function updateSubdomainGraph(section_name) {
    var section = overview_graph_sections[section_name];

    // FILTER DATA
    var ari_value = section.ariMenu.value;
    var vulnerability_values = section.vulnerabilityMenu.values;
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
        var element_data = section.data[element];

        var filtered_data = element_data.filter(d => {
            return d.hazard == hazard_value && d.region == area_value && vulnerability_values.includes(d.vulnerability);
        });


        // Create parent div
        form_html = `<div id="${section.id}-${element}-graph-div"></div>`;

        $(`#${section.id}`).find('.graph-div').append(form_html);

        // Gen Title
        if (assets[element]) {
            var title = assets[element].display_name;
        } else {
            var title = capitalize(element);
        }


        var linegraph = new vlGraph(`${section.id}-${element}-graph-div`, filtered_data, 'slr', 'percentage', {datasets_column: 'vulnerability'});
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
        linegraph.hover_text_function(function (row) {
            if (row.vulnerability == 'exposed') {
                return row.label + '&nbsp;&nbsp;Exposed';
            } else {
                return row.label + '&nbsp;&nbsp;' + capitalize(row.vulnerability) + ' Vulnerability'
            }
        });
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
        for (var i in overview_collapsables) {
            overview_collapsables[i].reset();
        }
        // Reset collapsing graphs
        for (var graph_name in overview_collapsable_graphs) {
            updateSubdomainGraph(graph_name);
        }
    }
}