var intro = introJs();
intro.setOptions({
  tooltipClass: "intro_tour",
  highlightClass: "intro_high",
  overlayOpacity: 0.55,
  showStepNumbers: false,
  skipLabel: "Quit",
  doneLabel: "Let's go!",
  prevLabel: "≪",
  nextLabel: "≫",
  scrollToElement: false,
  tooltipPosition: 'top',
  exitOnOverlayClick: true,
  showBullets: false,
  steps: [
    {
      intro: "<h2>WREMO: Evaluating Level of Service</h2>" +
             "<p>This site enables you to evaluate level's of infrastructure and essential services in Wellington following a major earthquake.</p>" +
             "<p>Further instructions will be provided here.</p>"
            //  "<p>To generate your own results, you will have to prepare a CSV file with two columns: 2010 Census tracts, and the amount of a resource supplied.  The two columns should be labeled “geoid” and “supply.”  The input format is illustrated with the default, <a href=il_doctors.csv>il_doctors.csv</a> data, and we have also prepared a <a href=https://github.com/GeoDaCenter/GeoDaCenter.github.io/raw/master/docs/LiveAPP_Documentation.pdf>detailed manual</a>, with instructions for preparing these inputs from scratch.</p>" + 
            //  "<p>All access measures will run simultaneously on AWS; depending on your geography, this may take up to a minute.  GEOIDs not matching 2010 tracts are dropped.</p>" 
    },
]});

intro.start();

