
var current_report_tab = null;
function setReportTab(tab) {
    if (tab != current_report_tab) {
        $(`#report-menu-${current_report_tab}-td`).removeClass("active");
        $('#report-info-table').removeClass(current_report_tab);
        $('#report-info-table').addClass(tab)

        // Switch filter expand icon to right tab
        $('#page-report .filters-expanding-icon img').attr('src', `./icons/${tab}-Expand.png`);

        // Switch Pointer icons to right tab
        $("#page-report .slr-pointers-div img").attr('src', `./icons/${tab}-Pointer.png`);

        current_report_tab = tab;

        // Set Report Info BG to color of tab
        $("#report-info-td").css("background-color", category_colors[tab]);
        $(`#report-menu-${current_report_tab}-td`).addClass("active");

        switch(tab) {
            case "overview": {
                $("#report-summary-td .title").html(`<h1>Overview</h1>`);

            } break;
            case "built": {
                $("#report-summary-td .title").html(`<h1>Built <span class="field">Domain</span></h1>`);

            } break;
            case "natural": {
                $("#report-summary-td .title").html(`<h1>Natural <span class="field">Domain</span></h1>`);

            } break;
            case "cultural": {
                $("#report-summary-td .title").html(`<h1>Cultural <span class="field">Domain</span></h1>`);

            } break;
            case "human": {
                $("#report-summary-td .title").html(`<h1>Human <span class="field">Domain</span></h1>`);

            } break;
        }
        
        // Switch shown contents
        $(".report-report-table").removeClass('active');
        $(`#report-${tab}-table`).addClass('active');


        // Append Asset Reports

        var contents = `<table style="width: 100%;">`;
        var page_index = 0;
        var page_length = 0;
        var last_letter = ' ';
        var page_letters = [];
        for (var asset_id of Object.keys(assets)) {
            asset = assets[asset_id];
            if (asset.category == tab) {
                if (page_letters.length == 0) {
                    page_letters.push(asset.name[0])
                }
                if (page_length > 6 && asset.name[0] != last_letter) {
                    page_letters[page_index] += '-' + last_letter;
                    page_letters.push(asset.name[0]);
                    page_index += 1;
                    page_length = 0;
                }
                contents += `<tr><td id="${asset.id}-report-td" class="asset-report-td page-${page_index}"></td></tr>`;
                page_length ++;
                last_letter = asset.name[0];
            }
        }
        contents += '</table>';
        $(`#report-${tab}-table .asset-reports-td`).html(contents);

        // Fill out Paginations
        
        contents = `<span class="page-summary" onclick="reportPaginate('summary')">Summary</span>`;
        for (var letter_i in page_letters) {
            var letter = page_letters[letter_i];
            if (letter_i != -1) {
                contents += ' • ';
            }
            contents += `<span class="page-${letter_i}" onclick="reportPaginate(${letter_i})">${letter}</span>`;
        }
        $(`#asset-reports-pagination`).html(contents);
        reportPaginate('summary');

        // Fill out Asset Reports
        
        for (var asset_id of Object.keys(assets)) {
            asset = assets[asset_id];
            if (asset.category == tab) {
                createAssetReport(`${asset.id}-report-td`, asset);

                // Add To Map button 
                $(`#${asset.id}-report-td .asset-report-title-td h2`).append(`<img class="show-on-map-img" src="icons/${tab}-glass.svg" onclick="showAssetOnMap('${asset.id}', '${asset.display_name}')"/>`);
            }
        }

        // Update Domain Status
        var status = domain_status.filter(d => d.domain == tab)[0];
        if (status) {
            $(`#report-${tab}-table .last-updated`).html(status.updated_date);
            $(`#report-${tab}-table .status`).html(status.status);
        }

        // Hide Pagination if Overview
        if (tab == 'overview') {
            reportSwitch("summary");
            $(`#asset-reports-pagination`).css('display', 'none');
            
        } else {
            $(`#asset-reports-pagination`).css('display', 'table-cell');
        }
    }
}

var report_colors = {"overview": "#005652",
"built": "#763100",
"natural": "#037c09",
"cultural": "#780021",
"human": "#34229d"};




function assetReportImageOnError(e) {
    //console.log("Image Error:",e,`${e.className}-td`);
    $(`.${e.className}-td`).html('Sorry - we don\'t have a figure for this asset in this scenario yet.');
}
function createAssetReport(html_id, asset) {

    var asset_item = asset_descriptions.filter(d => d["Asset"].toLowerCase() == asset.name.toLowerCase())[0];
    var description = '';
    if (asset_item) {
        description = (asset_item["Asset Description"] ? asset_item["Asset Description"] : asset_item["asset_description"]);
        description = `
        <tr>
            <td class="asset-report-description-td">
                ${description}
            </td>
        </tr>`;
    }



    $(`#${asset.id}-figure-td`).remove();

    $(`#${html_id}`).html(`
    <table style="width:100%;">
    <tr>
        <td colspan="2" class="asset-report-title-td">
            <h2>${asset.name}</h2>
        </td>
    </tr>
    <tr>
        <td id="${html_id}-${asset.id}-figure-td" class="asset-report-figure-td ${asset.id}-figure-td">
            
        </td>
    </tr>
    ${description}
    <tr>
        <td id="${html_id}-${asset.id}-vulnerability-figure-td" class="asset-report-vulnerability-figure-td ${asset.id}-vulnerability-figure-td">
        </td>
    </tr>
    </table> 
    `); 

    console.log(asset);
    if (hazard_scenario) {
        updateReportFigures(asset);
    }
}
function updateReportFigures(asset) {
    if (!asset) return false;
    
    // EXPOSURE FIGURE
    var image_file = hazard_scenario.substring(0, hazard_scenario.length - 4) + '.tif';
    var asset_importer = new ImportManager();

    var graph_data_file = `${import_url}/data/report_data/${asset.id}/${asset.id}-${image_file}-${region_ids[filter_values.region]}.csv`;

    asset_importer.addImport(asset.id, asset.display_name, 'csv', 
    graph_data_file);

    asset_importer.onComplete(function (d) {
        updateReportFiguresOnComplete(d);
    });
    asset_importer.onError(function (d, e) {
        for (var asset_id in d) {
            // Determine html_id
            if (current_page == 'map') {
                var html_id = 'map-report-sub-div';
            }else {
                var html_id = `${asset_id}-report-td`;
            }

            $(`#${html_id}-${asset_id}-figure-td`).remove();
        }
    });

    asset_importer.runImports();




    // VULNERABILITY FIGURE
    var asset_importer = new ImportManager();
    asset_importer.addImport(asset.id, asset.display_name, 'csv', asset.instances_file_name);

    asset_importer.onComplete(function (d) {
        updateReportVulnerabilityFiguresOnComplete(d);
    });
    asset_importer.onError(function (d, e) {
        for (var asset_id in d) {
            // Determine html_id
            if (current_page == 'map') {
                var html_id = 'map-report-sub-div';
            }else {
                var html_id = `${asset_id}-report-td`;
            }

            $(`#${html_id}-${asset_id}-vulnerability-figure-td`).remove();
        }
    });

    asset_importer.runImports();



}
function updateReportFiguresOnComplete(data) {
    var html_id = "";
    for (var asset_id in data) {
        // Determine html_id
        if (current_page == 'map') {
            var html_id = 'map-report-sub-div';
        }else {
            var html_id = `${asset_id}-report-td`;
        }

        var graph = new vlGraph(`${html_id}-${asset_id}-figure-td`, data[asset_id], 'exposure', 'cumsum');
        graph.x_axis_label(data[asset_id][0].xlabel);
        graph.y_axis_label(data[asset_id][0].ylabel);
        graph.margin_top(10);
        graph.margin_right(30);
        graph.margin_left(30);
        graph.margin_bottom(60);
        graph.min_y(0);
        graph.font_size(12);
        graph.x_suffix('cm');
        graph.y_suffix(data[asset_id][0].unit);
        //graph.background_color('#FFF');, 
        graph.colors(['#0009']);
        graph.x_ticks(8);
        graph.line_width(2);
        graph.dots(false);
        graph.lineGraph();

        all_graphs.push(graph);

    }
}
function updateReportVulnerabilityFiguresOnComplete(data) {
    var html_id = "";
    for (var asset_id in data) {
        // Determine html_id
        if (current_page == 'map') {
            var html_id = 'map-report-sub-div';
        }else {
            var html_id = `${asset_id}-report-td`;
        }

        var graph = new vlGraph(`${html_id}-${asset_id}-vulnerability-figure-td`, data[asset_id], 'vulnerability', null, {
            count_matches: true
        });
        graph.x_axis_label("Vulnerability");
        graph.y_axis_label("Number of Assets");
        graph.margin_top(10);
        graph.margin_right(30);
        graph.margin_left(30);
        graph.margin_bottom(60);
        graph.min_y(0);
        graph.font_size(12);
        graph.y_suffix(' assets');
        //graph.background_color('#FFF');, 
        graph.colors(['#0009']);
        graph.x_ticks(8);
        graph.line_width(2);
        graph.dots(false);
        graph.x_categories({'low': 'Low', 'medium': 'Medium', 'high': 'High'});
        graph.barGraph();

        all_graphs.push(graph);

    }
}

/*

        var image_file = hazard_scenario.substring(0, hazard_scenario.length - 4) + '.tif';
        for (var asset_id in assets) {
            var asset = assets[asset_id];
            $(`.${asset.id}-figure-td`).html(`<img class="${asset.id}-figure" onerror="assetReportImageOnError(this)" src="${import_url}/data/report_figures/${asset.id}/${asset.id}-${image_file}-${region_ids[filter_values.region]}.jpg"/>`);
        }

*/


function showAssetOnMap(asset_id, asset_name) {
    setPage('map');
    mapAsset(asset_id, asset_name);
}


function reportSwitch(type) {
    
    if (type == 'summary') {
        $(`.domain-summary-td`).css('display', 'table-cell');
        $(`.asset-reports-td`).css('display', 'none');
        
        $(`#report-summary-td .switch .summary`).addClass('active');
        $(`#report-summary-td .switch .assets`).removeClass('active');

    } else if (type == 'assets') {
        $(`.asset-reports-td`).css('display', 'table-cell');
        //$(`#asset-reports-pagination`).css('display', 'table-cell');
        $(`.domain-summary-td`).css('display', 'none');
        
        $(`#report-summary-td .switch .assets`).addClass('active');
        $(`#report-summary-td .switch .summary`).removeClass('active');

        
        for (var graph of all_graphs) {
            graph.update();
        }

    }
}




function reportPaginate(page_num) {
    if (page_num == 'summary') {
        reportSwitch('summary');
        $('#report-summary-td .title .field').html('Domain');

    } else {

        $('.asset-report-td').css('display', 'none');
        $(`.asset-report-td.page-${page_num}`).css('display', 'table-cell');
        reportSwitch('assets');

        var letters = $(`#asset-reports-pagination .page-${page_num}`).text();
        $('#report-summary-td .title .field').html('Assets <span style="position: absolute;right: 2rem;">' + letters + '</span>');
    }

    $(`#asset-reports-pagination span`).removeClass('active');
    $(`#asset-reports-pagination .page-${page_num}`).addClass('active');
}