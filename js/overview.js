
var current_overview_tab; // The current tab, 'overview' or a domain

var overview_collapsables = [];

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
}
function openPageOverview() {
    if (!current_overview_tab) {
        setOverviewTab('overview');
    }

}
function closePageOverview() {
    
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
    }
}