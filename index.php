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
<head>

    <meta http-equiv="content-type" content="text/html; charset=UTF-8" />
    <script>L_PREFER_CANVAS = false; L_NO_TOUCH = false; L_DISABLE_3D = false;</script>
    <script src="https://cdn.jsdelivr.net/npm/leaflet@1.7.0/dist/leaflet.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/Leaflet.awesome-markers/2.0.2/leaflet.awesome-markers.js"></script>

    <script src="https://cdnjs.cloudflare.com/ajax/libs/leaflet-ajax/2.1.0/leaflet.ajax.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/d3/7.0.1/d3.min.js" integrity="sha512-1e0JvdNhUkvFbAURPPlFKcX0mWu/b6GT9e0uve7BW4MFxJ15q4ZCd/Llz+B7/oh+qhw7/l6Q1ObPt6aAuR01+Q==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/topojson/3.0.2/topojson.min.js" integrity="sha512-4UKI/XKm3xrvJ6pZS5oTRvIQGIzZFoXR71rRBb1y2N+PbwAsKa5tPl2J6WvbEvwN3TxQCm8hMzsl/pO+82iRlg==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>

    <link rel="icon" href="https://urbanintelligence.co.nz/wp-content/uploads/2021/11/Urban-Intelligence-Solo-Mark-Light-Blue-Circle-32px.png" sizes="32x32">
    <link rel="icon" href="https://urbanintelligence.co.nz/wp-content/uploads/2021/11/Urban-Intelligence-Solo-Mark-Light-Blue-Circle-192px.png" sizes="192x192">

    <title>CHAP - Urban Intelligence</title> 
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/leaflet@1.2.0/dist/leaflet.css" />

    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/Leaflet.awesome-markers/2.0.2/leaflet.awesome-markers.css" />
    <style>html, body {width: 100%;height: 100%;margin: 0;padding: 0;}</style>

    <link rel="stylesheet" href="fcamap.css"/>

    <script src="https://d3js.org/d3.v4.js"></script>

    

    <?php
        require_once("../ui-visual-library/css-links-" . $GLOBALS["domain"] . ".php");
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

  <table id="body-table">
    <tr>
      <td id="title-td">
        <a href=" https://ccc.govt.nz/environment/coast/adapting-to-sea-level-rise/our-coastal-hazards-adaptation-planning-programme/" target="_blank">
          <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAKYAAAAoCAMAAABD7HHtAAADAFBMVEX///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////+/LkhhAAAA/3RSTlMAAQIDBAUGBwgJCgsMDQ4PEBESExQVFhcYGRobHB0eHyAhIiMkJSYnKCkqKywtLi8wMTIzNDU2Nzg5Ojs8PT4/QEFCQ0RFRkdISUpLTE1O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">
        </a>
        <div>
          Christchurch Coastal Risk Explorer
        </div>
      </td>
      <td id="menu-td">
        <table id="menu-table">
          <tr>
            <td value="overview" class="active" onclick="setPage('overview')">
              Overview
            </td>
            <td value="report" onclick="setPage('report')">
              Report
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
          <div class="object-backdrop"></div>
          <img src="https://projects.urbanintelligence.co.nz/uivl/lib/Logo-Animation.gif"/>
          <div class="text">
            Loading Resources...
          </div>
        </div>
        <div class="page active" id="page-overview">
          <img class="background" src="src/CHCH Map BW.jpg">
          <div style="width:100%;height:100%;overflow: auto;">
            <table style="width:100%;margin: 4.5rem 0;">
              <tr>
                <td style="text-align: center;">
                  <div style="display:inline-block; max-width: 55rem; color: #444;background-color: white; border-radius: 4rem; box-shadow: 0 0 2rem white;">
                    <h1>Christchurch Coastal Risk Explorer</h1>
                  </div>
                </td>
              </tr>
              <tr>
                <td style="text-align: center;">
                  <div style="display:inline-block; max-width: 55rem;text-align: justify;">
                    <p>Adaptation to climate change is intrinsically spatial. To effectively adapt our communities to climate and coastal hazards we must understand who, what, and most importantly, where assets will be impacted.<br>
                      <br>Use this interactive webpage to explore the possible impacts of coastal hazards in the next 100+ years.<br>
                      <br></p><div class="contact">Note: This work is currently draft and will be ongoing</div>
                  </div>
                </td>
              </tr>
              <tr>
                <td style="width:100%;">
                  <table id="overview-info-table" style="width:100%;text-align: center;">
                    <tr>
                      <td>
                        <img src="src/Coastal Erosion.jpg">
                      </td>
                      <td>
                        <img src="src/Storm Surge.jpg">
                      </td>
                      <td>
                        <img src="src/Sunny Flood.jpg">
                      </td>
                    </tr>
                    <tr>
                      <td style="width:33%">
                        16km of roading infrastructure may become eroded by 2150.
                      </td>
                      <td style="width:33%">
                        15,000 residential properties are at risk from coastal flooding by 2150.
                      </td>
                      <td style="width:33%">
                        Rising groundwater will reduce our capacity to deal with heavy rainfall events and jeopardise local residents' health and wellbeing.
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              <tr>
                <td style="width:100%;text-align:center;color: #0004; font-size: 1.3rem;padding-top: 4rem;">
                  <span style="font-size: 2rem;">&#10070;</span><br><br>
                  Urban Intelligence & Christchurch City Council © 2022
                </td>
              </tr>
            </table>
          </div>
          <div id="try-map-popup-arrow"></div>
          <div id="try-map-popup">Try the Map!</div>
        </div>
        <div class="page" id="page-report">
          <table style="width:100%;height:100%;">
            <tr>
              <td style="width:50%;" id="report-info-td">
                <div class="shadow"></div>
                <table id="report-info-table">
                  <tr>
                    <td id="report-summary-td">
                      <table style="width: 100%;height: 100%;">
                        <tr style="height: 0;">
                          <td class="title">

                          </td>
                        </tr>
                        <tr>
                          <td class="content">
                            <div style="height: 100%;width: 100%;" class="nice-scroll">
                              <table class="report-report-table active" id="report-overview-table">
                                <tr>
                                  <td>
                                    Welcome to the Coastal Hazards Risk Explorer for Christchurch City. This tool explores the effects of coastal hazards on our communities in Christchurch, through four different domains. These domains were chosen because they encompass all aspects that are critical to a safe, sustainable, and liveable city.
                                    <br><br>
                                    To use the tool:
                                    <ul>
                                      <li>Select the domain of interest</li>
                                      <li>Select a hazard scenario in the filter box below</li>
                                      <li>View the available report section or map using the tabs in the top right-hand side of the screen</li>
                                    </ul>
                                  </td>
                                </tr>
                              </table>
                              <table class="report-report-table" id="report-built-table">
                                <tr>
                                  <td>
                                    The built domain contains all aspects of our constructed environment, these assets provide critical supporting services to the livelihoods of our residents. Assessing and protecting our built domain ensures that communities have a roof over their heads, water to drink, electricity to heat and cook with, ways to get around and more. Including this domain allows for the exploration of the impact on the built infrastructure and it’s cascading impacts to other domains.
                                    <br><br>
                                    <h2>Status</h2>
                                    <span style="font-style: italic; font-size: 0.8em;">Last updated: 17/01/2022</span>
                                    <br><br>
                                    First iteration for exposure complete. Next steps include testing with CHAP team, enhancing data resolutions, converting exposure to risk through vulnerability functions, and refining the asset reports.
                                  </td>
                                </tr>
                                <tr>
                                  <td class="asset-reports-td">

                                  </td>
                                </tr>
                              </table>
                              <table class="report-report-table" id="report-cultural-table">
                                <tr>
                                  <td>
                                    Māori social, cultural, spiritual and economic wellbeing are at risk from loss and degradation of lands and waters, as well as cultural assets such as marae, due to ongoing sea-level rise and other coastal processes. Climate change and associated coastal hazards disproportionately threatens both the tangible components that contribute to Māori well-being as well as the intangible spiritual components 
                                    <a href="http://www.maramatanga.ac.nz/sites/default/files/teArotahi_7_21-1910%20Climate%20Change_Awatere.pdf" target="_blank">(Awatere et al. 2021)</a>. Furthermore, it is possible that these tangible and intangible components may not only be threatened by the changing climate but also possible interventions to protect current infrastructure. 
                                    <br><br>
                                    To ensure that current taonga (both physical and non-physical) are appropriately considered as communities begin adaptation interventions, we must understand where these taonga are and how they will be impacted under various hazard scenarios that are likely to be seen within the following 100 years.
                                    <br><br>
                                    <h2>Status</h2>
                                    <span style="font-style: italic; font-size: 0.8em;">Last updated: 17/01/2022</span>
                                    <br><br>
                                    Currently developing a methodology with TRONT GIS team to capture things and places (data) of value at an appropriate resolution such to remove any sensitivity whilst retaining enough context/nuance that effective decisions can be made. This method will be further tested with the Rāpaki runanga before implementation.
                                    <br><br>
                                    Meeting with TRONT GIS representative this month.
                                  </td>
                                </tr>
                              </table>
                              <table class="report-report-table" id="report-natural-table">
                                <tr>
                                  <td>
                                    The natural domain pertains to all aspects of the natural environment that support the full range of our indigenous species, he kura taiao (living treasures), and the ecosystems in terrestrial, freshwater and marine environments. As Kaitaki it is our responsibility to assess and manage risks to the natural environment. But we do not do this merely out of responsibility, but also to protect our social, cultural, spiritual and economic wellbeing of communities. Through the NCCRA we know that these attributes can become impacted due to degradation of land, waterways, mahinga kai, and more.
                                    <br><br>
                                    This inclusion of this domain aims to understand natural species, ecosystems, and sites of natural amenity may be impacted over the next 100+ years and identify if there are options to protect these assets.
                                    <br><br>
                                    <h2>Status</h2>
                                    <span style="font-style: italic; font-size: 0.8em;">Last updated: 17/01/2022</span>
                                    <br><br>
                                    Currently developing a methodology and data with CCC subject matter experts. Next step is to add flora layer and test internally before developing vulnerability thresholds.
                                  </td>
                                </tr>
                              </table>
                              <table class="report-report-table" id="report-human-table">
                                <tr>
                                  <td>
                                    The human domain includes the health and wellbeing of people as individuals and as a community. It takes a Hauora approach (Holistic health philosophy) and includes our physical, social, mental and spiritual health. This domain has been included with the aim of understanding how the capacity and health of our communities will be impacted whilst highlighting potential areas for adaptation.
                                    <br><br>
                                    <h2>Status</h2>
                                    <span style="font-style: italic; font-size: 0.8em;">Last updated: 17/01/2022</span>
                                    <br><br>
                                    Awaiting finalised approach. Will begin to add social deprivation, exposure, and isolation information this month. This will be iterated with a bottom up approach that utilises information gathered from community engagement.
                                  </td>
                                </tr>
                              </table>
                            </div>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  <tr>
                    <td class="filters-td">
                      
                    </td>
                  </tr>
                </table>

              </td>
              <td>
                <table id="report-menu-table">
                  <tr>
                    <td id="report-menu-overview-td" onclick="setReportTab('overview')" class="active" style="background-color: #54ebbc; color: #005652dd">
                      Overview
                      <img src="icons/Overview-Tab.png">
                      <div class="shadow"></div>
                    </td>
                  </tr>
                  <tr>
                    <td id="report-menu-built-td" onclick="setReportTab('built')" style="background-color: #ffcb6d; color: #763100dd;">
                      Built<br>Domain
                      <img src="icons/Built-Tab.png">
                      <div class="shadow"></div>
                    </td>
                  </tr>
                  <tr>
                    <td id="report-menu-natural-td" onclick="setReportTab('natural')" style="background-color: #a6ff8b; color: #037c09dd;">
                      Natural Domain
                      <img src="icons/Natural-Tab.png">
                      <div class="shadow"></div>
                    </td>
                  </tr>
                  <tr>
                    <td id="report-menu-cultural-td" onclick="setReportTab('cultural')" style="background-color: #ff8686; color: #780021dd;">
                      Cultural Domain
                      <img src="icons/Cultural-Tab.png">
                      <div class="shadow"></div>
                    </td>
                  </tr>
                  <tr>
                    <td id="report-menu-human-td" onclick="setReportTab('human')" style="background-color: #A4A4FF; color: #34229ddd;">
                      Human Domain
                      <img src="icons/Human-Tab.png">
                      <div class="shadow"></div>
                    </td>
                  </tr>
                </table>
              </td>
              <td style="width:50%;">
                
              </td>
            </tr>
          </table>
        </div>
        <div class="page" id="page-map">
          <table style="width:100%;height:100%;">
            <tr>
              <td style="width:50%;" id="map-info-td">
                <div class="shadow"></div>
                <table id="map-info-table" class="none">
                  <tr>
                    <td id="map-domains-td">
                      <div id="map-domains-div" class="nice-scroll map-menu-div">
                        <table id="map-domains-table" class="map-menu-table">
                          <tr>
                            <td style="text-align: center; border-bottom: 1px solid #CCC;">
                              <h2>Choose a Domain</h2>
                            </td>
                          </tr>
                          <tr style="height: 100%">
                            <td style="text-align: center; height:100px;">
                              <table id="map-domains-menu-table" class="map-menu-menu-table">
                                <tr>
                                  <td class="built-button" onclick="mapDomain('built')">
                                    <img src="./icons/Built-Tab@120px.png"/>
                                    <h3>Built Domain</h3>
                                  </td>
                                  <td class="natural-button" onclick="mapDomain('natural')">
                                    <img src="./icons/Natural-Tab@120px.png"/>
                                    <h3>Natural Domain</h3>
                                  </td>
                                </tr>
                                <tr>
                                  <td class="cultural-button" onclick="mapDomain('cultural')">
                                    <img src="./icons/Cultural-Tab@120px.png"/>
                                    <h3>Cultural Domain</h3>
                                  </td>
                                  <td class="human-button" onclick="mapDomain('human')">
                                    <img src="./icons/Human-Tab@120px.png"/>
                                    <h3>Human Domain</h3>
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                        </table>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td id="map-assets-td">
                      <div id="map-assets-div" class="nice-scroll map-menu-div">
                        <div id="map-assets-return-div" onclick="mapDomainReturn()">
                          Return
                        </div>
                        <table id="map-assets-table" class="map-menu-table">
                          <tr>
                            <td style="text-align: center; padding: 0;">
                              <h1><span class="domain"></span> Assets</h1>
                            </td>
                          </tr>
                          <tr style="height: 100%;">
                            <td style="text-align: center; padding: 0 2rem 2rem 2rem;">
                              <table id="map-assets-menu-table" class="map-menu-menu-table">

                              </table>
                            </td>
                          </tr>
                        </table>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td id="map-report-td">
                      <div id="map-report-div">
                        <div id="map-report-return-div" onclick="mapAssetReturn()">
                          Return
                        </div>
                        <table id="map-report-table">
                          <tr>
                            <td id="map-report-header-td" style="text-align: center;">
                              <h1></h1>
                            </td>
                          </tr>
                          <tr>
                            <td id="map-report-sub-td">
                              <div id="map-report-sub-div" class='nice-scroll'>
                                <table id="map-report-sub-table">
  
                                </table>
                              </div>
                            </td>
                          </tr>
                        </table>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td class="filters-td">
                      
                    </td>
                  </tr>
                </table>
              </td>
              <td id="map-td">
                <div id="map-div">

                </div>
                <div id="mouse-info"></div>
              </td>
            </tr>
          </table>
        </div>
      </td>
    </tr>
    <tr>
      <td id="footer-td">
        <div id="footer">
          <div style="height:2rem;width:100%;overflow:none;">
            <a href="https://urbanintelligence.co.nz/" target="_blank"><img src="https://urbanintelligence.co.nz/wp-content/uploads/2021/11/Solo-Mark-Small-White-32px.png"></img></a>
            <div class="attribution">© 2022 Urban Intelligence.</div>
            <div style="position: absolute; top: 0; right: 0; float:right;">
              <a href="https://www.canterbury.ac.nz/engineering/schools/cnre/research/systems/" target="_blank"><img style="width: 9rem" src="https://www.canterbury.ac.nz/style-guide/logos/logo-tabs/svg/UC_White_LAN_White.svg"></img></a>
            </div>
          </div>
          </div>
      </td>
    </tr>
  </table>
  <div id="tnc-popup-backdrop">
    <div id="tnc-popup">
      <table>
        <tr style="height: 0;">
          <td colspan="100%" style="border-bottom: 1px solid #CCC;">
            <h2>Terms and Conditions and Disclaimer</h2>
          </td>
        </tr>
        <tr style="height: 0;">
          <td colspan="100%">
            <div class="highlight">
              This website contains information about coastal hazards in the Christchurch District and is provided as a public service. Please take the time to read the Terms and Conditions and Disclaimer for the use of this website and the information provided. If you agree to these terms, tick the box, and then click the 'Continue' button.
            </div>
          </td>
        </tr>
        <tr style="height: 100%;">
          <td colspan="100%" style="border-bottom: 1px solid #CCC;vertical-align: top;padding-top: 0;">
            <div id="tnc-contents-div">
              The information this website provides is currently being developed. Urban Intelligence Ltd. and the University of Canterbury are not liable for any decisions made based on this information.
            </div>
          </td>
        </tr>
        <tr style="height: 0;">
          <td style="position: relative;">
            <a href="https://urbanintelligence.co.nz/" target="_blank">
              <img src="src/uc_ui_horizontal_logo.png" style = 'position: absolute; top: 1.1rem; height: 35px; left: 1.4rem'>
            </a>
          </td>
          <td style="float: right;padding-top: 1.3rem;font-size: 1.1rem;">
            <div>
              <input id="tnc-checkbox" type="checkbox" onchange="tncCheckboxChange()"><label for="tnc-checkbox"> I agree to the above Terms and Conditions</label>
            </div>
          </td>
          <td style="width:0;">
            <div id="tnc-button" onclick="tncButtonClick()">Loading...</div>
          </td>
        </tr>
      </table>
    </div>
  </div>
    <!--
  <div class="folium-map" id="map" ></div>
  <div id="help-popup"></div>
  <div id="dist-graph"></div>-->
</body>
<script>
    
  // If true, enables console logs of core data while running.
  var DEBUGGING = true;
  if (DEBUGGING) console.log("Debugging is currently enabled! Set DEBUGGING to false to disable.")
  var LOADED = false;
</script> 


<?php
    require_once("../ui-visual-library/js-scripts-" . $GLOBALS["domain"] . ".php");
?>

<!-- LEAFLET GEOJSON VT -->
<script src="https://unpkg.com/geojson-vt@3.2.0/geojson-vt.js"></script>
<script src="deps/leaflet-geojson-vt.js"></script>

<script type="text/javascript" src="js/tools.js"></script>
<script type="text/javascript" src="js/colors.js"></script>

<script type="text/javascript" src="js/load_data.js"></script>

<script type="text/javascript" src="js/map.js"></script>
<script type="text/javascript" src="js/reports.js"></script>
<script type="text/javascript" src="js/interface.js"></script>



<script>
  var LOADED = true;
</script>

