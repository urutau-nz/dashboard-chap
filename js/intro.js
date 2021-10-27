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
      intro: '<table style="width:90%;margin:1rem 5%;"><tr><td id="intro-logo"><img src="https://urbanintelligence.co.nz/wp-content/uploads/2021/05/logo_black_name.png"></img></td>' +
             '<td><h2 style="text-align:left;font-size:1.8rem;">Towards Community Resilience</h2></td></tr></table>' +
             "<p>Having reliable access to the things we need is critical to household-level and community-level resilience after a disruption.<br>" +
             "<br>Use this app to explore and evaluate possible changes in your ability to function in a post-disaster scenario."
    },
]});

intro.start();

