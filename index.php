<?php 
    switch (basename(dirname(__FILE__, 2))) {
        case "web-dev": {
            $GLOBALS["source_url"] = "https://test.urbanintelligence.co.nz";
        }; break;
        case "website": {
            $GLOBALS["source_url"] = "https://projects.urbanintelligence.co.nz";
        }; break;
        case "home-ui": {
            $GLOBALS["source_url"] = "http://localhost/home-ui";
        }; break;
    }

?>
<script>
  var source_url = "<?=$GLOBALS["source_url"]?>";
</script>
<!DOCTYPE html>
<html lang="en">
<head>
    <!-- Global site tag (gtag.js) - Google Analytics -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=UA-147044719-1"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());

      gtag('config', 'UA-147044719-1');
    </script>
    
    <meta http-equiv="content-type" content="text/html; charset=UTF-8" />
    <script>L_PREFER_CANVAS = false; L_NO_TOUCH = false; L_DISABLE_3D = false;</script>
    <script src="https://cdn.jsdelivr.net/npm/leaflet@1.7.0/dist/leaflet.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/Leaflet.awesome-markers/2.0.2/leaflet.awesome-markers.js"></script>

    <script src="https://cdnjs.cloudflare.com/ajax/libs/leaflet-ajax/2.1.0/leaflet.ajax.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/d3/7.0.1/d3.min.js" integrity="sha512-1e0JvdNhUkvFbAURPPlFKcX0mWu/b6GT9e0uve7BW4MFxJ15q4ZCd/Llz+B7/oh+qhw7/l6Q1ObPt6aAuR01+Q==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/topojson/3.0.2/topojson.min.js" integrity="sha512-4UKI/XKm3xrvJ6pZS5oTRvIQGIzZFoXR71rRBb1y2N+PbwAsKa5tPl2J6WvbEvwN3TxQCm8hMzsl/pO+82iRlg==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>

    <link rel="icon" href="https://projects.urbanintelligence.co.nz/uivl/lib/Urban-Intelligence-Solo-Mark-Light-Blue-Circle-32px.png" sizes="32x32">
    <link rel="icon" href="https://projects.urbanintelligence.co.nz/uivl/lib/Urban-Intelligence-Solo-Mark-Light-Blue-Circle-192px.png" sizes="192x192">

    <title>CHAP - Urban Intelligence</title> 
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/leaflet@1.2.0/dist/leaflet.css" />

    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/Leaflet.awesome-markers/2.0.2/leaflet.awesome-markers.css" />
    <style>html, body {width: 100%;height: 100%;margin: 0;padding: 0;}</style>

    <link rel="stylesheet" href="fcamap.css"/>

    <script src="https://d3js.org/d3.v4.js"></script>

    

    <?php
        require_once("../ui-visual-library/css-links.php");
    ?>
    <!-- Global site tag (gtag.js) - Google Analytics -->
    <!-- <script async src="https://www.googletagmanager.com/gtag/js?id=UA-123686738-4"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());

      gtag('config', 'UA-123686738-4');
    </script> -->


</head>
<body>    
  <div id="show-header-div" class="hide" onclick="hideHeaderAndFooter()">
    <img src="icons/Up-Arrows-White.svg"/>
  </div>
  <table id="body-table">
    <tr id="header-tr">
      <td id="title-td">
        <a href=" https://ccc.govt.nz/environment/coast/adapting-to-sea-level-rise/our-coastal-hazards-adaptation-planning-programme/" target="_blank">
          <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAKYAAAAoCAMAAABD7HHtAAADAFBMVEX///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////+/LkhhAAAA/3RSTlMAAQIDBAUGBwgJCgsMDQ4PEBESExQVFhcYGRobHB0eHyAhIiMkJSYnKCkqKywtLi8wMTIzNDU2Nzg5Ojs8PT4/QEFCQ0RFRkdISUpLTE1O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">
        </a>
        <div>
        Ōtautahi Christchurch Coastal Risk Explorer
        </div>
      </td>
      <td id="menu-td">
        <div id="hide-header-div" onclick="hideHeaderAndFooter()">
          <img src="icons/Up-Arrows-White.svg"/>
        </div>
        <table id="menu-table">
          <tr>
            <td value="home" class="active" onclick="setPage('home')">
              Home
            </td>
            <td value="map" onclick="setPage('map')">
              Map
            </td>
            <td value="overview" onclick="setPage('overview')">
              Risk Summary
            </td>
            <td value="reports" onclick="setPage('reports')">
              Asset Risk
            </td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td id="page-td" colspan="100%">
        <div id="loading-popup">
          <img src="https://projects.urbanintelligence.co.nz/uivl/lib/Logo-Animation.gif"/>
        </div>
        <div class="page active" id="page-home">
          <img class="background" src="src/ChristchurchGreen2.png">
          <div style="width:100%;height:100%;overflow: auto;">
            <table class="page-table" style="width:100%;">
              <tr>
                <td style="text-align: center;position:initial;height:40rem;background-color: transparent;">
                  <div id="home-hero-text-div">
                    <h1>Ōtautahi Christchurch Coastal Risk Explorer</h1>
                  </div>
                </td>
              </tr>
              <tr>
                <td style="text-align: center;">
                  <div class="wave-svg-div">
                    <svg viewBox="0 0 600 60" preserveAspectRatio="none">
                      <!--<path d="M0,30 C200,90 400,-30 600,30 L600,60 L0,60 Z" style="stroke: none; fill:white;"></path>-->
                      <path d="M0,30 C0,30 300,0 600,30 L600,60 L0,60 Z" style="stroke: none; fill:white;"></path>
                    </svg>
                  </div>
                  <div class="introduction-div">
                    <h2>Welcome to the Ōtautahi Christchurch Coastal Risk Explorer.</h2>
                      <br>This explorer shows which assets located along the coastlines, rivers and estuaries of Ōtautahi Christchurch will be impacted by <a href="">sea level rise</a> through coastal flooding, erosion and rising groundwater.  It helps us understand what assets are most exposed and vulnerable to <a href="https://ccc.govt.nz/environment/coast/adapting-to-coastal-hazards/coastalhazards">coastal hazards</a> so that Council, communities and rūnanga can work together through the <a href="https://ccc.govt.nz/environment/coast/adapting-to-sea-level-rise/our-coastal-hazards-adaptation-planning-programme/">coastal hazards adaptation planning programme</a>.
                      to develop plans for the future.  We will work with communities to make sure we haven’t missed assets that people value most. 
                  </div>
                  <div id="home-demo-graphic-div">

                  </div>
                  <div class="introduction-div">
                    <br><br>Click through the tabs across the top of the page, or follow the links below: 
                    <ul>
                      <li>
                      <a onclick="setPage('map')">Map:</a> Explore the impacts of coastal hazards on different assets, from roads, parks and pipes to walkways, community halls and everything in between. See what is most vulnerable and where these assets are located. 
                      </li>
                      <li>
                      <a onclick="setPage('overview')">Risk Summary:</a> Find a summary of the risk posed by coastal hazards across each of the four domains (built, natural, cultural, social). Explore how this risk changes across the district as sea levels rise.
                      </li>
                      <li>
                      <a onclick="setPage('reports')">Asset Risk:</a> Find a summary of the risk posed by coastal hazards to each ‘asset’. 
                      </li>
                    </ul>
                    <div class="contact">Note: This work is currently draft and will be ongoing</div>
                </div>
                </td>
              </tr>
              <tr>
                <td id="home-collapsables-td">
                  <div>
                    <div class="collapsables-header">
                      <h2>About the Christchurch Coastal Risk Explorer</h2>
                    </div>
                  </div>
                  <div>
                    <div id="home-collapse-1" class="vl-collapsing-control">
                      <ul><li>What is a Risk & Vulnerability Assessment?</li></ul>
                    </div>
                    <div id="home-collapsing-1" class="vl-collapsing">
                      We need to understand where people, places and things of value will be exposed to coastal hazards, and just how vulnerable they will be. This will help Council, communities and rūnanga plan for sea level rise and adapt to coastal hazards more effectively. 
                      <br><br>
                      This risk and vulnerability assessment has been completed through a collaboration between the Christchurch City Council, <a target="_blank"  href="https://www.canterbury.ac.nz/engineering/schools/cnre/research/systems/">University of Canterbury</a>, and Urban Intelligence.
                      Together we have identified assets in the built, natural, cultural, and social environments exposed to coastal hazards and with input from many specialists we have assessed how vulnerable these assets are based upon their sensitivity to coastal hazards and their adaptive capacity. 
                      <br><br>
                      The results of this assessment can be seen in the <a onclick="setPage('map')">Map</a>, <a onclick="setPage('overview')">Risk summary</a>, and <a onclick="setPage('reports')">Risk by Asset</a> pages of this explorer. More information on the methodology that sits behind this assessment can be found <a  target="_blank" href="">here.</a>
                    </div>
                  </div>
                  <div>
                    <div id="home-collapse-2" class="vl-collapsing-control">
                      <ul><li>How do we determine risk and vulnerability?</li></ul>
                    </div>
                    <div id="home-collapsing-2" class="vl-collapsing">
                      Hazards only pose a risk when things we care about are in the way of the hazard. To determine the level of risk we need to know what the consequence would be if something of importance was impacted by coastal hazards. To work out the consequence, we need to know how vulnerable something is to the hazard, we do this by looking at the sensitivity and adaptive capacity of an exposed asset (person, place or thing of value). 
                      <ul>
                        <li><b>Sensitivity</b> – The degree to which an asset is affected by coastal hazards.</li>
                        <li><b>Adaptive capacity</b> – The ability an asset has to respond to coastal hazards.</li>
                      </ul>
                      We can predict some consequences with more certainty than others. We are more confident in the level of risk where we have more certainty. How certain or uncertain we are is therefore another important part of understanding risk. Throughout this explorer we have noted how certain we are in the information being provided. 
                      <br><br>
                      Read more in the methodology report <a target="_blank"  href="">here.</a>
                    </div>
                  </div>
                  <div>
                    <div id="home-collapse-3" class="vl-collapsing-control">
                      <ul><li>What hazards are looked at in this explorer?</li></ul>
                    </div>
                    <div id="home-collapsing-3" class="vl-collapsing">
                      <ul style="margin-top: 0;">
                        <li><b>Coastal flooding</b> happens when normally dry, low-lying coastal areas are temporarily flooded by the sea. It is usually caused by a severe storm, but rising sea levels could also cause ‘sunny day flooding’ (where high tides cause flooding even without a storm).
                        </li>
                        <li><b>Coastal erosion</b> occurs when land is eaten away by the sea. Some coastal areas experience short periods of erosion, but then recover (build up again) while others continuously erode and do not recover.
                        </li>
                        <li><b>Rising groundwater</b> brings the water table (under the ground) closer to the surface. Wetter ground can can damage buildings and infrastructure thereby impacting on people’s health. In some cases, groundwater could rise above ground level and cause temporary or permanent ponding of water.
                        </li>
                      </ul>
                      The information on coastal hazards in this explorer comes from the <a target="_blank"  href="https://ccc.govt.nz/assets/Documents/Environment/Coast/CHA/Coastal-Hazards-Assessment-2021-Summary-Report.pdf">2021 Coastal Hazard Assessment Report.</a>
                      You can find out more information about these hazards <a  target="_blank" href="https://ccc.govt.nz/environment/coast/adapting-to-coastal-hazards/coastalhazards">here.</a>
                    </div>
                  </div>
                  <div>
                    <div id="home-collapse-4" class="vl-collapsing-control">
                      <ul><li>How could climate change affect coastal hazards?</li></ul>
                    </div>
                    <div id="home-collapsing-4" class="vl-collapsing">
                      Climate change is raising the level of the sea. Water expands with heat, so warmer temperatures are causing our oceans to expand. At the same time, these higher temperatures are melting icesheets and glaciers, adding more water to the oceans. The result is a rise in sea level that will not only affect the open coast, but means the impacts of high tides and storms will reach further inland, causing more frequent and severe flooding and erosion. This means that more land may be affected by coastal flooding, erosion and rising groundwater in the future, and the severity of the impacts will increase as well.
                    </div>
                  </div>
                  <div>
                    <div id="home-collapse-5" class="vl-collapsing-control">
                      <ul><li>Where has the explorer and our information come from?</li></ul>
                    </div>
                    <div id="home-collapsing-5" class="vl-collapsing">
                      The risk explorer has been developed by Urban Intelligence Ltd and is based upon a vulnerability assessment completed by the <a  target="_blank" href="https://www.canterbury.ac.nz/engineering/schools/cnre/research/systems/">University of Canterbury</a>
                      and supported by the knowledge of technical experts.
                      <br><br>
                      Information on the presence and location of assets has come from a wide range of places, including: Christchurch City Council, Statistics New Zealand, open data sources and through ongoing consultation with communities, rūnanga and other stakeholders as part of the 
                      <a  target="_blank" href="https://ccc.govt.nz/environment/coast/adapting-to-sea-level-rise/our-coastal-hazards-adaptation-planning-programme/">coastal hazards adaptation planning programme.</a>
                      This consultation is important to understand what is valued in the Whakaraupō/Lyttelton area and to make sure we haven't missed anything important.
                      <br><br>
                      Our district, and what is in it, is constantly changing. We will be updating the explorer regularly to help ensure the information being shown is up-to-date. In between these updates there will be times where the latest information on a particular asset, place or thing of value is not shown. If you think we are missing any information then please 
                      <a target="_blank" href="">get in touch</a>, we welcome feedback and suggestions.
                    </div>
                  </div>
                  <!-- EXTRA DROPDOWNS IF NEEDED
                  <div>
                    <div id="home-collapse-6" class="vl-collapsing-control">
                      <ul><li>How could climate change affect coastal hazards?</li></ul>
                    </div>
                    <div id="home-collapsing-6" class="vl-collapsing">
                    </div>
                  </div>
                  <div>
                    <div id="home-collapse-7" class="vl-collapsing-control">
                      <ul><li>Where can I find out more about coastal hazards?</li></ul>
                    </div>
                    <div id="home-collapsing-7" class="vl-collapsing" style="padding-bottom: 40px;">
                    </div>
                  </div>-->
                  <div style="background-color: #DDF0EC; height:20px;">

                  </div>
                </td>
              </tr>
              <tr>
                <td style="width:100%;text-align:center;color: #0004; font-size: 1rem;padding: 5rem 0;">
                  <span style="color: #00000061">
                    This explorer has been developed by Urban Intelligence Ltd as a tool to support the <a target="_blank" style="color: #89bfb3;" href="https://ccc.govt.nz/environment/coast/adapting-to-sea-level-rise/our-coastal-hazards-adaptation-planning-programme/">Christchurch City Council’s coastal hazards adaptation planning programme.</a>
                  </span><br><br>
                  <span style="font-size: 1.6rem;">&#10070;</span><br><br>
                  Urban Intelligence & Christchurch City Council © 2022
                </td>
              </tr>
            </table>
          </div>
          <div id="try-map-popup-arrow"></div>
          <div id="try-map-popup">Try the Map!</div>
        </div>
        <div class="page" id="page-overview">
          <table style="width:100%;height:100%;table-layout:fixed;">
            <tr>
              <td style="width:50%;" id="overview-info-td">
                <div class="shadow"></div>
                <table id="overview-info-table">
                  <tr>
                    <td style="height: 0;">
                      <div id="overview-menu">
                        <div id="overview-menu-human-td" onclick="setOverviewTab('human')">
                          
                          <img src="icons/Human-Tab-Colour.png"><div style="color: #4763B0">Social</div>
                          <div class="shadow"></div>
                        </div>
                        <div id="overview-menu-cultural-td" onclick="setOverviewTab('cultural')">
                          
                          <img src="icons/Cultural-Tab-Colour.png"><div style="color: #751240">Cultural</div>
                          <div class="shadow"></div>
                        </div>
                        <div id="overview-menu-natural-td" onclick="setOverviewTab('natural')">
                          
                          <img src="icons/Natural-Tab-Colour.png"><div style="color: #477D45">Natural</div>
                          <div class="shadow"></div>
                        </div>
                        <div id="overview-menu-built-td" onclick="setOverviewTab('built')" >
                          
                          <img src="icons/Built-Tab-Colour.png"><div style="color: #F58C1F">Built</div>
                          <div class="shadow"></div>
                        </div>
                        <div id="overview-menu-overview-td" onclick="setOverviewTab('overview')" class="active">
                          
                          <img src="icons/Overview-Tab-Colour.png"><div style="color: #12A3A3">Overview</div>
                          <div class="shadow"></div>
                        </div>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td id="overview-summary-td">
                      <table style="width: 100%;height: 100%;">
                        <tr style="height: 0;">
                          <td class="title">

                          </td>
                        </tr>
                        <tr>
                          <td class="content">
                            <div style="height: 100%;width: 100%;" class="nice-scroll">
                              <table class="overview-report-table active" id="overview-overview-table">
                                <tr>
                                  <td>
                                    <p>
                                      This risk explorer shows us how Ōtautahi Christchurch may be impacted across the built, natural, cultural, social  domains by coastal hazards as sea levels rise. 
                                      <br><br>
                                      You can explore the risk in each domain by clicking through the domain tabs above or by clicking on the ‘sub-domains’ shown in the graph to the right. These sub-domains break down the risks in each of the Built (orange), Natural (green), Kaupapa Māori (red) and Social (blue) domains. You will notice some bars are more transparent than others, this represents how certain we are in the information being shown. The more transparent the bar, the less certain we are. You can read more about how we calculate the risk on the home page 
                                      <a onclick="setPage('home')">here</a>.
                                      <br><br>
                                      For those of you looking for even more detail, you can find a complete breakdown of risk by the different assets (people, places or things of value) that make up a sub-domain in the Risk by Asset tab,
                                      <a onclick="setPage('reports')">here</a>.
                                    </p>
                                  </td>
                                </tr>
                              </table>
                              <table class="overview-report-table" id="overview-built-table">
                                <tr>
                                  <td class="domain-summary-td">
                                    <div>
                                      <div class="collapse summary" id="overview-collapse-1"><ul><li>Summary</li></ul></div>
                                      <div class="collapsing" id="overview-collapsing-1">
                                        <p>
                                          The built domain has information on physical infrastructure and assets such as housing, transport, drinking water, waste and stormwater, utilities such as energy and communications, waste and coastal defences. Built assets exist to support communities and are therefore intrinsily connected to the human domain as they provide shelter, drinking water, electricity to heat and cook with, and the ability to travel around the district. 
                                        </p>
                                      </div>
                                    </div>
                                    <div>
                                      <div><h2>Risk to the Built Environment Domain</h2></div>
                                    </div>
                                    <div>
                                      <div class="collapse" id="overview-collapse-2"><ul><li>Risk to potable water supply</li></ul></div>
                                      <div class="collapsing" id="overview-collapsing-2">
                                      </div>
                                    </div>
                                    <div>
                                      <div class="collapse" id="overview-collapse-3"><ul><li>Risk to buildings</li></ul></div>
                                      <div class="collapsing" id="overview-collapsing-3">
                                      </div>
                                    </div>
                                    <div>
                                      <div class="collapse" id="overview-collapse-4"><ul><li>Risk to landfills and contaminated sites</li></ul></div>
                                      <div class="collapsing" id="overview-collapsing-4">
                                      </div>
                                    </div>
                                    <div>
                                      <div class="collapse" id="overview-collapse-5"><ul><li>Risk to wastewater and stormwater</li></ul></div>
                                      <div class="collapsing" id="overview-collapsing-5">
                                      </div>
                                    </div>
                                    <div>
                                      <div class="collapse" id="overview-collapse-6"><ul><li>Risk to transportation</li></ul></div>
                                      <div class="collapsing" id="overview-collapsing-6">
                                        Select hazard:
                                        <br>
                                        Select Vulnerability:
                                        <br>
                                        Select adaptation area:
                                        <br>
                                        Figures:
                                        <br>
                                      </div>
                                    </div>
                                    <div>
                                      <div class="collapse" id="overview-collapse-7"><ul><li>Risk to electricity, energy, and communications</li></ul></div>
                                      <div class="collapsing" id="overview-collapsing-7">
                                      </div>
                                    </div>
                                  </td>
                                </tr>
                                <tr>
                                  <td class="asset-reports-td">

                                  </td>
                                </tr>
                              </table>
                              <table class="overview-report-table" id="overview-cultural-table">
                                <tr>
                                  <td class="domain-summary-td">
                                    <div>
                                      <div class="collapse summary" id="overview-collapse-28"><ul><li>Summary</li></ul></div>
                                      <div class="collapsing" id="overview-collapsing-28">
                                        <p>
                                          Māori social, cultural, spiritual and economic wellbeing are disproportionately threatened by rising sea levels through the loss and degradation of land, water and cultural assets such as marae to coastal hazards. The interconnectedness of these taonga (both physical and non-physical), the perspectives of Tangata Whenua, and Te Ao Māori (a Māori world view), will  be considered throughout the adaptation planning process to ensure the outcomes align with and enhance these values.
                                        </p>
                                      </div>
                                    </div>
                                    <div>
                                      <div><h2>Risk to the Cultural Domain</h2></div>
                                    </div>
                                    <div>
                                      <div class="collapse" id="overview-collapse-22"><ul><li>Risk to potable water supply</li></ul></div>
                                      <div class="collapsing" id="overview-collapsing-22">
                                      </div>
                                    </div>
                                    <div>
                                      <div class="collapse" id="overview-collapse-23"><ul><li>Risk to buildings</li></ul></div>
                                      <div class="collapsing" id="overview-collapsing-23">
                                      </div>
                                    </div>
                                    <div>
                                      <div class="collapse" id="overview-collapse-24"><ul><li>Risk to landfills and contaminated sites</li></ul></div>
                                      <div class="collapsing" id="overview-collapsing-24">
                                      </div>
                                    </div>
                                    <div>
                                      <div class="collapse" id="overview-collapse-25"><ul><li>Risk to wastewater and stormwater</li></ul></div>
                                      <div class="collapsing" id="overview-collapsing-25">
                                      </div>
                                    </div>
                                    <div>
                                      <div class="collapse" id="overview-collapse-26"><ul><li>Risk to transportation</li></ul></div>
                                      <div class="collapsing" id="overview-collapsing-26">
                                        Select hazard:
                                        <br>
                                        Select Vulnerability:
                                        <br>
                                        Select adaptation area:
                                        <br>
                                        Figures:
                                        <br>
                                      </div>
                                    </div>
                                    <div>
                                      <div class="collapse" id="overview-collapse-27"><ul><li>Risk to electricity, energy, and communications</li></ul></div>
                                      <div class="collapsing" id="overview-collapsing-27">
                                      </div>
                                    </div>
                                    <div>
                                      <div class="collapse" id="overview-collapse-32"><ul><li>Risk to electricity, energy, and communications</li></ul></div>
                                      <div class="collapsing" id="overview-collapsing-32">
                                      </div>
                                    </div>
                                  </td>
                                </tr>
                                <tr>
                                  <td class="asset-reports-td">

                                  </td>
                                </tr>
                              </table>
                              <table class="overview-report-table" id="overview-natural-table">
                                <tr>
                                  <td class="domain-summary-td">
                                    <div>
                                      <div class="collapse summary" id="overview-collapse-14"><ul><li>Summary</li></ul></div>
                                      <div class="collapsing" id="overview-collapsing-14">
                                        <p>
                                          The natural domain has information on the presence of native flora, fauna and ecosystems on land and in freshwater and marine environments. These he kura taiao (living treasures) are what remains of the indigenous land cover and habitat that once covered our district. They hold great ecological, cultural, and social significance and as kaitiaki it is our responsibility to protect the integrity of these species and ecosystems, many of which are recognised nationally and internationally for their significance. 
                                        </p>
                                      </div>
                                    </div>
                                    <div>
                                      <div><h2>Risk to the Natural Domain</h2></div>
                                    </div>
                                    <div>
                                      <div class="collapse" id="overview-collapse-8"><ul><li>Risk to potable water supply</li></ul></div>
                                      <div class="collapsing" id="overview-collapsing-8">
                                      </div>
                                    </div>
                                    <div>
                                      <div class="collapse" id="overview-collapse-9"><ul><li>Risk to buildings</li></ul></div>
                                      <div class="collapsing" id="overview-collapsing-9">
                                      </div>
                                    </div>
                                    <div>
                                      <div class="collapse" id="overview-collapse-10"><ul><li>Risk to landfills and contaminated sites</li></ul></div>
                                      <div class="collapsing" id="overview-collapsing-10">
                                      </div>
                                    </div>
                                    <div>
                                      <div class="collapse" id="overview-collapse-11"><ul><li>Risk to wastewater and stormwater</li></ul></div>
                                      <div class="collapsing" id="overview-collapsing-11">
                                      </div>
                                    </div>
                                    <div>
                                      <div class="collapse" id="overview-collapse-12"><ul><li>Risk to transportation</li></ul></div>
                                      <div class="collapsing" id="overview-collapsing-12">
                                        Select hazard:
                                        <br>
                                        Select Vulnerability:
                                        <br>
                                        Select adaptation area:
                                        <br>
                                        Figures:
                                        <br>
                                      </div>
                                    </div>
                                    <div>
                                      <div class="collapse" id="overview-collapse-13"><ul><li>Risk to electricity, energy, and communications</li></ul></div>
                                      <div class="collapsing" id="overview-collapsing-13">
                                      </div>
                                    </div>
                                    <div>
                                      <div class="collapse" id="overview-collapse-29"><ul><li>Risk to electricity, energy, and communications</li></ul></div>
                                      <div class="collapsing" id="overview-collapsing-29">
                                      </div>
                                    </div>
                                  </td>
                                </tr>
                                <tr>
                                  <td class="asset-reports-td">

                                  </td>
                                </tr>
                              </table>
                              <table class="overview-report-table" id="overview-human-table">
                                <tr>
                                  <td class="domain-summary-td">
                                    <div>
                                      <div class="collapse summary" id="overview-collapse-21"><ul><li>Summary</li></ul></div>
                                      <div class="collapsing" id="overview-collapsing-21">
                                        <p>
                                          The social domain has information on indicators of social vulnerability. These acknowledge that some communities and people may have less ability to prepare for, respond to, and recover from coastal hazards than others. Throughout the adaptation planning process we will be engaging with communities that are at risk of coastal hazards and providing opportunities for the contribution of information that we can use to increase our understanding of social vulnerability and ensure communities are supported. 
                                        </p>
                                      </div>
                                    </div>
                                    <div>
                                      <div><h2>Risk to the Social Domain</h2></div>
                                    </div>
                                    <div>
                                      <div class="collapse" id="overview-collapse-15"><ul><li>Risk to potable water supply</li></ul></div>
                                      <div class="collapsing" id="overview-collapsing-15">
                                      </div>
                                    </div>
                                    <div>
                                      <div class="collapse" id="overview-collapse-16"><ul><li>Risk to buildings</li></ul></div>
                                      <div class="collapsing" id="overview-collapsing-16">
                                      </div>
                                    </div>
                                    <div>
                                      <div class="collapse" id="overview-collapse-17"><ul><li>Risk to landfills and contaminated sites</li></ul></div>
                                      <div class="collapsing" id="overview-collapsing-17">
                                      </div>
                                    </div>
                                    <div>
                                      <div class="collapse" id="overview-collapse-18"><ul><li>Risk to wastewater and stormwater</li></ul></div>
                                      <div class="collapsing" id="overview-collapsing-18">
                                      </div>
                                    </div>
                                    <div>
                                      <div class="collapse" id="overview-collapse-19"><ul><li>Risk to transportation</li></ul></div>
                                      <div class="collapsing" id="overview-collapsing-19">
                                        Select hazard:
                                        <br>
                                        Select Vulnerability:
                                        <br>
                                        Select adaptation area:
                                        <br>
                                        Figures:
                                        <br>
                                      </div>
                                    </div>
                                    <div>
                                      <div class="collapse" id="overview-collapse-20"><ul><li>Risk to electricity, energy, and communications</li></ul></div>
                                      <div class="collapsing" id="overview-collapsing-20">
                                      </div>
                                    </div>
                                    <div>
                                      <div class="collapse" id="overview-collapse-30"><ul><li>Risk to electricity, energy, and communications</li></ul></div>
                                      <div class="collapsing" id="overview-collapsing-30">
                                      </div>
                                    </div>
                                    <div>
                                      <div class="collapse" id="overview-collapse-31"><ul><li>Risk to electricity, energy, and communications</li></ul></div>
                                      <div class="collapsing" id="overview-collapsing-31">
                                      </div>
                                    </div>
                                  </td>
                                </tr>
                                <tr>
                                  <td class="asset-reports-td">

                                  </td>
                                </tr>
                              </table>
                            </div>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>

              </td>
              <td id="overview-display-td">
                <div id="overview-controls-div">
                    <div class="slr-form">
                      <div>SLR&nbsp;&nbsp;(cm)</div>
                      <div class="button button-20 active" onclick="overviewBigGraphSLR(20)">20</div>
                      <div class="button button-100" onclick="overviewBigGraphSLR(100)">100</div>
                      <div class="button button-200" onclick="overviewBigGraphSLR(200)">200</div>
                    </div>
                    
                    <div id="overview-controls-region-form" class="region-form">

                    </div>
                </div>
                <div id="overview-display-div">
                    <div id="overview-display-graph"></div>
                </div>
              </td>
            </tr>
          </table>
        </div>
        <div class="page" id="page-reports">
          <table style="width:100%;height:100%;table-layout:fixed;">
            <tr>
              <td style="width:55%;" id="reports-left-td">
                <div class="shadow"></div>
                <table id="reports-menu-table">
                  <tr>
                    <td class="menu-header">
                      <table style="width: 100%;border-spacing: 30px 0;">
                        <tr>
                          <td>
                            <input type="text" id="report-searchbar" name="report-searchbar" placeholder="Search for an asset">
                          </td>
                          <td style="width: 220px">
                            <div id="report-domain-dropdown"></div>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  <tr>
                    <td class="menu-contents">
                      <div class="nice-scroll" style="margin-right: 5px; padding-bottom: 3rem;">
                        <table id="report-menu-results-table">
                        </table>
                      </div>
                    </td>
                  </tr>
                </table>
                <table id="reports-report-table"> <!-- Display none at first -->
                  <tr>
                    <td class="report-header">
                      <h1 class="asset-display-name"></h1>
                      <div class="big-grey-slash" onclick="closeAssetReport()"></div>
                      <div class="mini-grey-slash"></div>
                      <img class="return-icon" src="icons/Return-Arrow-Grey.svg"/>
                    </td>
                  </tr>
                  <tr>
                    <td class="report-contents">
                      <div class="nice-scroll">
                        <table style="width: 100%">
                          <tr>
                            <td class="warning-section">
                              Note: Figures in this report assume the hazard specified, <span class="hazard-summary"></span>, and will change with it.
                            </td>
                          </tr>
                          <tr>
                            <td class="separator-td" colspan="2" style="padding-top: 0.5rem !important;">
                              <div style="background-color: #61a1d6; height: 1px;"></div>
                            </td>
                          </tr>
                          <tr>
                            <td class="exposure-section">
                              <table style="width: 100%;">
                                <tr>
                                  <td class="vulnerability-title-td" colspan="2">
                                    <h1><div>ASSET&nbsp;</div><div style="font-weight: 700;">SUMMARY</div></h1> 
                                  </td>
                                </tr>
                                <tr>
                                  <td class="blue-text-box-td" colspan="2">
                                    <div id="report-exposure-text2"></div>
                                  </td>
                                </tr>
                                <tr>
                                  <td colspan="2" style="padding-top: 10px">
                                    <table style="width: 100%">
                                      <tr>
                                        <td class="vulnerability-icon-td" style="width: 75px;">
                                        <div class="vulnerability-asset-type-icon">
                                            <img class="vulnerability-asset-type-icon" src="icons/Risk-Red.svg" width="100%">
                                          </div>
                                        </td>
                                        <td id="report-exposure-text3" class="vulnerability-bullet-text-td"></td>
                                      </tr>
                                    </table>
                                  </td>
                                </tr>
                                <tr>
                                  <td style="vertical-align: top">
                                    <table style="width: 100%">
                                      <tr>
                                        <td class="vulnerability-icon-td">
                                          <div class="color-box low-vulnerability"></div>
                                        </td>
                                        <td id="report-vulnerability-result1" class="vulnerability-bullet-text-td"></td>
                                      </tr>
                                      <tr>
                                        <td class="vulnerability-icon-td">
                                          <div class="color-box medium-vulnerability"></div>
                                        </td>
                                        <td id="report-vulnerability-result2" class="vulnerability-bullet-text-td"></td>
                                      </tr>
                                      <tr>
                                        <td class="vulnerability-icon-td">
                                          <div class="color-box high-vulnerability"></div>
                                        </td>
                                        <td id="report-vulnerability-result3" class="vulnerability-bullet-text-td"></td>
                                      </tr>
                                      <tr>
                                        <td class="vulnerability-icon-td">
                                          <div class="color-box unspecified-vulnerability"></div>
                                        </td>
                                        <td id="report-vulnerability-result4" class="vulnerability-bullet-text-td"></td>
                                      </tr>
                                    </table>
                                  </td>
                                  <td class="vulnerability-pie-td">
                                    <div class="vulnerability-pie" id="report-vulnerability-graph1"></div>
                                  <td>
                                </tr>
                                <tr>
                                  <td class="separator-td" colspan="2">
                                    <div></div>
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                          <tr>
                            <td class="data-source-section">
                              <table style="width: 100%">
                                <tr>
                                  <td class="vulnerability-title-td" colspan="2">
                                    <h1><div>DATA SOURCE&nbsp;</div><div style="font-weight: 700;">AND METHODS</div></h1> 
                                  </td>
                                </tr>
                                <tr>
                                  <td class="blue-text-box-td" colspan="2">
                                    <div id="report-data-source-text1"></div>
                                  </td>
                                </tr>
                                <tr>
                                  <td id="report-data-source-text2" class="data-source-text-td" colspan="2"></td>
                                </tr>
                                <tr>
                                  <td class="blue-text-box-td" colspan="2">
                                    <div id="report-uncertainty-text1"></div>
                                  </td>
                                </tr>
                                <tr>
                                  <td id="report-uncertainty-text2" class="data-source-text-td" colspan="2"></td>
                                </tr>
                                <tr>
                                  <td class="separator-td" colspan="2">
                                    <div></div>
                                  </td>
                                </tr>
                                <tr>
                                  <td class="vulnerability-title-td" colspan="2">
                                    <h1><div>ASSET&nbsp;</div><div style="font-weight: 700;">RESULTS</div></h1> 
                                  </td>
                                </tr>
                                <tr>
                                  <td class="results-graph-title-td" colspan="2">
                                    <!-- <div style="font-weight: 700; text-align: center;">
                                      ASSET EXPOSURE
                                    </div> -->
                                    <div id="report-graph-dropdown"></div>
                                  </td>
                                </tr>
                                <tr>
                                  <td class="report-exposure-graph" colspan="2">
                                      <div>  
                                        <div id="report-exposure-graph"></div>
                                        <div id="report-exposure-graph2" class="hide">Second graph to be placed here.</div>
                                        <div id="report-exposure-graph3" class="hide">Third graph to be placed here.</div>
                                      </div>
                                    </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                          <tr> <!-- Grey at bottom of report -->
                            <td class="grey-section"></td>
                          </tr>
                        </table>
                      </div>
                    </td>
                  </tr>
                </table>
                <div id="reports-left-td-overlay"></div>
              </td>
              <td style="width:45%;" id="reports-right-td">
                <div id="reports-map-div"></div>
                <div id="report-map-filters-overlay">
                  <div id="report-map-hazard-button" class="hazard-button">
                    <img class="hazard-symbol inundation" src="icons/Inundation-Blue.svg"/>
                    <img class="hazard-symbol groundwater" src="icons/Groundwater-Blue.svg"/>
                    <img class="hazard-symbol erosion" src="icons/Erosion-Blue.svg"/>
                    <div class="hazard-summary">
  
                    </div>
                    <img class="edit-pencil" src="icons/Edit-Pencil-Blue.svg"/>
                  </div>
                  <div class="report-map-dividing-line"></div>
                  <div id="report-map-region-dropdown">

                  </div>
                </div>
                <div id="report-cog-overlay">
                  <img title="Under Development" src="icons/Cog-Blue.svg">
                </div>
                <div class="basemap-switch-overlay">
                  <div class="normal front">
                    <img src="src/normal-basemap.png">
                  </div>
                  <div class="satellite mid">
                    <img src="src/satellite-basemap.png">
                  </div>
                  <div class="contours back">
                    <img src="src/contours-basemap.png">
                  </div>
                </div>
              </td>
            </tr>
          </table>
        </div>
        <div class="page" id="page-map">
          <div id="map-map-div"></div>
          <div id="map-cog-overlay">
            <img title="Under Development" src="icons/Cog-Blue.svg">
          </div>
          <div class="basemap-switch-overlay">
            <div class="normal front">
              <img src="src/normal-basemap.png">
            </div>
            <div class="satellite mid">
              <img src="src/satellite-basemap.png">
            </div>
            <div class="contours back">
              <img src="src/contours-basemap.png">
            </div>
          </div>
          <div id="map-region-overlay">
            <div id="report-map-hazard-button" class="hazard-button">
              <img class="hazard-symbol inundation" src="icons/Inundation-Blue.svg"/>
              <img class="hazard-symbol groundwater" src="icons/Groundwater-Blue.svg"/>
              <img class="hazard-symbol erosion" src="icons/Erosion-Blue.svg"/>
              <div class="hazard-summary">

              </div>
              <img class="edit-pencil" src="icons/Edit-Pencil-Blue.svg"/>
            </div>
            <div class="report-map-dividing-line"></div>
            <div id="map-region-dropdown"></div>
          </div>
          <div id="map-layer-overlay">
            <div class="map-layer-item none-selected no-layer" id="map-layer-item-info">
              <table>
                <tr>
                  <td class="color-td">
                    
                  </td>
                  <!--<td class="handle-td" style="pointer-events: none;">
                  </td>-->
                  <td class="icon-td">
                    <img class="layer-icon" src="icons/Info-Circle-Grey.svg"/>
                  </td>
                  <td class="name-td">
                    No Information Layer
                  </td>
                  <td class="mouse-info-td hide">
                    <img class="layer-button" onclick="switchHoverInfo()" src="icons/Mouse-Info-Grey.svg">
                  </td>
                  <td class="no-mouse-info-td">
                    <img class="layer-button" onclick="switchHoverInfo()" src="icons/No-Mouse-Info-Grey.svg">
                  </td>
                  <td class="eye-td">
                    <img class="layer-button" onclick="hideLayerFromMap('info')" src="icons/Eye-Open-Grey.svg">
                  </td>
                  <td class="eye-closed-td">
                    <img class="layer-button" onclick="showLayerOnMap('info')" src="icons/Eye-Closed-Grey.svg">
                  </td>
                  <td class="pencil-td">
                    <img class="layer-button" onclick="openInfoLayerPopup()" src="icons/Edit-Pencil-Grey.svg"/>
                  </td>
                </tr>
              </table>
            </div>
            <div id="map-layer-add-div">
              <div id="map-layer-cap">
              </div>
              <div id="map-layer-add-button" onclick="showAddLayerPopup()">
                +
              </div>
            </div>
          </div>
        </div>
      </td>
    </tr>
    <tr id="footer-tr">
      <td id="footer-td" colspan="100%">
        <div id="footer">
          <div style="height:2rem;width:100%;overflow:none;">
            <a href="https://urbanintelligence.co.nz/" target="_blank"><img src="https://projects.urbanintelligence.co.nz/uivl/lib/Solo-Mark-Small-White-32px.png"></img></a>
            <div class="attribution">© 2022 Urban Intelligence.</div>
            <div class="contact-text">
              If you have questions or suggestions, you can contact us <a href="mailto:ruby.clark@ccc.govt.nz?subject=Christchurch Coastal Risk Explorer Query: ...">here.</a>
            </div>
            <div style="position: absolute; top: 0; right: 0; float:right;">
              <a href="https://www.canterbury.ac.nz/engineering/schools/cnre/research/systems/" target="_blank"><img style="width: 9rem" src="https://www.canterbury.ac.nz/style-guide/logos/logo-tabs/svg/UC_White_LAN_White.svg"></img></a>
            </div>
          </div>
        </div>
      </td>
    </tr>
  </table>
  <div id="tnc-popup-backdrop" class="popup-backdrop">
    <div id="tnc-popup"  class="popup">
      <table>
        <tr style="height: 0;">
          <td colspan="100%" style="border-bottom: 1px solid #CCC;">
            <h2>Terms and Conditions and Disclaimer</h2>
          </td>
        </tr>
        <tr style="height: 0;">  <!-- TERMS AND CONDITIONS -->
          <td colspan="100%" style="padding-bottom: 2rem;">
            <div class="highlight">
              This website contains information about assets and places of value exposed to coastal hazards in the Christchurch District and is provided as a public service. Please take the time to read the Terms and Conditions and Disclaimer for the use of this website and the information provided. If you agree to these terms, tick the box, and then click the 'Continue' button.
            </div>
          </td>
        </tr>
        <tr style="height: 100%;">
          <td colspan="100%" style="position: relative; border-bottom: 1px solid #CCC;vertical-align: top;padding-top: 0;">
            <div class="nice-scroll" id="tnc-contents-div">
              <ol>
                <li>
                  The Christchurch City Council and its service providers (we, us, our) have developed this Christchurch Coastal Risk & Vulnerability Explorer (website). By clicking the box below, followed by the continue button, you agree that your use of the website and maps is subject to these terms, conditions, and disclaimers.
                </li>
                <li>
                  We have developed the website using information on assets and places of values currently available to us. The existence of these assets and places of value will change over time and the website may therefore not always include the latest information. 
                </li>
                <li>
                  The hazard extent information used in this website comes from the (2021) Coastal Hazard Assessment prepared for the Christchurch City Council by Tonkin + Taylor. This information is based upon the modelling of likely outcomes.  What has actually happened, or may still happen, could be more or less significant than this model.
                </li>
                <li>
                  This website makes an estimate of the vulnerability of assets and places of value to coastal hazard exposure using information currently available to us.
                </li>
                <li>
                  This website should not be relied upon as the sole basis for making any decision in relation to potential risk.
                </li>
                <li>
                  The hazard information provided is district wide in scope and cannot be substituted for a site-specific investigation. A suitably competent practitioner should be engaged if a site-specific investigation is required.
                </li>
                <li>
                  We make no representations, warranties, or undertakings about any of the information contained in the website, including (without limitation), their accuracy, completeness, quality or fitness for any particular purpose.
                </li>
                <li>
                  You acknowledge that we cannot be held liable for any loss or damage arising out of, or in connection with, any person’s use of the information contained in the website and you agree not to hold us liable as such.
                </li>
                <li>
                  We reserve the right to change the content and presentation of information contained in the website or maps at any time at our sole discretion.
                </li>
                <li>
                  Unless otherwise indicated, we own all copyright and any other intellectual property or other proprietary rights in the information contained in the website and the maps, including all relevant modelling techniques and algorithms.
                </li>
                <li>
                  This website is a public service and may be used for personal and business purposes provided that: the source and copyright status of the material is acknowledged; the material is reproduced accurately and it is not used in a derogatory or misleading way; and your use complies with these terms. Without limiting the provisions of the Copyright Act 1994 or other applicable law, you are not permitted to copy or republish any substantial amount of the information from this website without our prior written consent.
                </li>
                <li>
                  We do not guarantee that your use of this website and maps will always be uninterrupted or your access will be error free. The website may be unavailable at times for routine or unscheduled maintenance and may be shut down at any time for any reason.
                </li>
                <li>
                  We do not warrant that this website and maps or the information provided in it will be free of errors, viruses, defects or other harmful components.
                </li>
                <li>
                  This website may rely on the use of cookies, which are small files stored on the hard drive of your computer. We recommend you enable cookies to make the website easier to use but it is up to you whether you enable them or not. Not all features of this website may be available if you do not enable cookies.
                </li>
                <li>
                  We may automatically collect (for example through cookies) the following information from you in connection with your use of the website: 
                  <ol>
                    <li>
                      the Internet Protocol address from which you accessed the website,
                    </li>
                    <li>
                      the date and time you visit, 
                    </li>
                    <li>
                      the pages you accessed, 
                    </li>
                    <li>
                      the terms you used to search for content on this website, and 
                    </li>
                    <li>
                      the type of browser and operating system you use. 
                    </li>
                  </ol>
                </li>
                <li>
                  We may use this information for: 
                  <ol>
                    <li>
                      website administration, 
                    </li>
                    <li>
                      our internal reporting, 
                    </li>
                    <li>
                      improving the website, 
                    </li>
                    <li>
                      auditing website use, 
                    </li>
                    <li>
                      protecting our rights or enforcing these terms, and 
                    </li>
                    <li>
                      for any purpose incidental to those stated here. 
                    </li>
                  </ol>
                </li>
                <li>
                  We will take all reasonable steps to ensure that this information will not be disclosed to any unauthorised person or organisation who is not entitled to obtain this information. You acknowledge, however, that information we collect may be subject to requests made under the Local Government Official Information and Meetings Act 1987.
                </li>
                <li>
                  The information we collect from you through the website may not automatically be personal information. You have the right under the Privacy Act 2020 to access personal information that is held about you and have that information corrected, if it is wrong.
                </li>
                <li>
                  To the extent this website contains hyperlinks to websites operated by others, this is for your reference only and does not imply any approval or endorsement of such sites. We do not operate or control and are not responsible for any information on such sites and are not responsible for the continued functionality of the link.
                </li>
                <li>
                  This website, including these terms and any information contained in the website, may be changed and updated from time to time. We will post any changes to these terms on this website and any change applies from the date it is posted. You accept these terms each time you use this website.
                </li>
                <li>
                  These terms are governed by New Zealand law and any disputes in connection with these terms shall be subject to the exclusive jurisdiction of the Courts of New Zealand. If any provision of these disclaimers and exclusions is unlawful, void or for any reason unenforceable, that provision shall be deemed severable and shall not affect the validity and enforceability of the remaining provisions.
                </li>
              </ol>
            </div>
          </td>
        </tr>
        <tr style="height: 0;">
          <td style="position: relative;" colspan="100%">
            <div style="display: flex;flex-direction:row;flex-wrap:wrap-reverse;justify-content: space-between; gap: 1rem;">
              <div style="flex-grow:4; margin: auto;">
                <a href="https://urbanintelligence.co.nz/" target="_blank" style="text-decoration: none">
                  <img src="src/CCC-logo-black.png" style="margin-right: 20px;height: 32px;top: 2px;position: relative;" aria-hidden="true" alt="Christchurch City Council logo" title="Christchurch City Council logo">
                  <img src="src/UC_UI_Horizontal.svg" style = 'height: 30px;'>
                </a>
              </div>
              <div style="display:flex;flex-direction: row; margin-left: auto; align-items: center;">
                <div style="padding-right: 1.5rem;white-space: nowrap;padding-bottom: 6px;">
                  <input id="tnc-checkbox" type="checkbox" onchange="tncCheckboxChange()"><label for="tnc-checkbox"> I agree to the above Terms and Conditions</label>
                </div>
                <div id="tnc-button" class="button" onclick="tncButtonClick()">Loading...</div>
              </div>
            </div>
          </td>
        </tr>
      </table>
    </div>
  </div>
  <div id="filters-help-popup-backdrop" class="popup-backdrop">
    <div id="filters-help-popup"  class="popup">
      <table>
        <tr>
          <td colspan="2">
            <h1>The Filters Panel</h1>
          </td>
        </tr>
        <tr>
          <td colspan="2">
            <p>Some Text Here ...</p>
          </td>
        </tr>
        <tr>
          <td>
            <h2>Region Dropdown</h2>
            <p>Some Text Here ...</P>
          </td>
          <td>
            <h2>SLR Slider</h2>
            <p>Some Text Here ...</P>
            <h3>SLR Pointers</h3>
            <p>Some Text Here ...</P>
          </td>
        </tr>
        <tr>
          <td rowspan="2">
            <h2>Hazard Dropdown</h2>
            <p>Some Text Here ...</P>
          </td>
          <td>
            <h2>Frequency Slider (Inundation)</h2>
            <p>Some Text Here ...</P>
          </td>
        </tr>
        <tr>
          <td>
            <h2>Year Slider</h2>
            <p>Some Text Here ...</P>
          </td>
        </tr>
        <tr style="height: 0;">
          <td>
          </td>
          <td style="text-align: right;width:50%;">
            <div class="button active" onclick="filtersHelpButtonClick()">Return</div>
          </td>
        </tr>
      </table>
    </div>
  </div>
  </body>
<script>
    
  // If true, enables console logs of core data while running.
  var DEBUGGING = true;
  if (DEBUGGING) console.log("Debugging is currently enabled! Set DEBUGGING to false to disable.")
  var LOADED = false;
</script> 


<?php
    require_once("../ui-visual-library/js-scripts.php");
?>

<!-- LEAFLET GEOJSON VT -->
<script src="deps/leaflet-geojson-vt.js"></script>

<script type="text/javascript" src="js/tools.js"></script>
<script type="text/javascript" src="js/colors.js"></script>

<script type="text/javascript" src="js/load_data.js"></script>

<script type="text/javascript" src="js/filters.js"></script>
<script type="text/javascript" src="js/map.js"></script>
<script type="text/javascript" src="js/reports.js"></script>
<script type="text/javascript" src="js/overview.js"></script>
<script type="text/javascript" src="js/main.js"></script>



<script>
  var LOADED = true;
</script>

