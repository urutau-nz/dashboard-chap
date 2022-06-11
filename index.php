<?php 
    switch (dirname(__FILE__, 2)) {
        case "/home/web-dev": {
            $GLOBALS["domain"] = "test";
        }; break;
        case "/home/website": {
            $GLOBALS["domain"] = "projects";
        }; break;
    }

?>
<script>
  var domain = "<?=$GLOBALS["domain"]?>";
</script>
<!DOCTYPE html>
<html lang="en">
<head>

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
          Christchurch Coastal Risk Explorer
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
            <td value="overview" onclick="setPage('overview')">
              Overview
            </td>
            <td value="reports" onclick="setPage('reports')">
              Reports
            </td>
            <td value="map" onclick="setPage('map')">
              Map
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
                    <h1>Christchurch Coastal Risk Explorer</h1>
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
                    <h2>Welcome to the Coastal Risk & Vulnerability Explorer for Christchurch.</h2>
                      <br>This website highlights the vulnerability of assets, and places of environmental, cultural and social value that will be exposed to coastal hazards across the Christchurch District. <br>
                      <br>The assessment of vulnerability has been completed by the <a href="https://www.canterbury.ac.nz/engineering/schools/cnre/research/systems/"  target="_blank">University of Canterbury</a> and uses hazard information from the <a href="https://ccc.govt.nz/environment/coast/adapting-to-coastal-hazards/coastalhazards/how-we-assess-coastal-hazards/" target="_blank">2021 Coastal Hazard Assessment</a>. This explorer has been developed by Urban Intelligence Ltd as a tool to support the <a href="https://ccc.govt.nz/environment/coast/adapting-to-sea-level-rise/our-coastal-hazards-adaptation-planning-programme/" target="_blank">Christchurch City Council’s coastal hazards adaptation planning programme</a>.
                      <br><br>You can browse the explorer by clicking the three other tabs across the top of the page:
                      <ul>
                        <li>
                          <span>Home:</span> An introduction to the Coastal Risk Explorer, the methodology that sits behind it, and the answers to some frequently asked questions.
                        </li>
                        <li>
                        <a onclick="setPage('overview')">Overview:</a> A summary of each domain considered in the Explorer.
                        </li>
                        <li>
                        <a onclick="setPage('reports')">Reports:</a> Individual asset information and risk assessment results.
                        </li>
                        <li>
                        <a onclick="setPage('map')">Map:</a> Maps that allow you to visualise the exposure and understand the vulnerability of different assets and places of value to coastal hazards. 
                        </li>
                      </ul>
                      <div class="contact">Note: This work is currently draft and will be ongoing</div>
                  </div>
                </td>
              </tr>
              <tr>
                <td style="width:100%;">
                  <div id="home-tablets-div">
                    <div class="header">How will your community be affected by:</div>
                    <div id="home-tablets-highlight">
                      <div class="home-tablet">
                        <div>
                          <img src="src/Coastal Erosion.jpg">
                        </div>
                        <div>
                          Coastal Erosion
                        </div>
                      </div>
                      <div class="home-tablet">
                        <div>
                          <img src="src/Storm Surge.jpg">
                        </div>
                        <div>
                          Coastal Flooding
                        </div>
                      </div>
                      <div class="home-tablet">
                        <div>
                          <img src="src/Sunny Flood.jpg">
                        </div>
                        <div>
                          Rising Groundwater
                        </div>
                      </div>
                    </div>
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
                      <ul><li>Risk & Vulnerability Assessment</li></ul>
                    </div>
                    <div id="home-collapsing-1" class="vl-collapsing">
                      To effectively prepare and adapt our communities to coastal hazards we must 
                      understand who, what, and where assets, taonga and places of value will be 
                      impacted. A Risk Assessment takes what we know about coastal hazards and 
                      identifies <b>who and what</b> will be exposed to these hazards as sea levels rise. 
                      Where possible, we have looked at the sensitivity and adaptive capacity 
                      (vulnerability) of these sectors, assets, and taonga (elements) to understand 
                      potential consequences from sea level rise, helping us understand the risk posed
                      by coastal hazards across the district. <br><br>
                      This interactive map and dashboard help us to visualise this risk and how it is 
                      distributed across the district. It also helps us understand how the risk is spread 
                      across the built, natural, cultural, and social domains within any given area; 
                      information that will help to guide adaptation planning.
                    </div>
                  </div>
                  <div>
                    <div id="home-collapse-2" class="vl-collapsing-control">
                      <ul><li>Why is an understanding of risk and vulnerability important?</li></ul>
                    </div>
                    <div id="home-collapsing-2" class="vl-collapsing">
                      Christchurch City Council and our communities are beginning to adapt to climate
                      change. As part of this work we have updated our <a href="https://ccc.govt.nz/assets/Documents/Environment/Coast/CHA/Coastal-Hazards-Assessment-2021-Summary-Report.pdf" target="_blank">Coastal Hazard Assessment</a> 
                      which provides information on which locations will be impacted by coastal hazards. Coastal hazards become a risk when we have
                      elements that are exposed and vulnerable to these hazards. Understanding what and where is at
                      risk helps us to understand where we need to work with affected rūnanga and 
                      communities and develop adaptation plans. <br><br>
                      The Risk and Vulnerability Assessment takes our understanding of which 
                      locations will be exposed to coastal hazards as sea-levels rise and adds in what 
                      we know about the elements in these locations, estimating how vulnerable these
                      things are. Understanding how vulnerable these things are helps us to 
                      understand the management priorities within a location and guide the 
                      development of adaptation plans to address the particular risk in each location.
                    </div>
                  </div>
                  <div>
                    <div id="home-collapse-3" class="vl-collapsing-control">
                      <ul><li>How do we determine the risk to an element?</li></ul>
                    </div>
                    <div id="home-collapsing-3" class="vl-collapsing">
                      Risk is a combination of consequences and associated uncertainty. The 
                      uncertainty is based on the strength of evidence underlying the assessment and 
                      our understanding of the relevant processes. To understand the consequences, 
                      we need to estimate the:
                      <ul>
                        <li><b>Exposure</b>&nbsp;&#8211; What assets and places of value will be affected by coastal 
                          hazards?</li>
                        <li><b>Vulnerability</b>&nbsp;&#8211; What is the impact of some level of exposure on the 
                          element? This is based on the element’s sensitivity and adaptive capacity.</li>
                        <li><b>Sensitivity</b>&nbsp;&#8211; The degree to which the element is affected by coastal 
                          hazards.</li>
                        <li><b>Adaptive capacity</b>&nbsp;&#8211; What ability does the element have to respond to 
                          the consequence of coastal hazard exposure or take advantage of any 
                          opportunities?</li>
                      </ul>
                    </div>
                  </div>
                  <div>
                    <div id="home-collapse-4" class="vl-collapsing-control">
                      <ul><li>Where have we sourced information on assets and places of value?</li></ul>
                    </div>
                    <div id="home-collapsing-4" class="vl-collapsing">
                      Information on the presence & location of assets, taonga and places of value has 
                      been collated from a range of sources including the District Plan, Christchurch 
                      City Council, Statistics New Zealand, open data portals, and through consultation
                      with rūnanga. The coastal hazard adaptation planning process will involve further
                      consultation with exposed communities and rūnanga on what they value in their 
                      area, information that can then be added and shown in the Explorer. <br><br>
                      This is an iterative process. Our district, what is in it, and the hazards we face, 
                      are changing. It is expected that the Risk Explorer will be updated on a regular 
                      basis to ensure the information being used is up-to-date. This may result in 
                      periods of time where the latest information on a particular asset type is not 
                      shown in the Explorer. We welcome feedback and suggestions to ensure the 
                      information is as complete as possible.
                    </div>
                  </div>
                  <div>
                    <div id="home-collapse-5" class="vl-collapsing-control">
                      <ul><li>What hazards are included?</li></ul>
                    </div>
                    <div id="home-collapsing-5" class="vl-collapsing">
                      This 2021 Coastal Hazard Assessment considers:
                      <ul>
                        <li><b>Coastal flooding</b> happens when normally dry, low-lying coastal areas are
                          temporarily flooded by the sea. It is usually caused by a severe storm, but 
                          rising sea levels could also cause ‘sunny day flooding’ (where high tides 
                          cause flooding even without a storm).</li>
                        <li><b>Coastal erosion</b> is a natural process that occurs when land is removed by
                          the sea. Some coastal areas experience short periods of erosion, but then 
                          recover (build up again) while others continuously erode and do not 
                          recover.</li>
                        <li><b>Rising groundwater</b> can bring the water table (under the ground) close 
                          to the ground surface. This wet ground can impact people’s health, 
                          buildings, infrastructure and how the land can be used. In some cases, 
                          groundwater could rise above ground level and cause temporary or 
                          permanent ponding of water.</li>
                      </ul>
                    </div>
                  </div>
                  <div>
                    <div id="home-collapse-6" class="vl-collapsing-control">
                      <ul><li>How could climate change affect coastal hazards?</li></ul>
                    </div>
                    <div id="home-collapsing-6" class="vl-collapsing">
                      Climate change is slowly raising the level of the sea. Water expands with heat, 
                      so warmer temperatures are causing our oceans to expand. At the same time, 
                      these higher temperatures are melting icesheets and glaciers which adds more 
                      water to the oceans. The result is a rise in sea level that will not only affect the 
                      open coast, but also allow high tides and the effects of storms to reach further 
                      inland and cause more frequent and severe flooding and erosion. This means 
                      that more land may be affected by coastal flooding, erosion and rising 
                      groundwater in the future, and the severity of those impacts would likely be 
                      greater.
                    </div>
                  </div>
                  <div>
                    <div id="home-collapse-7" class="vl-collapsing-control">
                      <ul><li>Where can I find out more about coastal hazards?</li></ul>
                    </div>
                    <div id="home-collapsing-7" class="vl-collapsing" style="padding-bottom: 40px;">
                      For more information about coastal hazards and adapting to sea level rise, visit 
                      the (Adapting to Coastal Hazards 
                      Page)[https://ccc.govt.nz/environment/coast/adapting-to-coastal-hazards] on the 
                      Council website. The ‘Coastal hazards’ section of the website includes the 
                      <a href="https://ccc.govt.nz/assets/Documents/Environment/Coast/CHA/Coastal-Hazards-Assessment-2021-Summary-Report.pdf" target="_blank">2021 Coastal Hazard Assessment Report</a>
                      , as well as many other technical reports on coastal hazards.
                    </div>
                  </div>
                  <div style="background-color: #edf1f0; height:20px;">

                  </div>
                </td>
              </tr>
              <tr>
                <td style="width:100%;text-align:center;color: #0004; font-size: 1rem;padding: 5rem 0;">
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
              <td style="width:45%;" id="overview-info-td">
                <div class="shadow"></div>
                <table id="overview-info-table">
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
                                    Welcome to the Coastal Risk & Vulnerability Explorer for Christchurch. This tool explores the effects that coastal hazards may have on communities across the Christchurch District over time. You can explore this risk through four 'value domains’ – the built, natural, social and cultural environments. These domains reflect the NZ Treasury’s wellbeing framework and underpin the wellbeing of our communities and environment. 
                                      <br><br>
                                      To use the tool:
                                    </p>
                                      <ul>
                                        <li>Select the domain you would like to explore</li>
                                        <li>Select a hazard scenario you would like to explore</li>
                                        <li>View the corresponding report or map using the tabs at the top of the page.</li>
                                      </ul>
                                  </td>
                                </tr>
                              </table>
                              <table class="overview-report-table" id="overview-built-table">
                                <tr>
                                  <td class="domain-summary-td">
                                    <p>
                                    The built domain has information on a range of infrastructure across the district. Many of the assets included in this domain play an important role in day to day life, such as providing provide shelter, drinking water, electricity to heat and cook with, or the ability to travel around the district. The built domain is therefore an important consideration in coastal hazards adaptation planning. The Explorer helps us to understand:
                                    </p>
                                    <ul>
                                      <li>What elements are exposed to coastal hazards?</li>
                                      <li>How vulnerable each elements is and the service it provides to coastal hazards?</li>
                                      <li>What would be the consequence of losing that infrastructure, asset or service for communities and for the Council?</li>
                                      <li>Would the loss of that infrastructure, asset, or service have a domino effect, impacting other built, natural, cultural, or social sectors, assets, and taonga (elements)?</li>
                                    </ul>
                                    <h2>Status</h2>
                                    <span style="font-style: italic; font-size: 0.8em;">Last updated: <span class="last-updated"></span></span>
                                    <p class="status"></p>
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
                                    <p>
                                    Māori social, cultural, spiritual and economic wellbeing are at risk from loss and degradation of lands and waters, as well as cultural assets such as marae, due to ongoing sea-level rise and other coastal processes. Climate change and associated coastal hazards disproportionately threatens both the tangible components that contribute to Māori well-being as well as the intangible spiritual components 
                                    <a href="http://www.maramatanga.ac.nz/sites/default/files/teArotahi_7_21-1910%20Climate%20Change_Awatere.pdf" target="_blank">(Awatere et al. 2021)</a>. Furthermore, it is possible that these tangible and intangible components may not only be threatened by the changing climate but also possible interventions to protect current infrastructure. 
                                    
                                    <br><br>
                                    To ensure that current taonga (both physical and non-physical) are appropriately considered as communities begin adaptation interventions, we must understand where these taonga are and how they will be impacted under various hazard scenarios that are likely to be seen within the following 100 years.
                                    </p>
                                    <h2>Status</h2>
                                    <span style="font-style: italic; font-size: 0.8em;">Last updated: <span class="last-updated"></span></span>
                                    
                                    <p class="status"></p>
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
                                    <p>
                                    The natural domain has information on terrestrial, freshwater and marine ecosystems that support indigenous flora and fauna – he kura taiao (living treasures). We have a number of nationally and internationally significant ecosystems and species across the Christchurch district. As kaitiaki, it is our responsibility to protect the integrity of these ecosystems and understand the impact that the loss of these taonga would have on the wider wellbeing of communities. 
                                    <br><br>
                                    Many species have the adaptive capacity enabling them to respond to changes in their environment, allowing them to be more resilient to coastal hazards than others. How these dynamic ecosystems and species might respond to climate change and coastal hazards has been estimated, allowing us to consider how different adaptation options might impact these significant ecosystems both now and in the future. Including the natural domain in the Explorer allows us to understand:
                                    </p>
                                    <ul>
                                      <li>What significant ecosystems, flora and fauna will be exposed to coastal hazards over time?</li>
                                      <li>How vulnerable are those ecosystems, flora and fauna to coastal hazards over time?</li>
                                      <li>Where do potential adaptation options need to align with the natural value of an area?</li>
                                      <li>Where can coastal hazards adaptation planning support the continued adaptation and migration of natural systems and species in response to climate change?</li>
                                    </ul>
                                    <h2>Status</h2>
                                    <span style="font-style: italic; font-size: 0.8em;">Last updated: <span class="last-updated"></span></span>
                                    
                                    <p class="status"></p>
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
                                    <p>
                                    The human domain has information on indicators of social vulnerability. Social vulnerability acknowledges that some communities and people may have less capacity to prepare for, respond to, and recover from coastal hazards than others. We will be looking to support communities throughout the adaptation planning process and to do this we need to understand where there might be:
                                    </p>
                                    <ul>
                                      <li>Risks to social cohesion and community wellbeing</li>
                                      <li>Risk of exacerbating existing inequities and creating new inequities</li>
                                      <li>Risks to physical health</li>
                                      <li>Risks of conflict, disruption, and loss of trust in local government</li>
                                      <li>Risks to Maori social, cultural, spiritual, and economic wellbeing</li>
                                      <li>Risks to mental health, identity, autonomy, and sense of belonging and wellbeing</li>
                                      <li>Risks to Maori and European cultural heritage sites</li>
                                    </ul>
                                    <p>
                                    It is not possible to quantify the impacts on our communities using the same top-down approach used for built infrastructure in this Explorer. The layers of information we have mapped in this domain help to indicate where communities may be impacted by these vulnerabilities. For example, the exposure of a residential home may result in impacts on the physical and mental health of the residents. 
                                    <br><br>
                                    Throughout the adaptation planning process we will be engaging with communities that are at risk of coastal hazards and providing opportunities for the contribution of information that we can either add into the Explorer or use to help ensure steps are taken to support the health and wellbeing of communities. 
                                    </p>
                                    <h2>Status</h2>
                                    <span style="font-style: italic; font-size: 0.8em;">Last updated: <span class="last-updated"></span></span>
                                    
                                    <p class="status"></p>
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
              <td style="width:160px;">
                <table id="overview-menu-table">
                  <tr>
                    <td id="overview-menu-overview-td" onclick="setOverviewTab('overview')" class="active">
                      Overview
                      <img src="icons/Overview-Tab.png">
                      <div class="shadow"></div>
                    </td>
                  </tr>
                  <tr>
                    <td id="overview-menu-built-td" onclick="setOverviewTab('built')" >
                      Built<br>Domain
                      <img src="icons/Built-Tab.png">
                      <div class="shadow"></div>
                    </td>
                  </tr>
                  <tr>
                    <td id="overview-menu-natural-td" onclick="setOverviewTab('natural')">
                      Natural Domain
                      <img src="icons/Natural-Tab.png">
                      <div class="shadow"></div>
                    </td>
                  </tr>
                  <tr>
                    <td id="overview-menu-cultural-td" onclick="setOverviewTab('cultural')">
                      Cultural Domain
                      <img src="icons/Cultural-Tab.png">
                      <div class="shadow"></div>
                    </td>
                  </tr>
                  <tr>
                    <td id="overview-menu-human-td" onclick="setOverviewTab('human')">
                      Social Domain
                      <img src="icons/Human-Tab.png">
                      <div class="shadow"></div>
                    </td>
                  </tr>
                </table>
              </td>
              <td style="width:55%;">
                
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
                      <div class="nice-scroll" style="margin-right: 5px;">
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
                        <table>
                          <tr>
                            <td class="warning-section">
                              Note: Figures in this report assume the hazard specified, <span class="hazard-summary"></span>, and will change with it.
                            </td>
                          </tr>
                          <tr>
                            <td class="exposure-section">
                              <table>
                                <tr>
                                  <td class="exposure-graph-td">
                                    <div id="report-exposure-graph"></div>
                                  </td>
                                  <td id="report-exposure-text1" class="exposure-text-td">
                                  Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat. Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat.
                                  </td>
                                </tr>
                                <tr>
                                  <td id="report-exposure-text2" class="exposure-text2-td" colspan="2">
                                  Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat. Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat.
                                  </td>
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
                            <td class="vulnerability-section">
                              <table>
                                <tr>
                                  <td class="vulnerability-title-td" colspan="2">
                                    <h1><div>ASSET&nbsp;</div><div style="font-weight: 700;">VULNERABILITY</div></h1> 
                                  </td>
                                </tr>
                                <tr>
                                  <td class="blue-text-box-td" colspan="2">
                                    <div id="report-vulnerability-text1">
                                      Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. 
                                    </div>
                                  </td>
                                </tr>
                                <tr>
                                  <td class="vulnerability-graph-td">
                                    <div id="report-vulnerability-graph1"></div>
                                  </td>
                                  <td id="report-vulnerability-text2" class="vulnerability-graph-text-td">
                                    Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud
                                  </td>
                                </tr>
                                <tr>
                                  <td class="vulnerability-graph-td">
                                    <div id="report-vulnerability-graph2"></div>
                                  </td>
                                  <td id="report-vulnerability-text3" class="vulnerability-graph-text-td">
                                    Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud
                                  </td>
                                </tr>
                                <tr>
                                  <td class="vulnerability-graph-td">
                                    <div id="report-vulnerability-graph3"></div>
                                  </td>
                                  <td id="report-vulnerability-text4" class="vulnerability-graph-text-td">
                                    Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud
                                  </td>
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
                            <td class="uncertainty-section">
                              <table>
                                <tr>
                                  <td class="vulnerability-title-td">
                                    <h1><div>UNCERTAINTY&nbsp;</div><div style="font-weight: 700;">ASSESSMENT</div></h1> 
                                  </td>
                                </tr>
                                <tr>
                                  <td class="blue-text-box-td">
                                    <div id="report-uncertainty-text1">
                                      Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. 
                                    </div>
                                  </td>
                                </tr>
                                <tr>
                                  <td  id="report-uncertainty-text2" class="data-source-text-td">
                                  Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrudLorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrudLorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrudLorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam,
                                  </td>
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
                              <table>
                                <tr>
                                  <td class="vulnerability-title-td">
                                    <h1><div>DATA SOURCE&nbsp;</div><div style="font-weight: 700;">AND METHODS</div></h1> 
                                  </td>
                                </tr>
                                <tr>
                                  <td class="blue-text-box-td">
                                    <div id="report-data-source-text1">
                                      Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. 
                                    </div>
                                  </td>
                                </tr>
                                <tr>
                                  <td  id="report-data-source-text2" class="data-source-text-td">
                                  Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrudLorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrudLorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrudLorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam,
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                          <tr> <!-- Grey at bottom of report -->
                            <td class="grey-section">
                              
                            </td>
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
              </td>
            </tr>
          </table>
        </div>
        <div class="page" id="page-map">
          <div id="map-map-div"></div>
          <div id="map-cog-overlay">
            <img title="Under Development" src="icons/Cog-Blue.svg">
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
                <a href="https://urbanintelligence.co.nz/" target="_blank">
                  <img src="src/UC_UI_Horizontal.svg" style = 'height: 35px;'>
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
            <p>Some Text Here ...</P>
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

