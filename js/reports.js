
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
                $("#report-summary-td .title").html(`<h1>Built Domain</h1>`);

            } break;
            case "natural": {
                $("#report-summary-td .title").html(`<h1>Natural Domain</h1>`);

            } break;
            case "cultural": {
                $("#report-summary-td .title").html(`<h1>Cultural Domain</h1>`);

            } break;
            case "human": {
                $("#report-summary-td .title").html(`<h1>Human Domain</h1>`);

            } break;
        }
        
        // Switch shown contents
        $(".report-report-table").removeClass('active');
        $(`#report-${tab}-table`).addClass('active');

        // Append Asset Reports
        var contents = `<table style="width: 100%;padding-top: 3rem;"><tr><td><h1>${tab.substring(0,1).toUpperCase() + tab.substring(1)} Assets</h1></td></tr>`;
        for (var asset_id in assets) {
            asset = assets[asset_id];
            if (asset.category == 'built') {
                contents += `<tr><td id="${asset.id}-report-td"></td></tr>`;
            }
        }
        contents += '</table>';
        $(`#report-${tab}-table .asset-reports-td`).html(contents);
        
        for (var asset_id in assets) {
            asset = assets[asset_id];
            if (asset.category == 'built') {
                createAssetReport(`${asset.id}-report-td`, asset.display_name);
            }
        }
    }
}

var report_colors = {"overview": "#005652",
"built": "#763100",
"natural": "#037c09",
"cultural": "#780021",
"human": "#34229d"};




function assetReportImageOnError(e) {
    //console.log("Image Error:",e);
    $(`#${e.id}-td`).html('Sorry - we don\'t have a figure for this asset in this scenario yet.');
}
function createAssetReport(html_id, asset_name) {

    var asset_item = asset_descriptions.filter(d => d["Asset"].toLowerCase() == asset_name.toLowerCase())[0];
    if (!asset_item) {
        $(`#${html_id}`).html(`<table style="width:100%;">
        <tr>
            <td colspan="2" class="asset-report-title-td">
                <h2>${asset_name}</h2>
            </td>
        </tr>
        <tr>
            <td class="asset-report-description-td">
                Sorry - we don't have a report for this asset yet.
            </td>
        </tr>
        <tr>
            <td class="asset-report-domain-td">
            </td>
        </tr>
        </table>
        `);
        return false;
    }

    var description = asset_item["Asset Description"];
    var domain = asset_item["Domain"];

    var image_file = hazard_scenario.substring(0, hazard_scenario.length - 4) + '.tif';

    $(`#${html_id}`).html(`
    <table style="width:100%;">
    <tr>
        <td colspan="2" class="asset-report-title-td">
            <h2>${asset_name}</h2>
        </td>
    </tr>
    <tr>
        <td class="asset-report-description-td">
            ${description}
        </td>
        <td rowspan="3" id="${html_id}-figure-td" class="asset-report-figure-td">
            <img id="${html_id}-figure" onerror="assetReportImageOnError(this)" src="https://${domain}.urbanintelligence.co.nz/chap/data/report_figures/${asset_name}-${image_file}.jpg"/>
        </td>
    </tr>
    <tr>
        <td class="asset-report-domain-td" style="color: #934300bb">
            ${domain} Domain
        </td>
    </tr>
    <tr>
        <td>
        </td>
    </tr>
    </table>
    `);
}