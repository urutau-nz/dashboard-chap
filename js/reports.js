
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
        for (var asset_id of Object.keys(assets)) {
            asset = assets[asset_id];
            if (asset.category == tab) {
                contents += `<tr><td id="${asset.id}-report-td" class="asset-report-td"></td></tr>`;
            }
        }
        contents += '</table>';
        $(`#report-${tab}-table .asset-reports-td`).html(contents);
        
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

        // Hide Switch if Overview
        if (tab == 'overview') {
            reportSwitch("summary");
            $(`#report-summary-td .switch`).css('display', 'none');
            
        } else {
            $(`#report-summary-td .switch`).css('display', 'table-cell');
        
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
        description = asset_item["Asset Description"];
        description = `
        <tr>
            <td class="asset-report-description-td">
                ${description}
            </td>
        </tr>`;
    }

    var category = category_titles[asset.category];

    var image_file = hazard_scenario.substring(0, hazard_scenario.length - 4) + '.tif';

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
        <td class="asset-report-domain-td" style="color: #934300bb">
            ${category}
        </td>
    </tr>
    <tr>
        <td>
        </td>
    </tr>
    </table> 
    `); 

    console.log(asset);
    if (hazard_scenario) {
        var asset_importer = new ImportManager();

        var graph_data_file = `${import_url}/data/report_data/${asset.id}/${asset.id}-${image_file}-${region_ids[filter_values.region]}.csv`;
        console.log(graph_data_file);

        asset_importer.addImport(asset.id, asset.display_name, 'csv', 
        graph_data_file);

        asset_importer.onComplete(function (d) {
            updateReportFigures(d, html_id);
        });
        asset_importer.onError(function (d, e) {
            for (var asset_id in d) {
                $(`#${html_id}-${asset_id}-figure-td`).remove();
            }
        });

        asset_importer.runImports();
    }
    //updateReportFigures();
}
function updateReportFigures(data, html_id) {
    for (var asset_id in data) {
        var graph = new vlGraph(`${html_id}-${asset_id}-figure-td`, data[asset_id], 'exposure', 'cumsum', '', data[asset_id][0].xlabel, data[asset_id][0].ylabel);
        graph.margin_top(30);
        graph.margin_right(30);
        graph.margin_left(60);
        graph.margin_bottom(60);
        graph.font_size(14);
        graph.x_suffix('cm');
        graph.y_suffix(' assets');
        graph.background_color('#FFF');
        graph.lineGraph();

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
        $(`.domain-summary-td`).css('display', 'none');
        
        $(`#report-summary-td .switch .assets`).addClass('active');
        $(`#report-summary-td .switch .summary`).removeClass('active');

        
        for (var graph of all_graphs) {
            graph.update();
        }

    }
}