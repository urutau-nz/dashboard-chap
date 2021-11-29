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
      intro: '<table style="width:100%;margin:1rem 0;"><tr><td id="intro-logo"><img src="https://urbanintelligence.co.nz/wp-content/uploads/2021/11/Urban-Intelligence-Stacked-Small-Light-Blue-220px-110px.png"></img></td>' +
             '<td style="width:100%"><h2 style="text-align:left;font-size:1.8rem;color:#04497C">Christchurch City Coastal Hazards Impact Viewer</h2></td></tr></table>' +
             "<p>Adaptation to climate change is intrinsically spatial. To effectively adapt our communities to climate and coastal hazards we must understand who, what, and most importantly, where assets will be impacted.<br>" +
             "<br>Use this interactive webpage to explore the possible impacts of coastal hazards in the next 100+ years.<br>" +
             '<br><span class="contact">Note: This work is currently draft and will be ongoing</span>'
    },
]});

intro.start();

